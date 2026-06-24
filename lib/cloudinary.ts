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
	display_name?: string;
};

const IMAGE_PREFIX_FALLBACKS = [
	'portfolio/photos',
	'portfolio/images',
] as const;

function authHeader(apiKey: string, apiSecret: string) {
	return `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;
}

function displayFilename(resource: CloudinaryResource): string {
	const raw =
		resource.display_name?.trim() ||
		resource.public_id.split('/').pop() ||
		resource.public_id;
	return raw.length > 25 ? raw.slice(0, 25) : raw;
}

function getCredentialsOrWarn() {
	const credentials = getCloudinaryCredentials();
	if (!credentials) {
		console.warn(
			'[cloudinary] Missing CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET'
		);
	}
	return credentials;
}

/** Dynamic folder mode — matches Media Library folders (asset_folder field). */
async function listByAssetFolder(
	assetFolder: string
): Promise<CloudinaryResource[] | null> {
	const credentials = getCredentialsOrWarn();
	if (!credentials) return null;

	const { apiKey, apiSecret, cloudName } = credentials;
	const params = new URLSearchParams({
		asset_folder: assetFolder,
		max_results: '100',
	});

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?${params}`,
			{
				headers: {
					Authorization: authHeader(apiKey, apiSecret),
				},
			}
		);

		if (!res.ok) {
			const body = await res.text();
			console.error(
				`[cloudinary] by_asset_folder failed (${res.status}) folder="${assetFolder}": ${body}`
			);
			return null;
		}

		const json = await res.json();
		if (!Array.isArray(json.resources)) return null;

		return json.resources as CloudinaryResource[];
	} catch (error) {
		console.error('[cloudinary] by_asset_folder error:', error);
		return null;
	}
}

/** Legacy fixed-folder mode — public_id starts with prefix. */
async function listByPublicIdPrefix(
	resourceType: 'image' | 'video',
	prefix: string
): Promise<CloudinaryResource[] | null> {
	const credentials = getCredentialsOrWarn();
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

		if (!res.ok) {
			const body = await res.text();
			console.error(
				`[cloudinary] ${resourceType} prefix list failed (${res.status}) prefix="${prefix}": ${body}`
			);
			return null;
		}

		const json = await res.json();
		if (!Array.isArray(json.resources)) return null;

		return json.resources as CloudinaryResource[];
	} catch (error) {
		console.error('[cloudinary] prefix list error:', error);
		return null;
	}
}

async function listFolderAssets(
	resourceType: 'image' | 'video',
	folders: readonly string[]
): Promise<CloudinaryResource[] | null> {
	let sawAuthError = false;

	for (const folder of folders) {
		const byAssetFolder = await listByAssetFolder(folder);
		if (byAssetFolder === null) {
			sawAuthError = true;
		} else if (byAssetFolder.length > 0) {
			return byAssetFolder;
		}

		const byPrefix = await listByPublicIdPrefix(resourceType, folder);
		if (byPrefix === null) {
			sawAuthError = true;
			continue;
		}
		if (byPrefix.length > 0) return byPrefix;
	}

	return sawAuthError ? null : [];
}

function imageFolders(): string[] {
	const configured = CLOUDINARY_IMAGE_PREFIX.trim();
	const ordered = [
		configured,
		...IMAGE_PREFIX_FALLBACKS.filter((f) => f !== configured),
	];
	return Array.from(new Set(ordered));
}

function videoFolders(): string[] {
	const configured = CLOUDINARY_VIDEO_PREFIX.trim();
	return Array.from(
		new Set([configured, 'portfolio/videos'].filter(Boolean))
	);
}

function toImageMedia(resource: CloudinaryResource): MediaType {
	return {
		url: resource.secure_url.replace('/upload/', '/upload/q_auto:low/'),
		secure_url: resource.secure_url,
		thumbnail: resource.secure_url,
		filename: displayFilename(resource),
		format: resource.format,
		public_id: resource.public_id,
	};
}

function toVideoMedia(resource: CloudinaryResource): MediaType {
	return {
		thumbnail: (
			resource.secure_url.split('.').slice(0, -1).join('.') + '.webp'
		).replace('/upload/', '/upload/q_auto:low/'),
		filename: displayFilename(resource),
		secure_url: resource.secure_url,
		url: resource.secure_url,
		format: resource.format,
		public_id: resource.public_id,
	};
}

export async function getCloudinaryImages(): Promise<MediaType[] | null> {
	const resources = await listFolderAssets('image', imageFolders());
	if (!resources) return null;
	if (resources.length === 0) return [];

	return resources
		.filter((r) => r.secure_url.includes('/image/upload/'))
		.map(toImageMedia);
}

export async function getCloudinaryVideos(): Promise<MediaType[]> {
	const resources = await listFolderAssets('video', videoFolders());
	if (!resources || resources.length === 0) return [];

	return resources
		.filter((r) => r.secure_url.includes('/video/upload/'))
		.map(toVideoMedia);
}
