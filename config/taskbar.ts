import { site } from './site';

export type WindowTaskbarMeta = {
	title: string;
	icon: string;
	href?: string;
};

export type PinnedApp = {
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
		href: '/explorer/quick-access',
	},
	notepad: {
		title: 'Notepad',
		icon: '/icons/notepad/notepad.png',
		href: '/notepad/about',
	},
	terminal: {
		title: 'Terminal',
		icon: '/icons/terminal/terminal.png',
		href: '/terminal',
	},
	mediaPlayer: {
		title: 'Media Player',
		icon: '/icons/videos/videos.png',
	},
	firefox: {
		title: 'Firefox',
		icon: '/icons/firefox/firefox.png',
	},
};

export const pinnedApps: PinnedApp[] = [
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
		window.alert('Please allow pop-ups to open this application.');
	}
}
