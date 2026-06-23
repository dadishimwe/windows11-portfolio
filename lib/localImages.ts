import fs from 'fs';
import path from 'path';
import { MediaType } from '../typings';

const SYSTEM_IMAGES = new Set([
	'darknoice.png',
	'landscape-wallpaper.webp',
	'programmer.png',
	'wallpaper.webp',
	'windowsUser.webp',
	'windowsErrorQR.svg',
]);

export function getLocalGalleryImages(): MediaType[] {
	const dir = path.join(process.cwd(), 'public/images');

	if (!fs.existsSync(dir)) {
		return [];
	}

	return fs
		.readdirSync(dir)
		.filter((file) => /\.(webp|png|jpe?g)$/i.test(file))
		.filter((file) => !SYSTEM_IMAGES.has(file))
		.map((file) => {
			const format = file.split('.').pop() || '';
			const filename = file.replace(/\.[^.]+$/, '');

			return {
				url: `/images/${file}`,
				secure_url: `/images/${file}`,
				thumbnail: `/images/${file}`,
				filename,
				format,
				public_id: filename,
			};
		});
}
