import { DEFAULT_EXPLORER_PATH } from '../config/explorerRoutes';
import { initialOpenWindows, OpenWindows } from '../config/openWindows';

export type OpenWindowOptions = {
	explorerPath?: string;
};

export { initialOpenWindows, DEFAULT_EXPLORER_PATH };

export function routeToWindow(path: string): keyof OpenWindows | null {
	const normalized = path.split('?')[0];
	if (normalized.startsWith('/explorer')) return 'fileExplorer';
	if (normalized.startsWith('/notepad')) return 'notepad';
	if (normalized === '/terminal') return 'terminal';
	return null;
}

export function hrefToWindow(href: string): {
	windowName: keyof OpenWindows;
	explorerPath?: string;
} | null {
	const normalized = href.split('?')[0];
	if (normalized.startsWith('/explorer')) {
		return { windowName: 'fileExplorer', explorerPath: normalized };
	}
	if (normalized.startsWith('/notepad')) {
		return { windowName: 'notepad' };
	}
	if (normalized === '/terminal') {
		return { windowName: 'terminal' };
	}
	return null;
}

export function getOpenWindowNames(
	openWindows: OpenWindows,
	minimized: Record<string, boolean>
): string[] {
	return Object.entries(openWindows)
		.filter(([name, isOpen]) => isOpen && !minimized[name])
		.map(([name]) => name);
}

export function getMinimizedWindowNames(
	openWindows: OpenWindows,
	minimized: Record<string, boolean>
): string[] {
	return Object.entries(openWindows)
		.filter(([name, isOpen]) => isOpen && minimized[name])
		.map(([name]) => name);
}
