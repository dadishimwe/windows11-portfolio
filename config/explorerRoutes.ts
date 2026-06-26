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
	/** Windows-style address bar label (may include parent folders). */
	addressBar?: string;
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
		icon: 'folder',
		topNav: false,
		addressBar: 'Documents \\ Certifications',
	},
	'/explorer/certifications/fortinet': {
		folder: 'Fortinet',
		icon: 'folder',
		topNav: true,
		addressBar: 'Documents \\ Certifications \\ Fortinet',
	},
	'/explorer/certifications/peplink': {
		folder: 'Peplink',
		icon: 'folder',
		topNav: true,
		addressBar: 'Documents \\ Certifications \\ Peplink',
	},
	'/explorer/certifications/mit': {
		folder: 'MIT',
		icon: 'folder',
		topNav: true,
		addressBar: 'Documents \\ Certifications \\ MIT',
	},
	'/explorer/certifications/mit-online': {
		folder: 'MIT Online & edX',
		icon: 'folder',
		topNav: true,
		addressBar: 'Documents \\ Certifications \\ MIT Online & edX',
	},
	'/explorer/resume': {
		folder: 'Resume',
		icon: 'folder',
		topNav: false,
		addressBar: 'Documents \\ Resume',
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
		addressBar: 'Documents',
	},
};

export const DEFAULT_EXPLORER_PATH = '/explorer/quick-access';

const pathMeta: Record<string, ExplorerRouteMeta> = {
	...explorerRoutes,
	'/explorer/downloads': {
		folder: 'Downloads',
		icon: 'downloads',
		topNav: true,
		addressBar: 'Downloads',
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
	'/explorer/recycle-bin': {
		folder: 'Recycle Bin',
		icon: 'trash',
		topNav: false,
	},
	'/explorer/this-pc': {
		folder: 'This PC',
		icon: 'thispc',
		topNav: false,
	},
};

export function getExplorerMeta(path: string): ExplorerRouteMeta {
	const normalized = path.split('?')[0];
	if (pathMeta[normalized]) {
		const meta = pathMeta[normalized];
		return {
			...meta,
			addressBar: meta.addressBar ?? meta.folder,
		};
	}

	const driveMatch = normalized.match(/^\/explorer\/drives\/([CD])$/);
	if (driveMatch) {
		const letter = driveMatch[1];
		return {
			folder: `Local Disk (${letter}:)`,
			icon: 'drive',
			topNav: true,
			addressBar: `This PC \\ Local Disk (${letter}:)`,
		};
	}

	return {
		folder: 'File Explorer',
		icon: 'folder',
		topNav: false,
		addressBar: 'File Explorer',
	};
}

export function getExplorerAddressBar(path: string): string {
	return getExplorerMeta(path).addressBar ?? getExplorerMeta(path).folder;
}
