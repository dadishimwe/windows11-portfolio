import { getSiteUrl, site } from './site';

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
};

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
};

export const pinnedApps: PinnedApp[] = [
	{
		id: 'firefox',
		label: 'Firefox',
		icon: '/icons/firefox/firefox.png',
		href: getSiteUrl(),
	},
	{
		id: 'linkedin',
		label: 'LinkedIn',
		icon: '/svg/linkedin.svg',
		href: site.linkedin,
	},
	{
		id: 'instagram',
		label: 'Instagram',
		icon: '/svg/instagram.svg',
		href: site.instagram,
	},
	{
		id: 'vscode',
		label: 'Visual Studio Code',
		icon: '/icons/vscode/vscode.png',
		href: site.githubRepo,
	},
];

export function openExternalUrl(url: string) {
	const opened = window.open(url, '_blank', 'noopener,noreferrer');
	if (!opened) {
		window.alert('Please allow pop-ups to open this application.');
	}
}
