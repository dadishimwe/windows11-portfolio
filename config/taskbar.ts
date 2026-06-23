import { site } from './site';

export type WindowTaskbarMeta = {
	title: string;
	icon: string;
	windowName?: string;
	explorerPath?: string;
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

export const FIREFOX_HOME_URL = site.personalWebsite;

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
	},
	mediaPlayer: {
		title: 'Media Player',
		icon: '/icons/videos/videos.png',
	},
	firefox: {
		title: 'Firefox',
		icon: '/icons/firefox/firefox.png',
		windowName: 'firefox',
	},
};

/** Always-visible taskbar shortcuts for portfolio apps */
export const taskbarPinnedApps: WindowTaskbarMeta[] = [
	windowTaskbarMeta.fileExplorer,
	windowTaskbarMeta.terminal,
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
