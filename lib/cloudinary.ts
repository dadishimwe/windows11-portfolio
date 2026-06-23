import {
	CLOUDINARY_IMAGE_PREFIX,
	CLOUDINARY_VIDEO_PREFIX,
	getCloudinaryCredentials,
} from '../config/cloudinary';
import { MediaType } from '../typings';

type CloudinaryResource = {
	public_id: string;
	secure_url: string;
	format: string;
};

function authHeader(apiKey: string, apiSecret: string) {
	return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

function displayFilename(publicId: string, prefix: string): string {
	const withoutPrefix = publicId.startsWith(`${prefix}/`)
		? publicId.slice(prefix.length + 1)
		: publicId.replace(/^portfolio\/(images|videos)\//, '');

	const base = withoutPrefix.split('/').pop() ?? withoutPrefix;
	return base.length > 25 ? base.slice(0, 25) : base;
}

async function listResources(
	resourceType: 'image' | 'video',
	prefix: string
): Promise<CloudinaryResource[] | null> {
	const credentials = getCloudinaryCredentials();
	if (!credentials) return null;

	const { apiKey, apiSecret, cloudName } = credentials;
	const params = new URLSearchParams({
		type: 'upload',
		max_results: '100',
		prefix,
	});

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}?${params}`,
			{
				headers: {
					Authorization: authHeader(apiKey, apiSecret),
				},
			}
		);

		if (!res.ok) return null;

		const json = await res.json();
		if (!Array.isArray(json.resources)) return null;

		return json.resources as CloudinaryResource[];
	} catch {
		return null;
	}
}

async function listWithFallback(
	resourceType: 'image' | 'video',
	prefix: string
): Promise<CloudinaryResource[] | null> {
	const prefixed = await listResources(resourceType, prefix);
	if (prefixed && prefixed.length > 0) return prefixed;

	// If the folder is empty, list all uploads (handy while setting up)
	return listResources(resourceType, 'portfolio');
}

export async function getCloudinaryImages(): Promise<MediaType[] | null> {
	const resources = await listWithFallback('image', CLOUDINARY_IMAGE_PREFIX);
	if (!resources) return null;

	return resources.map((image) => ({
		url: image.secure_url.replace('/upload/', '/upload/q_auto:low/'),
		secure_url: image.secure_url,
		thumbnail: image.secure_url,
		filename: displayFilename(image.public_id, CLOUDINARY_IMAGE_PREFIX),
		format: image.format,
		public_id: image.public_id,
	}));
}

export async function getCloudinaryVideos(): Promise<MediaType[]> {
	const resources = await listWithFallback('video', CLOUDINARY_VIDEO_PREFIX);
	if (!resources) return [];

	return resources.map((video) => ({
		thumbnail: (
			video.secure_url.split('.').slice(0, -1).join('.') + '.webp'
		).replace('/upload/', '/upload/q_auto:low/'),
		filename: displayFilename(video.public_id, CLOUDINARY_VIDEO_PREFIX),
		secure_url: video.secure_url,
		url: video.secure_url,
		format: video.format,
		public_id: video.public_id,
	}));
}
