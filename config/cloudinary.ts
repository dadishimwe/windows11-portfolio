/** Public Cloudinary cloud name (safe to default in code). */
export const CLOUDINARY_CLOUD_NAME =
	process.env.CLOUDINARY_CLOUD_NAME ?? 'drw75019w';

/**
 * Upload images under this folder in Cloudinary Media Library
 * (e.g. portfolio/images/my-photo.jpg).
 */
export const CLOUDINARY_IMAGE_PREFIX =
	process.env.CLOUDINARY_IMAGE_PREFIX ?? 'portfolio/images';

/**
 * Upload videos under this folder
 * (e.g. portfolio/videos/demo.mp4).
 */
export const CLOUDINARY_VIDEO_PREFIX =
	process.env.CLOUDINARY_VIDEO_PREFIX ?? 'portfolio/videos';

export function getCloudinaryCredentials() {
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;

	if (!apiKey || !apiSecret) {
		return null;
	}

	return {
		apiKey,
		apiSecret,
		cloudName: CLOUDINARY_CLOUD_NAME,
	};
}
