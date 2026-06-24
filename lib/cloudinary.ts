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

const IMAGE_PREFIX_FALLBACKS = [
	'portfolio/photos',
	'portfolio/images',
	'portfolio',
] as const;

function authHeader(apiKey: string, apiSecret: string) {
	return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

function displayFilename(publicId: string, prefix: string): string {
	const withoutPrefix = publicId.startsWith(`${prefix}/`)
		? publicId.slice(prefix.length + 1)
		: publicId.replace(/^portfolio\/(photos|images|videos)\//, '');

	const base = withoutPrefix.split('/').pop() ?? withoutPrefix;
	return base.length > 25 ? base.slice(0, 25) : base;
}

async function listResources(
	resourceType: 'image' | 'video',
	prefix: string
): Promise<CloudinaryResource[] | null> {
	const credentials = getCloudinaryCredentials();
	if (!credentials) {
		console.warn(
			'[cloudinary] Missing CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET'
		);
		return null;
	}

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

		if (!res.ok) {
			const body = await res.text();
			console.error(
				`[cloudinary] ${resourceType} list failed (${res.status}) prefix="${prefix}": ${body}`
			);
			return null;
		}

		const json = await res.json();
		if (!Array.isArray(json.resources)) return null;

		return json.resources as CloudinaryResource[];
	} catch (error) {
		console.error('[cloudinary] list request error:', error);
		return null;
	}
}

async function listFirstMatch(
	resourceType: 'image' | 'video',
	prefixes: readonly string[]
): Promise<CloudinaryResource[] | null> {
	let sawAuthError = false;

	for (const prefix of prefixes) {
		const resources = await listResources(resourceType, prefix);
		if (resources === null) {
			sawAuthError = true;
			continue;
		}
		if (resources.length > 0) return resources;
	}

	return sawAuthError ? null : [];
}

function imagePrefixes(): string[] {
	const configured = CLOUDINARY_IMAGE_PREFIX.trim();
	const ordered = [
		configured,
		...IMAGE_PREFIX_FALLBACKS.filter((p) => p !== configured),
	];
	return Array.from(new Set(ordered));
}

export async function getCloudinaryImages(): Promise<MediaType[] | null> {
	const prefixes = imagePrefixes();
	const resources = await listFirstMatch('image', prefixes);
	if (!resources) return null;
	if (resources.length === 0) return [];

	const prefix =
		prefixes.find((p) =>
			resources.some((r) => r.public_id.startsWith(`${p}/`))
		) ?? prefixes[0];

	return resources.map((image) => ({
		url: image.secure_url.replace('/upload/', '/upload/q_auto:low/'),
		secure_url: image.secure_url,
		thumbnail: image.secure_url,
		filename: displayFilename(image.public_id, prefix),
		format: image.format,
		public_id: image.public_id,
	}));
}

export async function getCloudinaryVideos(): Promise<MediaType[]> {
	const prefixes = [CLOUDINARY_VIDEO_PREFIX, 'portfolio/videos', 'portfolio'];
	const uniquePrefixes = Array.from(new Set(prefixes));
	const resources = await listFirstMatch('video', uniquePrefixes);
	if (!resources || resources.length === 0) return [];

	const prefix =
		uniquePrefixes.find((p) =>
			resources.some((r) => r.public_id.startsWith(`${p}/`))
		) ?? CLOUDINARY_VIDEO_PREFIX;

	return resources.map((video) => ({
		thumbnail: (
			video.secure_url.split('.').slice(0, -1).join('.') + '.webp'
		).replace('/upload/', '/upload/q_auto:low/'),
		filename: displayFilename(video.public_id, prefix),
		secure_url: video.secure_url,
		url: video.secure_url,
		format: video.format,
		public_id: video.public_id,
	}));
}
