import type { NextApiRequest, NextApiResponse } from 'next';
import { site } from '../../config/site';

type Body = {
	name?: string;
	email?: string;
	subject?: string;
	message?: string;
	website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

function trimField(value: unknown, max: number): string {
	if (typeof value !== 'string') return '';
	return value.trim().slice(0, max);
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const body = req.body as Body;

	if (body.website) {
		return res.status(200).json({ ok: true });
	}

	const name = trimField(body.name, MAX_NAME);
	const email = trimField(body.email, 254);
	const subject = trimField(body.subject, MAX_SUBJECT) || 'Portfolio contact';
	const message = trimField(body.message, MAX_MESSAGE);

	if (!name || !email || !message) {
		return res.status(400).json({
			error: 'Name, email, and message are required.',
			code: 'VALIDATION',
		});
	}

	if (!EMAIL_RE.test(email)) {
		return res.status(400).json({
			error: 'Please enter a valid email address.',
			code: 'VALIDATION',
		});
	}

	const apiKey = process.env.RESEND_API_KEY;
	const to = process.env.MAIL_TO || site.email;
	const from =
		process.env.MAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>';

	if (!apiKey) {
		return res.status(503).json({
			error:
				'Email delivery is not configured yet. Use the mailto fallback or try again later.',
			code: 'NOT_CONFIGURED',
		});
	}

	const text = [
		`Name: ${name}`,
		`Email: ${email}`,
		'',
		message,
		'',
		`— Sent from ${site.portfolioUrl}`,
	].join('\n');

	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from,
				to: [to],
				reply_to: email,
				subject: `[Portfolio] ${subject}`,
				text,
			}),
		});

		if (!response.ok) {
			const details = await response.text();
			console.error('[send-email] Resend error:', details);
			return res.status(502).json({
				error: 'Failed to send email. Please try again.',
				code: 'DELIVERY_FAILED',
			});
		}

		return res.status(200).json({ ok: true });
	} catch (error) {
		console.error('[send-email]', error);
		return res.status(500).json({
			error: 'Server error while sending email.',
			code: 'SERVER_ERROR',
		});
	}
}
