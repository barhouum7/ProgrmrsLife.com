/**
 * POST /api/survey/submit — Save feedback survey responses
 * 
 * Stores user survey answers in the database for analytics.
 */

import prisma from '../../../lib/prisma';
import crypto from 'crypto';

const getUserId = (req) => req.cookies.userId || crypto.randomUUID();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const userId = getUserId(req);
        const { answers } = req.body;

        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Survey answers are required.',
            });
        }

        // Validate required fields
        const { rating, discovery, usage } = answers;
        if (!rating || !discovery || !usage) {
            return res.status(400).json({
                success: false,
                error: 'Rating, discovery source, and usage frequency are required.',
            });
        }

        // Check if user already submitted a survey recently (within 24h)
        const recentSurvey = await prisma.surveyResponse.findFirst({
            where: {
                userId,
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (recentSurvey) {
            // Update existing instead of creating duplicate
            await prisma.surveyResponse.update({
                where: { id: recentSurvey.id },
                data: { answers },
            });

            return res.status(200).json({
                success: true,
                message: 'Survey updated. Thank you for your feedback!',
                id: recentSurvey.id,
            });
        }

        // Create new survey response
        const survey = await prisma.surveyResponse.create({
            data: {
                userId,
                answers,
            },
        });

        // Set cookie for user tracking
        res.setHeader('Set-Cookie', `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`);

        return res.status(201).json({
            success: true,
            message: 'Thank you for your feedback!',
            id: survey.id,
        });

    } catch (error) {
        console.error('Survey Submit Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to save survey response',
        });
    }
}
