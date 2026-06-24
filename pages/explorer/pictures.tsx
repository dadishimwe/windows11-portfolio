import Image from 'next/image';
import { useContext, useState } from 'react';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { handleWindowPriority } from '../../components/utils/WindowPriority/WindowPriority';
import MediaPlayer from '../../components/windows/MediaPlayer/MediaPlayer';
import { Context } from '../../context/ContextProvider';
import { getLocalGalleryImages } from '../../lib/localImages';
import { getCloudinaryImages } from '../../lib/cloudinary';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Pictures({ data }: { data: MediaType[] }) {
	const [openImage, setOpenImage] = useState<MediaType | null>(null);

	const DraggableWindowContext = useContext(Context);
	const [windowState, setWindowState] =
		DraggableWindowContext.windowPriorityState;

	const content = () => {
		if (data.length === 0) {
			return <p className={styles.emptyFolder}>This folder is empty.</p>;
		}

		return (
			<>
				{openImage && (
					<MediaPlayer
						media={openImage}
						closeMedia={setOpenImage}
						component={
							<Image
								src={openImage.url}
								alt={openImage.filename}
								layout="fill"
								objectFit="contain"
							/>
						}
					/>
				)}
				<div className={styles.wrapper}>
					{data.map((image) => (
						<div
							className={`${styles.mediaItem} no_click`}
							key={image.filename}
							onClick={async () => {
								setOpenImage(image);

								const newWindowState =
									await handleWindowPriority({
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
			</>
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
