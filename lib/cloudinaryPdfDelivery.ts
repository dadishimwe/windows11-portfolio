import { v2 as cloudinary } from 'cloudinary';
import {
	CLOUDINARY_CERT_MIT_ONLINE_PREFIX,
	CLOUDINARY_CERT_MIT_PREFIX,
	CLOUDINARY_CERT_PEPLINK_PREFIX,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_RESUME_PREFIX,
	getCloudinaryCredentials,
} from '../config/cloudinary';

export type CloudinaryResourceType = 'image' | 'raw';

/** Media Library folders allowed for PDF proxy delivery. */
export const ALLOWED_PDF_ASSET_FOLDERS = new Set([
	CLOUDINARY_RESUME_PREFIX,
	CLOUDINARY_CERT_PEPLINK_PREFIX,
	CLOUDINARY_CERT_MIT_PREFIX,
	CLOUDINARY_CERT_MIT_ONLINE_PREFIX,
]);

export function getCloudinaryResourceType(secureUrl: string): CloudinaryResourceType {
	return secureUrl.includes('/raw/upload/') ? 'raw' : 'image';
}

export function configureCloudinarySdk(): boolean {
	const credentials = getCloudinaryCredentials();
	if (!credentials) return false;

	cloudinary.config({
		cloud_name: credentials.cloudName || CLOUDINARY_CLOUD_NAME,
		api_key: credentials.apiKey,
		api_secret: credentials.apiSecret,
		secure: true,
	});

	return true;
}

export function buildSignedPdfUrl(
	publicId: string,
	resourceType: CloudinaryResourceType,
	options?: { attachment?: boolean }
): string | null {
	if (!configureCloudinarySdk()) return null;

	return cloudinary.url(publicId, {
		resource_type: resourceType,
		type: 'upload',
		format: 'pdf',
		sign_url: true,
		secure: true,
		...(options?.attachment ? { flags: 'attachment' } : {}),
	});
}

/**
 * Dynamic folder mode: public_id is often just the filename (no portfolio/ prefix).
 * We validate via asset_folder (Media Library path) instead.
 */
export function isAllowedPdfRequest(
	publicId: string,
	assetFolder: string
): boolean {
	if (!publicId || publicId.includes('..')) return false;
	if (!ALLOWED_PDF_ASSET_FOLDERS.has(assetFolder)) return false;
	return /^[a-zA-Z0-9_\-./]+$/.test(publicId);
}

export function buildPdfProxyPath(
	publicId: string,
	resourceType: CloudinaryResourceType,
	assetFolder: string,
	download = false
): string {
	const params = new URLSearchParams({
		public_id: publicId,
		resource_type: resourceType,
		asset_folder: assetFolder,
	});
	if (download) params.set('download', '1');
	return `/api/pdf-proxy?${params.toString()}`;
}
