import { useEffect } from 'react';
import { isOpenWindowMessage } from '../lib/embedBridge';
import { isOpenMediaMessage } from '../lib/mediaPlayerMessages';
import { isOpenPdfMessage } from '../lib/pdfViewerMessages';
import { useMediaPlayer } from './useMediaPlayer';
import { usePdfViewer } from './usePdfViewer';
import { useWindowManager } from './useWindowManager';

export function useEmbedBridge() {
	const { openMedia } = useMediaPlayer();
	const { openPdf } = usePdfViewer();
	const { openWindow } = useWindowManager();

	useEffect(() => {
		const onMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			if (isOpenMediaMessage(event.data)) {
				const { media, kind } = event.data.payload;
				void openMedia(media, kind);
				return;
			}

			if (isOpenPdfMessage(event.data)) {
				const { document } = event.data.payload;
				void openPdf(document);
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
	}, [openMedia, openPdf, openWindow]);
}
