import Image from 'next/image';
import { useRouter } from 'next/router';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { postOpenMediaMessage } from '../../lib/mediaPlayerMessages';
import { getCloudinaryVideos } from '../../lib/cloudinary';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Videos({ data }: { data: MediaType[] }) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	const content = () => {
		if (data.length === 0) {
			return <p className={styles.emptyFolder}>This folder is empty.</p>;
		}

		return (
			<div className={styles.wrapper}>
				{data.map((video) => (
					<div
						className={`${styles.mediaItem} no_click`}
						key={video.public_id ?? video.filename}
						onClick={() => {
							if (isEmbed) {
								postOpenMediaMessage(video, 'video');
							}
						}}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								if (isEmbed) {
									postOpenMediaMessage(video, 'video');
								}
							}
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
		<ExplorerPage
			path="/explorer/videos"
			head={{
				title: 'Videos',
				description: "Videos from Dadi Ishimwe's portfolio.",
				path: '/explorer/videos',
			}}
			content={content}
		/>
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
