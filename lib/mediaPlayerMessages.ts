import { MediaType } from '../typings';

export const OPEN_MEDIA_MESSAGE = 'portfolio:open-media';

export type MediaKind = 'image' | 'video';

export type OpenMediaPayload = {
	media: MediaType;
	kind: MediaKind;
};

export function postOpenMediaMessage(media: MediaType, kind: MediaKind) {
	if (typeof window === 'undefined') return;

	window.parent.postMessage(
		{
			type: OPEN_MEDIA_MESSAGE,
			payload: { media, kind },
		},
		window.location.origin
	);
}

export function isOpenMediaMessage(
	data: unknown
): data is { type: string; payload: OpenMediaPayload } {
	if (!data || typeof data !== 'object') return false;
	const message = data as { type?: string; payload?: OpenMediaPayload };
	return (
		message.type === OPEN_MEDIA_MESSAGE &&
		!!message.payload?.media &&
		(message.payload.kind === 'image' || message.payload.kind === 'video')
	);
}
