import type { NextApiRequest, NextApiResponse } from 'next';
import {
	buildSignedPdfUrl,
	configureCloudinarySdk,
	isAllowedPdfRequest,
	type CloudinaryResourceType,
} from '../../lib/cloudinaryPdfDelivery';

function parseResourceType(value: unknown): CloudinaryResourceType {
	return value === 'raw' ? 'raw' : 'image';
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
		res.setHeader('Allow', 'GET');
		return res.status(405).end('Method Not Allowed');
	}

	const publicId = req.query.public_id;
	const assetFolder = req.query.asset_folder;

	if (
		typeof publicId !== 'string' ||
		typeof assetFolder !== 'string' ||
		!isAllowedPdfRequest(publicId, assetFolder)
	) {
		return res.status(400).json({ error: 'Invalid PDF request' });
	}

	if (!configureCloudinarySdk()) {
		return res.status(503).json({ error: 'Cloudinary is not configured' });
	}

	const resourceType = parseResourceType(req.query.resource_type);
	const download = req.query.download === '1';

	const deliveryUrl = buildSignedPdfUrl(publicId, resourceType, {
		attachment: download,
	});

	if (!deliveryUrl) {
		return res.status(500).json({ error: 'Could not build PDF URL' });
	}

	try {
		const upstream = await fetch(deliveryUrl);
		if (!upstream.ok) {
			console.error(
				`[pdf-proxy] upstream ${upstream.status} public_id=${publicId} folder=${assetFolder}`
			);
			return res
				.status(upstream.status)
				.end(`Failed to fetch PDF (${upstream.status})`);
		}

		const buffer = Buffer.from(await upstream.arrayBuffer());
		const contentType =
			upstream.headers.get('content-type') ?? 'application/pdf';

		res.setHeader('Content-Type', contentType);
		res.setHeader(
			'Content-Disposition',
			download ? 'attachment' : 'inline'
		);
		res.setHeader('Cache-Control', 'public, max-age=300');
		return res.status(200).send(buffer);
	} catch (error) {
		console.error('[pdf-proxy] fetch failed:', error);
		return res.status(502).json({ error: 'PDF proxy failed' });
	}
}
