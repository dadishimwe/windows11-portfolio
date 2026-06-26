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
	if (normalized === '/mail') return 'mail';
	if (normalized === '/snake') return 'snake';
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
	if (normalized === '/mail') {
		return { windowName: 'mail' };
	}
	if (normalized === '/snake') {
		return { windowName: 'snake' };
	}
	return null;
}

export function getOpenWindowNames(
	openWindows: OpenWindows,
	minimized: Record<string, boolean>,
	mediaPlayerOpen = false,
	pdfViewerOpen = false
): string[] {
	const names = Object.entries(openWindows)
		.filter(([name, isOpen]) => isOpen && !minimized[name])
		.map(([name]) => name);

	if (mediaPlayerOpen && !minimized.mediaPlayer) {
		names.push('mediaPlayer');
	}

	if (pdfViewerOpen && !minimized.pdfViewer) {
		names.push('pdfViewer');
	}

	return names;
}

export function getMinimizedWindowNames(
	openWindows: OpenWindows,
	minimized: Record<string, boolean>,
	mediaPlayerOpen = false,
	pdfViewerOpen = false
): string[] {
	const names = Object.entries(openWindows)
		.filter(([name, isOpen]) => isOpen && minimized[name])
		.map(([name]) => name);

	if (mediaPlayerOpen && minimized.mediaPlayer) {
		names.push('mediaPlayer');
	}

	if (pdfViewerOpen && minimized.pdfViewer) {
		names.push('pdfViewer');
	}

	return names;
}
