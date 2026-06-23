import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Icons from '../../components/modules/Icons/Icons';
import { handleWindowPriority } from '../../components/utils/WindowPriority/WindowPriority';
import MediaPlayer from '../../components/windows/MediaPlayer/MediaPlayer';
import PageHead from '../../components/utils/PageHead/PageHead';
import { Context } from '../../context/ContextProvider';
import { useOpenFromRoute } from '../../hooks/useOpenFromRoute';
import { getCloudinaryVideos } from '../../lib/cloudinary';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Videos({ data }: { data: MediaType[] }) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';
	const [openVideo, setOpenVideo] = useState<MediaType | null>(null);

	const DraggableWindowContext = useContext(Context);
	const [windowState, setWindowState] =
		DraggableWindowContext.windowPriorityState;

	useOpenFromRoute('fileExplorer', { explorerPath: '/explorer/videos' });

	const VideoContent = () => {
		if (data.length === 0) {
			return <p className={styles.emptyFolder}>This folder is empty.</p>;
		}

		return (
			<div className={styles.wrapper}>
				{data.map((video) => (
					<div
						className={`${styles.mediaItem} no_click`}
						key={video.filename}
						onClick={async () => {
							setOpenVideo(video);

							const newWindowState = await handleWindowPriority({
								windowName: 'mediaPlayer',
								windowPriority: windowState,
							});
							if (!newWindowState) return;
							setWindowState(newWindowState);
						}}
					>
						<div className={styles.imageWrapper}>
							<Image
								className="no_click"
								src={video.thumbnail}
								alt={video.filename}
								width="100%"
								height="100%"
								layout="responsive"
								objectFit="contain"
							/>
						</div>
						<p className="no_click">
							{video.filename}.{video.format}
						</p>
					</div>
				))}
			</div>
		);
	};

	const embedContent = (
		<>
			{openVideo && (
				<MediaPlayer
					closeMedia={setOpenVideo}
					media={openVideo}
					component={
						<video
							controls
							autoPlay
							src={openVideo.secure_url}
							style={{ width: '100%', height: '100%' }}
						/>
					}
				/>
			)}
			<VideoContent />
		</>
	);

	if (isEmbed) {
		return embedContent;
	}

	return (
		<>
			<PageHead
				title="Videos"
				description="Videos from Dadi Ishimwe's portfolio."
				path="/explorer/videos"
			/>
			<Icons />
		</>
	);
}

export async function getStaticProps() {
	const data = await getCloudinaryVideos();

	return {
		props: { data },
		revalidate: 60,
	};
}

export default Videos;
