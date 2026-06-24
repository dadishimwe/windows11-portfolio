import Image from 'next/image';
import { MediaKind } from '../../../lib/mediaPlayerMessages';
import { MediaType } from '../../../typings';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './MediaPlayer.module.css';

type Props = {
	media: MediaType;
	kind: MediaKind;
	component: JSX.Element;
	closeMedia: () => void;
};

function MediaPlayer({ media, kind, component, closeMedia }: Props) {
	const title = `${media.filename}.${media.format}`;

	return (
		<DraggableWindow
			windowName="mediaPlayer"
			topTitle={title}
			topIcon={
				<Image
					src={
						kind === 'video'
							? '/icons/videos/videos.png'
							: '/icons/pictures/pictures.png'
					}
					alt=""
					width={20}
					height={20}
				/>
			}
			close={() => {
				closeMedia();
			}}
		>
			<section className={styles.mediaArea}>{component}</section>
			<footer className={styles.footer} />
		</DraggableWindow>
	);
}

export default MediaPlayer;
