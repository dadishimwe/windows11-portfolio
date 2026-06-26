export const NAVIGATE_EXPLORER_MESSAGE = 'portfolio:navigate-explorer';

export type NavigateExplorerPayload = {
	path: string;
};

export function postNavigateExplorerMessage(path: string) {
	if (typeof window === 'undefined') return;
	if (!window.parent || window.parent === window) return;

	window.parent.postMessage(
		{
			type: NAVIGATE_EXPLORER_MESSAGE,
			payload: { path: path.split('?')[0] },
		},
		window.location.origin
	);
}

export function isNavigateExplorerMessage(
	data: unknown
): data is { type: string; payload: NavigateExplorerPayload } {
	if (!data || typeof data !== 'object') return false;
	const message = data as { type?: string; payload?: NavigateExplorerPayload };
	return (
		message.type === NAVIGATE_EXPLORER_MESSAGE &&
		typeof message.payload?.path === 'string' &&
		message.payload.path.startsWith('/explorer')
	);
}
