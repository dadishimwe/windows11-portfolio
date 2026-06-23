import { windowTaskbarMeta } from '../config/taskbar';

export const windowTitles: Record<string, string> = Object.fromEntries(
	Object.entries(windowTaskbarMeta).map(([key, meta]) => [key, meta.title])
);

export function routeToWindow(path: string): string | null {
	const normalized = path.split('?')[0];

	if (normalized.startsWith('/notepad')) return 'notepad';
	if (normalized === '/terminal') return 'terminal';
	if (normalized.startsWith('/explorer')) return 'fileExplorer';

	return null;
}

export function getOpenWindows(
	currentPath: string,
	minimized: Record<string, boolean>,
	overlayOpen: string[] = []
): string[] {
	const windows: string[] = [];
	const currentWindow = routeToWindow(currentPath);

	if (currentWindow && !minimized[currentWindow]) {
		windows.push(currentWindow);
	}

	overlayOpen.forEach((windowName) => {
		if (!minimized[windowName] && !windows.includes(windowName)) {
			windows.push(windowName);
		}
	});

	return windows;
}

export function getMinimizedWindows(
	minimized: Record<string, boolean>
): string[] {
	return Object.entries(minimized)
		.filter(([, isMinimized]) => isMinimized)
		.map(([windowName]) => windowName);
}
