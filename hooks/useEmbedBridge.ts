import { useEffect } from 'react';
import { isOpenWindowMessage } from '../lib/embedBridge';
import { isOpenMediaMessage } from '../lib/mediaPlayerMessages';
import { useMediaPlayer } from './useMediaPlayer';
import { useWindowManager } from './useWindowManager';

export function useEmbedBridge() {
	const { openMedia } = useMediaPlayer();
	const { openWindow } = useWindowManager();

	useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			if (isOpenMediaMessage(event.data)) {
				const { media, kind } = event.data.payload;
				void openMedia(media, kind);
				return;
			}

			if (isOpenWindowMessage(event.data)) {
				const { window, explorerPath } = event.data.payload;
				void openWindow(
					window,
					explorerPath ? { explorerPath } : undefined
				);
			}
		};

		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [openMedia, openWindow]);
}
