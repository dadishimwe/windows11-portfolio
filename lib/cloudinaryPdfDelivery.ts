import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, getCloudinaryCredentials } from '../config/cloudinary';

export type CloudinaryResourceType = 'image' | 'raw';

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

export function isAllowedPortfolioPublicId(publicId: string): boolean {
	return publicId.startsWith('portfolio/');
}

export function buildPdfProxyPath(
	publicId: string,
	resourceType: CloudinaryResourceType,
	download = false
): string {
	const params = new URLSearchParams({
		public_id: publicId,
		resource_type: resourceType,
	});
	if (download) params.set('download', '1');
	return `/api/pdf-proxy?${params.toString()}`;
}
