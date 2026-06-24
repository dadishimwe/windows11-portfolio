import Image from 'next/image';
import { useRouter } from 'next/router';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { postOpenMediaMessage } from '../../lib/mediaPlayerMessages';
import { getLocalGalleryImages } from '../../lib/localImages';
import { getCloudinaryImages } from '../../lib/cloudinary';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Pictures({ data }: { data: MediaType[] }) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	const content = () => {
		if (data.length === 0) {
			return <p className={styles.emptyFolder}>This folder is empty.</p>;
		}

		return (
			<div className={styles.wrapper}>
				{data.map((image) => (
					<div
						className={`${styles.mediaItem} no_click`}
						key={image.public_id ?? image.filename}
						onClick={() => {
							if (isEmbed) {
								postOpenMediaMessage(image, 'image');
							}
						}}
						role="button"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								if (isEmbed) {
									postOpenMediaMessage(image, 'image');
								}
							}
						}}
					>
						<div className={styles.imageWrapper}>
							<Image
								className="no_click"
								src={image.url}
								alt={image.filename}
								width="100%"
								height="100%"
								layout="responsive"
								objectFit="contain"
							/>
						</div>
						<p className="no_click">
							{image.filename}.{image.format}
						</p>
					</div>
				))}
			</div>
		);
	};

	return (
		<ExplorerPage
			path="/explorer/pictures"
			head={{
				title: 'Pictures',
				description:
					"Photos and images from Dadi Ishimwe's portfolio.",
				path: '/explorer/pictures',
			}}
			content={content}
		/>
	);
}

async function fetchGalleryImages(): Promise<MediaType[]> {
	const cloudinaryImages = await getCloudinaryImages();
	return cloudinaryImages ?? getLocalGalleryImages();
}

export async function getStaticProps() {
	const data = await fetchGalleryImages();

	return {
		props: { data },
		revalidate: 60,
	};
}

export default Pictures;
