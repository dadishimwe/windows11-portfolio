import Image from 'next/image';
import Link from 'next/link';
import { BsFillPinAngleFill } from 'react-icons/bs';
import { RiArrowDropDownLine } from 'react-icons/ri';
import ExplorerLink from '../../components/explorer/ExplorerLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import styles from '../../styles/utils/GridList.module.css';
import listItemStyles from '../../styles/utils/List.module.css';

function QuickAccess() {
	const content = () => {
		return (
			<>
				<div className={styles.dropdownNav}>
					<RiArrowDropDownLine />
					<h2>Folders (6)</h2>
					<div />
				</div>
				<div className={styles.wrapper}>
					<ExplorerLink href="/explorer/desktop" passHref>
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
					</ExplorerLink>
					<ExplorerLink href="/explorer/downloads" passHref>
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
					</ExplorerLink>

					<ExplorerLink href="/explorer/documents" passHref>
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
					</ExplorerLink>

					<ExplorerLink href="/explorer/pictures" passHref>
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
					</ExplorerLink>

					<ExplorerLink href="/explorer/videos" passHref>
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
					</ExplorerLink>

					<ExplorerLink href="/explorer/music" passHref>
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
					</ExplorerLink>
				</div>
				<div className={styles.dropdownNav}>
					<RiArrowDropDownLine />
					<h2>Recent files (1)</h2>
					<div />
				</div>

				<div
					className={listItemStyles.listItemContainer}
					style={{ margin: '0 20px 0 20px' }}
				>
					<Link href="/notepad/about" passHref>
						<div className={listItemStyles.listItem}>
							<div className={listItemStyles.listItemName}>
								<Image
									src="/icons/notes/notes.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>About me</p>
							</div>
							<p
								className={listItemStyles.listItemType}
								style={{ width: '100%' }}
							>
								This PC/Desktop/About me.txt
							</p>
						</div>
					</Link>
				</div>
			</>
		);
	};

	return (
		<ExplorerPage
			path="/explorer/quick-access"
			head={{
				title: 'Quick access',
				description:
					'Quick access to files and folders on my Windows portfolio.',
				path: '/explorer/quick-access',
			}}
			content={content}
		/>
	);
}

export default QuickAccess;
