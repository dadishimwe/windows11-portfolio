import Head from 'next/head';
import Image from 'next/image';
import { useContext, useState } from 'react';
import Icons from '../../components/modules/Icons/Icons';
import { handleWindowPriority } from '../../components/utils/WindowPriority/WindowPriority';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import MediaPlayer from '../../components/windows/MediaPlayer/MediaPlayer';
import { Context } from '../../context/ContextProvider';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Videos({ data }: { data: MediaType[] }) {
	const [openVideo, setOpenVideo] = useState<MediaType | null>(null);

	const DraggableWindowContext = useContext(Context);
	const [windowState, setWindowState] =
		DraggableWindowContext.windowPriorityState;

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

	return (
		<>
			<Head>
				<title>dadishimwe - Videos</title>
				<meta
					name="description"
					content="Videos from Dadi Ishimwe's portfolio."
				/>
				<meta property="og:title" content="Dadi Ishimwe - Videos" />
			</Head>
			<div style={{ height: '100%' }}>
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
				<FileExplorer
					folder="Videos"
					topNav={false}
					icon="videos"
					component={<VideoContent />}
				/>
				<Icons />
			</div>
		</>
	);
}

async function getCloudinaryVideos(): Promise<MediaType[]> {
	const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
		process.env;

	if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
		return [];
	}

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/video?max_results=100`,
			{
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
					).toString('base64')}`,
				},
			}
		);

		if (!res.ok) {
			return [];
		}

		const json = await res.json();

		if (!Array.isArray(json.resources)) {
			return [];
		}

		return json.resources.map((video: MediaType) => ({
			thumbnail: (
				video.secure_url.split('.').slice(0, -1).join('.') + '.webp'
			).replace('/upload/', '/upload/q_auto:low/'),
			filename:
				video.public_id.replace('videos/', '').length > 25
					? video.public_id.replace('videos/', '').slice(0, 25)
					: video.public_id.replace('videos/', ''),
			secure_url: video.secure_url,
			url: video.secure_url,
			format: video.format,
			public_id: video.public_id,
		}));
	} catch {
		return [];
	}
}

export async function getStaticProps() {
	const data = await getCloudinaryVideos();

	return {
		props: { data },
		revalidate: 60,
	};
}

export default Videos;
