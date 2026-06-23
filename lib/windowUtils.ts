export const windowTitles: Record<string, string> = {
	fileExplorer: 'File Explorer',
	notepad: 'Notepad',
	terminal: 'Terminal',
	mediaPlayer: 'Media Player',
};

export function routeToWindow(path: string): string | null {
	const normalized = path.split('?')[0];

	if (normalized.startsWith('/notepad')) return 'notepad';
	if (normalized === '/terminal') return 'terminal';
	if (normalized.startsWith('/explorer')) return 'fileExplorer';

	return null;
}
