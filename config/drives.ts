export type DriveKey = 'C' | 'D';

export type DriveConfig = {
	letter: DriveKey;
	label: string;
	folderTitle: string;
	freeSpace: string;
	description: string;
};

export const drives: Record<DriveKey, DriveConfig> = {
	C: {
		letter: 'C',
		label: '250GB SSD',
		folderTitle: 'Local Disk (C:)',
		freeSpace: '85.8 GB free of 222 GB',
		description: 'System drive — Windows and desktop files.',
	},
	D: {
		letter: 'D',
		label: '1TB SSD',
		folderTitle: 'Local Disk (D:)',
		freeSpace: '393 GB free of 465 GB',
		description:
			'Storage drive — certifications and project files will live here.',
	},
};

export function isDriveKey(value: string): value is DriveKey {
	return value === 'C' || value === 'D';
}
