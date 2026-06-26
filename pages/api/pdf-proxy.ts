import type { NextApiRequest, NextApiResponse } from 'next';
import { CLOUDINARY_CLOUD_NAME } from '../../config/cloudinary';

const ALLOWED_HOST = `res.cloudinary.com`;

function isAllowedCloudinaryPdfUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return (
			parsed.hostname === ALLOWED_HOST &&
			parsed.pathname.includes(`/${CLOUDINARY_CLOUD_NAME}/`) &&
			(parsed.pathname.includes('/image/upload/') ||
				parsed.pathname.includes('/raw/upload/'))
		);
	} catch {
		return false;
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).end('Method Not Allowed');
	}

	const rawUrl = req.query.url;
	if (typeof rawUrl !== 'string' || !isAllowedCloudinaryPdfUrl(rawUrl)) {
		return res.status(400).json({ error: 'Invalid PDF URL' });
	}

	try {
		const upstream = await fetch(rawUrl);
		if (!upstream.ok) {
			return res.status(upstream.status).end('Failed to fetch PDF');
		}

		const buffer = Buffer.from(await upstream.arrayBuffer());
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', 'inline');
		res.setHeader('Cache-Control', 'public, max-age=3600');
		return res.status(200).send(buffer);
	} catch {
		return res.status(502).json({ error: 'PDF proxy failed' });
	}
}
