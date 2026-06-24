import Image from 'next/image';
import { useMediaPlayer } from '../../hooks/useMediaPlayer';
import MediaPlayer from '../windows/MediaPlayer/MediaPlayer';

function MediaPlayerWindow() {
	const { mediaPlayer, closeMedia } = useMediaPlayer();

	if (!mediaPlayer.isOpen || !mediaPlayer.media) {
		return null;
	}

	const { media, kind } = mediaPlayer;

	return (
		<MediaPlayer
			media={media}
			kind={kind}
			closeMedia={closeMedia}
			component={
				kind === 'video' ? (
					<video
						controls
						autoPlay
						src={media.secure_url}
						style={{ width: '100%', height: '100%' }}
					/>
				) : (
					<Image
						src={media.url}
						alt={media.filename}
						layout="fill"
						objectFit="contain"
					/>
				)
			}
		/>
	);
}

export default MediaPlayerWindow;
