import { OpenWindows } from '../config/openWindows';

export const OPEN_WINDOW_MESSAGE = 'portfolio:open-window';

export type OpenWindowPayload = {
	window: keyof OpenWindows;
	explorerPath?: string;
};

export function postOpenWindowMessage(
	windowName: keyof OpenWindows,
	explorerPath?: string
) {
	if (typeof window === 'undefined') return;
	if (!window.parent || window.parent === window) return;

	window.parent.postMessage(
		{
			type: OPEN_WINDOW_MESSAGE,
			payload: { window: windowName, explorerPath },
		},
		window.location.origin
	);
}

export function isOpenWindowMessage(
	data: unknown
): data is { type: string; payload: OpenWindowPayload } {
	if (!data || typeof data !== 'object') return false;
	const message = data as { type?: string; payload?: OpenWindowPayload };
	const win = message.payload?.window;
	return (
		message.type === OPEN_WINDOW_MESSAGE &&
		(win === 'fileExplorer' ||
			win === 'notepad' ||
			win === 'terminal' ||
			win === 'firefox' ||
			win === 'mail')
	);
}
