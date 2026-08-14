/**
 * GET /api/links — Multi-source link aggregator endpoint
 * 
 * Returns Canva Pro invite links from all enabled sources:
 * scrapers, community submissions, and optionally X API.
 * 
 * Query params:
 *   ?force=true  — Bypass cache and re-run source cascade
 */

import { fetchCanvaLinks } from '../../../lib/sources/index';
import { mockLinks } from '../../../lib/mockLinks';
import prisma from '../../../lib/prisma';

const isMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

function transformLink(link) {
    return {
        id: link.id,
        url: link.url,
        source: link.source,
        sourceRef: link.sourceRef,
        authorName: link.authorName,
        status: link.status,
        created_at: link.createdAt ? new Date(link.createdAt).toISOString() : new Date().toISOString(),
        fetched_at: link.fetchedAt ? new Date(link.fetchedAt).toISOString() : new Date().toISOString(),
    };
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const forceFetch = req.query.force === 'true';

        let links, sources, cached, error;

        if (isMockData) {
            // Use mock data in development
            links = mockLinks;
            sources = [{ name: 'mock', count: mockLinks.length }];
            cached = false;
            error = null;

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
        } else {
            const result = await fetchCanvaLinks(forceFetch);
            links = result.links;
            sources = result.sources;
            cached = result.cached;
            error = result.error;
        }

        // Only fail if we have a hard error AND no links at all
        if (error && (!links || links.length === 0)) {
            console.error('Link Aggregator Error:', error);
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch links from any source.',
            });
        }

        const transformedLinks = links.map(transformLink);

        // Get source configs for status display
        const sourceConfigs = await prisma.sourceConfig.findMany({
            select: {
                sourceType: true,
                enabled: true,
                lastRunAt: true,
                lastRunSuccess: true,
            },
        }).catch(() => []);

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            count: transformedLinks.length,
            links: transformedLinks,
            sources,
            sourceConfigs,
            cached,
        };

        if (error) {
            response.warning = error.message;
        }

        // Never cache at CDN/browser — our server-side DB cache handles freshness
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.status(200).json(response);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch links',
            message: error.message,
        });
    }
}
