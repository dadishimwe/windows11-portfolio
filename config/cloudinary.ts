/** Public Cloudinary cloud name (safe to default in code). */
export const CLOUDINARY_CLOUD_NAME =
	process.env.CLOUDINARY_CLOUD_NAME ?? 'drw75019w';

/**
 * Media Library folder for pictures (dynamic folder mode uses asset_folder).
 * Upload to: portfolio/photos
 */
export const CLOUDINARY_IMAGE_PREFIX =
	process.env.CLOUDINARY_IMAGE_PREFIX ?? 'portfolio/photos';

/**
 * Media Library folder for videos (dynamic folder mode uses asset_folder).
 * Upload to: portfolio/videos
 */
export const CLOUDINARY_VIDEO_PREFIX =
	process.env.CLOUDINARY_VIDEO_PREFIX ?? 'portfolio/videos';

/** Résumé PDF(s) — Media Library asset_folder */
export const CLOUDINARY_RESUME_PREFIX =
	process.env.CLOUDINARY_RESUME_PREFIX ?? 'portfolio/resume';

/** Certificate PDF folders (asset_folder) */
export const CLOUDINARY_CERT_PEPLINK_PREFIX =
	process.env.CLOUDINARY_CERT_PEPLINK_PREFIX ??
	'portfolio/certifications/peplink';

export const CLOUDINARY_CERT_MIT_PREFIX =
	process.env.CLOUDINARY_CERT_MIT_PREFIX ??
	'portfolio/certifications/mit';

export const CLOUDINARY_CERT_MIT_ONLINE_PREFIX =
	process.env.CLOUDINARY_CERT_MIT_ONLINE_PREFIX ??
	'portfolio/certifications/mit-online';

export function getCloudinaryCredentials() {
	const cloudinaryUrl = process.env.CLOUDINARY_URL;
	if (cloudinaryUrl) {
		const match = cloudinaryUrl.match(
			/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/
		);
		if (match) {
			return {
				apiKey: match[1],
				apiSecret: match[2],
				cloudName: match[3],
			};
		}
	}

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
