import Image from 'next/image';
import Link from 'next/link';
import { BsFillPinAngleFill } from 'react-icons/bs';
import { RiArrowDropDownLine } from 'react-icons/ri';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import styles from '../../styles/utils/GridList.module.css';

function ThisPC() {
	const content = () => {
		return (
			<>
				<div className={styles.dropdownNav}>
					<RiArrowDropDownLine />
					<h2>Folders (6)</h2>
					<div />
				</div>
				<div className={styles.wrapper}>
					<Link href="/explorer/desktop" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/desktop/desktop.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Desktop</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>
					<Link href="/explorer/downloads" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/downloads/downloads.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Downloads</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>

					<Link href="/explorer/documents" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/documents/documents.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Documents</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>

					<Link href="/explorer/pictures" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/pictures/pictures.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Pictures</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>

					<Link href="/explorer/videos" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/videos/videos.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Videos</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>

					<Link href="/explorer/music" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/music/music.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Music</p>
								<p>This PC</p>
								<BsFillPinAngleFill />
							</div>
						</div>
					</Link>
				</div>
				<div className={styles.dropdownNav}>
					<RiArrowDropDownLine />
					<h2>Devices and drives (2)</h2>
					<div />
				</div>

				<div className={styles.wrapper}>
					<Link href="/explorer/drives/C" passHref>
						<div className={`${styles.item} ${styles.disk}`}>
							<div>
								<Image
									src="/icons/drives/c.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>250GB SSD (C:)</p>
								<span className={styles.progressBar} />
								<p>85.8 GB free of 222 GB</p>
							</div>
						</div>
					</Link>
					<Link href="/explorer/drives/D" passHref>
						<div className={`${styles.item} ${styles.disk}`}>
							<div>
								<Image
									src="/icons/drives/d.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>1TB SSD (D:)</p>
								<span className={styles.progressBar} />
								<p>393 GB free of 465 GB</p>
							</div>
						</div>
					</Link>
				</div>
			</>
		);
	};

	return (
		<ExplorerPage
			path="/explorer/this-pc"
			head={{
				title: 'This PC',
				description:
					'File Explorer — This PC view on my Windows portfolio.',
				path: '/explorer/this-pc',
			}}
			content={content}
		/>
	);
}

export default ThisPC;
