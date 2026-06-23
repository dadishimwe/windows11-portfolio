export type OpenWindows = {
	fileExplorer: boolean;
	notepad: boolean;
	terminal: boolean;
	firefox: boolean;
};

export const initialOpenWindows: OpenWindows = {
	fileExplorer: false,
	notepad: false,
	terminal: false,
	firefox: false,
};

export type ExplorerRouteMeta = {
	folder: string;
	icon: string;
	topNav: boolean;
};

export const explorerRoutes: Record<string, ExplorerRouteMeta> = {
	'/explorer/quick-access': {
		folder: 'Quick access',
		icon: 'quickaccess',
		topNav: false,
	},
	'/explorer/projects': {
		folder: 'Projects',
		icon: 'folder',
		topNav: true,
	},
	'/explorer/pictures': {
		folder: 'Pictures',
		icon: 'pictures',
		topNav: false,
	},
	'/explorer/links': {
		folder: 'Links',
		icon: 'folder',
		topNav: true,
	},
	'/explorer/tools': {
		folder: 'Tools',
		icon: 'folder',
		topNav: true,
	},
	'/explorer/certifications': {
		folder: 'Certifications',
		icon: 'documents',
		topNav: true,
	},
	'/explorer/desktop': {
		folder: 'Desktop',
		icon: 'desktop',
		topNav: true,
	},
	'/explorer/documents': {
		folder: 'Documents',
		icon: 'documents',
		topNav: true,
	},
};

export const DEFAULT_EXPLORER_PATH = '/explorer/quick-access';

const pathMeta: Record<string, ExplorerRouteMeta> = {
	...explorerRoutes,
	'/explorer/downloads': {
		folder: 'Downloads',
		icon: 'downloads',
		topNav: true,
	},
	'/explorer/videos': {
		folder: 'Videos',
		icon: 'videos',
		topNav: false,
	},
	'/explorer/music': {
		folder: 'Music',
		icon: 'music',
		topNav: false,
	},
	'/explorer/podcasts': {
		folder: 'Podcasts I listen to',
		icon: 'folder',
		topNav: true,
	},
	'/explorer/this-pc': {
		folder: 'This PC',
		icon: 'thispc',
		topNav: false,
	},
};

export function getExplorerMeta(path: string): ExplorerRouteMeta {
	const normalized = path.split('?')[0];
	if (pathMeta[normalized]) return pathMeta[normalized];

	const driveMatch = normalized.match(/^\/explorer\/drives\/([CD])$/);
	if (driveMatch) {
		const letter = driveMatch[1];
		return {
			folder: `Local Disk (${letter}:)`,
			icon: 'drive',
			topNav: true,
		};
	}

	return {
		folder: 'File Explorer',
		icon: 'folder',
		topNav: false,
	};
}
