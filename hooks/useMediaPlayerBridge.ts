import { useEffect } from 'react';
import { isOpenMediaMessage } from '../lib/mediaPlayerMessages';
import { useMediaPlayer } from './useMediaPlayer';

export function useMediaPlayerBridge() {
	const { openMedia } = useMediaPlayer();

	useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;
			if (!isOpenMediaMessage(event.data)) return;

			const { media, kind } = event.data.payload;
			void openMedia(media, kind);
		};

		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, [openMedia]);
}
