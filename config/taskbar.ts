import { site } from './site';

export type WindowTaskbarMeta = {
	title: string;
	icon: string;
	windowName?: string;
	explorerPath?: string;
	/** When set, pin is only active at this explorer path (e.g. Pictures). */
	pathPin?: boolean;
	external?: boolean;
	href?: string;
};

export type StartMenuApp = {
	id: string;
	label: string;
	icon: string;
	href: string;
	external?: boolean;
};

export const FIREFOX_HOME_URL = site.blogUrl;

export const windowTaskbarMeta: Record<string, WindowTaskbarMeta> = {
	fileExplorer: {
		title: 'File Explorer',
		icon: '/icons/explorer/explorer.png',
		windowName: 'fileExplorer',
		explorerPath: '/explorer/quick-access',
	},
	notepad: {
		title: 'Notepad',
		icon: '/icons/notepad/notepad.png',
		windowName: 'notepad',
	},
	terminal: {
		title: 'Terminal',
		icon: '/icons/terminal/terminal.png',
		windowName: 'terminal',
	},
	pictures: {
		title: 'Pictures',
		icon: '/icons/pictures/pictures.png',
		windowName: 'fileExplorer',
		explorerPath: '/explorer/pictures',
		pathPin: true,
	},
	mediaPlayerImage: {
		title: 'Photos',
		icon: '/icons/pictures/pictures.png',
		windowName: 'mediaPlayer',
	},
	mediaPlayerVideo: {
		title: 'Videos',
		icon: '/icons/videos/videos.png',
		windowName: 'mediaPlayer',
	},
	firefox: {
		title: 'Firefox',
		icon: '/icons/firefox/firefox.png',
		windowName: 'firefox',
	},
	mail: {
		title: 'Mail',
		icon: '/svg/email.svg',
		windowName: 'mail',
	},
	snake: {
		title: 'Packet Snake',
		icon: '/svg/snake.svg',
		windowName: 'snake',
	},
};

/** Always-visible taskbar shortcuts for portfolio apps */
export const taskbarPinnedApps: WindowTaskbarMeta[] = [
	windowTaskbarMeta.fileExplorer,
	windowTaskbarMeta.terminal,
	windowTaskbarMeta.mail,
	windowTaskbarMeta.pictures,
	windowTaskbarMeta.firefox,
];

/** Social & external links — Start menu only */
export const startMenuSocialApps: StartMenuApp[] = [
	{
		id: 'linkedin',
		label: 'LinkedIn',
		icon: '/svg/linkedin.svg',
		href: site.linkedin,
		external: true,
	},
	{
		id: 'instagram',
		label: 'Instagram',
		icon: '/svg/instagram.svg',
		href: site.instagram,
		external: true,
	},
	{
		id: 'github',
		label: 'GitHub',
		icon: '/svg/github.svg',
		href: site.github,
		external: true,
	},
	{
		id: 'vscode',
		label: 'Visual Studio Code',
		icon: '/icons/vscode/vscode.png',
		href: site.githubRepo,
		external: true,
	},
];

export function getMediaTaskbarMeta(kind: 'image' | 'video'): WindowTaskbarMeta {
	return kind === 'video'
		? windowTaskbarMeta.mediaPlayerVideo
		: windowTaskbarMeta.mediaPlayerImage;
}

export function openExternalUrl(url: string) {
	const opened = window.open(url, '_blank', 'noopener,noreferrer');
	if (!opened) {
		window.alert('Please allow pop-ups to open this link.');
	}
}

export function normalizeUrl(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) return FIREFOX_HOME_URL;
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
		return trimmed;
	}
	if (
		trimmed.startsWith('localhost') ||
		/^([\w-]+\.)+[\w-]{2,}(:\d+)?(\/.*)?$/i.test(trimmed)
	) {
		return `https://${trimmed}`;
	}
	return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

export function displayUrl(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}
