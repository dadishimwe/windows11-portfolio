import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Icons from '../../components/modules/Icons/Icons';
import { handleWindowPriority } from '../../components/utils/WindowPriority/WindowPriority';
import MediaPlayer from '../../components/windows/MediaPlayer/MediaPlayer';
import PageHead from '../../components/utils/PageHead/PageHead';
import { Context } from '../../context/ContextProvider';
import { useOpenFromRoute } from '../../hooks/useOpenFromRoute';
import { getLocalGalleryImages } from '../../lib/localImages';
import styles from '../../styles/utils/MediaGrid.module.css';
import { MediaType } from '../../typings';

function Pictures({ data }: { data: MediaType[] }) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';
	const [openImage, setOpenImage] = useState<MediaType | null>(null);

	const DraggableWindowContext = useContext(Context);
	const [windowState, setWindowState] =
		DraggableWindowContext.windowPriorityState;

	useOpenFromRoute('fileExplorer', { explorerPath: '/explorer/pictures' });

	const ImageContent = () => {
		if (data.length === 0) {
			return <p className={styles.emptyFolder}>This folder is empty.</p>;
		}

		return (
			<div className={styles.wrapper}>
				{data.map((image) => (
					<div
						className={`${styles.mediaItem} no_click`}
						key={image.filename}
						onClick={async () => {
							setOpenImage(image);

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

	const embedContent = (
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
			<ImageContent />
		</>
	);

	if (isEmbed) {
		return embedContent;
	}

	return (
		<>
			<PageHead
				title="Pictures"
				description="Photos and images from Dadi Ishimwe's portfolio."
				path="/explorer/pictures"
			/>
			<Icons />
		</>
	);
}

async function getCloudinaryImages(): Promise<MediaType[] | null> {
	const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
		process.env;

	if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
		return null;
	}

	try {
		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image?max_results=100`,
			{
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`
					).toString('base64')}`,
				},
			}
		);

		if (!res.ok) {
			return null;
		}

		const json = await res.json();

		if (!Array.isArray(json.resources)) {
			return null;
		}

		return json.resources.map((image: MediaType) => ({
			url: image.secure_url.replace('/upload/', '/upload/q_auto:low/'),
			secure_url: image.secure_url,
			thumbnail: image.secure_url,
			filename:
				image.public_id.replace('images/', '').length > 25
					? image.public_id.replace('images/', '').slice(0, 25)
					: image.public_id.replace('images/', ''),
			format: image.format,
			public_id: image.public_id,
		}));
	} catch {
		return null;
	}
}

export async function getStaticProps() {
	const cloudinaryImages = await getCloudinaryImages();
	const data = cloudinaryImages ?? getLocalGalleryImages();

	return {
		props: { data },
		revalidate: 60,
	};
}

export default Pictures;
