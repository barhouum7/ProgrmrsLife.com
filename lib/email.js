/**
 * Email Notification System — lib/email.js
 *
 * Sends transactional emails for premium access events.
 * Uses nodemailer. Configure via env vars.
 *
 * Required env vars:
 *   EMAIL_HOST          — SMTP host (e.g. smtp.gmail.com)
 *   EMAIL_PORT          — SMTP port (default 465)
 *   EMAIL_USER          — SMTP username / from address
 *   AUTH_EMAIL_PASS     — SMTP password or app password
 *   AUTH_EMAIL_ADDRESS
 *   EMAIL_FROM_NAME     — Display name (default: "ProgrmrsLife")
 *   NEXT_PUBLIC_SITE_URL — Site URL for links in emails
 */

import nodemailer from 'nodemailer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.progrmrslife.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'ProgrmrsLife.com';
const FROM_ADDR = process.env.EMAIL_USER || 'noreply@progrmrslife.com';

let _transporter = null;

function getTransporter() {
    if (_transporter) return _transporter;
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.AUTH_EMAIL_ADDRESS || !process.env.AUTH_EMAIL_PASS) {
        console.warn('[Email] Missing env vars (EMAIL_HOST, EMAIL_USER, AUTH_EMAIL_ADDRESS, AUTH_EMAIL_PASS). Emails disabled.');
        return null;
    }
    _transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '465', 10),
        secure: (process.env.EMAIL_PORT || '465') === '465',
        auth: {
            user: process.env.AUTH_EMAIL_ADDRESS,
            pass: process.env.AUTH_EMAIL_PASS,
        },
    });
    return _transporter;
}

async function sendEmail({ to, subject, html, text }) {
    const transporter = getTransporter();
    if (!transporter) return { success: false, reason: 'Email not configured' };
    try {
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_ADDR}>`,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]+>/g, ''),
        });
        console.log(`[Email] Sent "${subject}" to ${to} — msgId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error(`[Email] Failed to send "${subject}" to ${to}:`, err.message);
        return { success: false, reason: err.message };
    }
}

// ─── TEMPLATE HELPERS ────────────────────────────────────────────────

function baseTemplate(content) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ProgrmrsLife</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">ProgrmrsLife</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Canva Pro Team Access</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(139,92,246,0.15);">
            <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;">
              &copy; ${new Date().getFullYear()} ProgrmrsLife &bull;
              <a href="${SITE_URL}/canva-pro-invites" style="color:rgba(139,92,246,0.7);text-decoration:none;">Canva Pro Hub</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────────────────

/**
 * Sent when user submits their premium request
 */
export async function sendRequestReceivedEmail(email) {
    return sendEmail({
        to: email,
        subject: '🚀 Your Canva Pro request has been received!',
        html: baseTemplate(`
            <h2 style="color:#a78bfa;margin-top:0;">We received your request!</h2>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                Thanks for completing the tasks! Your request to join our exclusive
                <strong style="color:#fff;">Canva Pro team</strong> is now pending review.
            </p>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                We'll manually review your submission and add you to the team as soon as possible.
                You'll get another email the moment your request is approved.
            </p>
            <div style="margin:28px 0;padding:16px;background:rgba(139,92,246,0.1);border-radius:10px;border-left:3px solid #7c3aed;">
                <p style="margin:0;color:rgba(255,255,255,0.6);font-size:13px;">
                    💡 <strong style="color:#fff;">Tip:</strong> You can check the status of your request anytime
                    by visiting the Canva Pro Hub page.
                </p>
            </div>
            <a href="${SITE_URL}/canva-pro-invites" style="display:inline-block;margin-top:4px;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                Check Status →
            </a>
        `),
    });
}

/**
 * Sent when admin approves a request (access granted soon)
 */
export async function sendRequestApprovedEmail(email) {
    return sendEmail({
        to: email,
        subject: '✅ Great news — your Canva Pro request is approved!',
        html: baseTemplate(`
            <h2 style="color:#34d399;margin-top:0;">You're approved! 🎉</h2>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                Your request to join our <strong style="color:#fff;">Canva Pro team</strong>
                has been approved. We're now processing your access — you'll receive a Canva
                team invite at this email address very shortly.
            </p>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                Check your inbox (and spam folder) for the Canva invite email. Once you join the team,
                you'll have full access to Canva Pro features.
            </p>
            <a href="${SITE_URL}/canva-pro-invites" style="display:inline-block;margin-top:8px;padding:12px 28px;background:linear-gradient(135deg,#059669,#047857);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                View Your Status →
            </a>
        `),
    });
}

/**
 * Sent when admin activates access (added to Canva team)
 */
export async function sendAccessActivatedEmail(email, expiresAt) {
    const expiry = expiresAt ? new Date(expiresAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    }) : null;
    return sendEmail({
        to: email,
        subject: '🎨 You now have Canva Pro access!',
        html: baseTemplate(`
            <h2 style="color:#60a5fa;margin-top:0;">Welcome to Canva Pro! 🎨</h2>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                You've been added to our exclusive <strong style="color:#fff;">Canva Pro team</strong>!
                Check your Canva account — you should now have full Pro access.
            </p>
            ${expiry ? `
            <div style="margin:20px 0;padding:16px;background:rgba(96,165,250,0.1);border-radius:10px;border-left:3px solid #3b82f6;">
                <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;">
                    ⏰ Your access is valid until <strong style="color:#fff;">${expiry}</strong>
                </p>
            </div>` : ''}
            <a href="https://www.canva.com" style="display:inline-block;margin-top:8px;padding:12px 28px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                Open Canva →
            </a>
        `),
    });
}

/**
 * Sent when admin rejects a request
 */
export async function sendRequestRejectedEmail(email, reason) {
    return sendEmail({
        to: email,
        subject: 'Update on your Canva Pro request',
        html: baseTemplate(`
            <h2 style="color:#f87171;margin-top:0;">Request Update</h2>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                Unfortunately we were unable to process your Canva Pro request at this time.
                ${reason ? `<br/><br/><em style="color:rgba(255,255,255,0.5);">Reason: ${reason}</em>` : ''}
            </p>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                You're welcome to visit the Canva Pro Hub again and try to request access again in the future.
            </p>
            <a href="${SITE_URL}/canva-pro-invites" style="display:inline-block;margin-top:8px;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                Try Again →
            </a>
        `),
    });
}

/**
 * Sent when admin access expires
 */
export async function sendAccessExpiredEmail(email) {
    return sendEmail({
        to: email,
        subject: '⏰ Your Canva Pro access has expired',
        html: baseTemplate(`
            <h2 style="color:#fbbf24;margin-top:0;">Your access has expired</h2>
            <p style="color:rgba(255,255,255,0.75);line-height:1.6;">
                Your Canva Pro team access has now expired. To renew, simply visit the
                Canva Pro Hub, complete the tasks again, and submit a new request.
            </p>
            <a href="${SITE_URL}/canva-pro-invites" style="display:inline-block;margin-top:8px;padding:12px 28px;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                Renew Access →
            </a>
        `),
    });
}
