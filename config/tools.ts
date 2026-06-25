export type ToolShortcut = {
	id: string;
	name: string;
	icon: string;
	href: string;
	dateModified: string;
	type: string;
	size: string;
	windowName?: 'snake';
};

/** Explorer → Tools folder — real destinations for Dadi's stack. */
export const toolShortcuts: ToolShortcut[] = [
	{
		id: 'packet-snake',
		name: 'Packet Snake',
		icon: '/svg/snake.svg',
		href: '/snake',
		windowName: 'snake',
		dateModified: '25/06/2026 18:00',
		type: 'Application',
		size: '48 KB',
	},
	{
		id: 'vscode',
		name: 'Visual Studio Code',
		icon: '/icons/vscode/vscode.png',
		href: 'https://code.visualstudio.com/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
	{
		id: 'github-desktop',
		name: 'GitHub Desktop',
		icon: '/icons/githubdesktop/githubdesktop.png',
		href: 'https://desktop.github.com/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
	{
		id: 'postman',
		name: 'Postman',
		icon: '/icons/postman/postman.png',
		href: 'https://www.postman.com/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
	{
		id: 'wireshark',
		name: 'Wireshark',
		icon: '/icons/shortcut/shortcut.png',
		href: 'https://www.wireshark.org/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
	{
		id: 'python',
		name: 'Python',
		icon: '/icons/terminal/terminal.png',
		href: 'https://www.python.org/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
	{
		id: 'fortinet',
		name: 'Fortinet FortiGate',
		icon: '/icons/documents/documents_small.png',
		href: 'https://www.fortinet.com/',
		dateModified: '23/06/2026 10:00',
		type: 'Shortcut',
		size: '2 KB',
	},
];
