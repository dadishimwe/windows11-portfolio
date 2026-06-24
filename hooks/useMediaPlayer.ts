import { useCallback, useContext } from 'react';
import { handleWindowPriority } from '../components/utils/WindowPriority/WindowPriority';
import { Context } from '../context/ContextProvider';
import {
	initialMediaPlayerState,
	MediaPlayerState,
} from '../config/mediaPlayer';
import { MediaKind } from '../lib/mediaPlayerMessages';
import { MediaType } from '../typings';

export type { MediaPlayerState } from '../config/mediaPlayer';

export function useMediaPlayer() {
	const {
		mediaPlayerState,
		minimizedState,
		windowPriorityState,
	} = useContext(Context);

	const [mediaPlayer, setMediaPlayer] = mediaPlayerState;
	const [minimized, setMinimized] = minimizedState;
	const [windowPriority, setWindowPriority] = windowPriorityState;

	const openMedia = useCallback(
		async (media: MediaType, kind: MediaKind) => {
			setMediaPlayer({ isOpen: true, media, kind });
			setMinimized((prev) => ({ ...prev, mediaPlayer: false }));

			const newPriority = await handleWindowPriority({
				windowName: 'mediaPlayer',
				windowPriority,
			});
			if (newPriority) setWindowPriority(newPriority);
		},
		[setMediaPlayer, setMinimized, setWindowPriority, windowPriority]
	);

	const closeMedia = useCallback(() => {
		setMediaPlayer(initialMediaPlayerState);
		setMinimized((prev) => ({ ...prev, mediaPlayer: false }));
	}, [setMediaPlayer, setMinimized]);

	const minimizeMedia = useCallback(() => {
		if (!mediaPlayer.isOpen) return;
		setMinimized((prev) => ({ ...prev, mediaPlayer: true }));
	}, [mediaPlayer.isOpen, setMinimized]);

	const restoreMedia = useCallback(async () => {
		if (!mediaPlayer.isOpen) return;
		setMinimized((prev) => ({ ...prev, mediaPlayer: false }));

		const newPriority = await handleWindowPriority({
			windowName: 'mediaPlayer',
			windowPriority,
		});
		if (newPriority) setWindowPriority(newPriority);
	}, [
		mediaPlayer.isOpen,
		setMinimized,
		setWindowPriority,
		windowPriority,
	]);

	const focusMedia = useCallback(async () => {
		if (!mediaPlayer.isOpen || minimized.mediaPlayer) return;
		const newPriority = await handleWindowPriority({
			windowName: 'mediaPlayer',
			windowPriority,
		});
		if (newPriority) setWindowPriority(newPriority);
	}, [
		mediaPlayer.isOpen,
		minimized.mediaPlayer,
		setWindowPriority,
		windowPriority,
	]);

	return {
		mediaPlayer,
		openMedia,
		closeMedia,
		minimizeMedia,
		restoreMedia,
		focusMedia,
	};
}
