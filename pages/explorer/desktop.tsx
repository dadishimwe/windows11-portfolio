import Image from 'next/image';
import Link from 'next/link';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import styles from '../../styles/utils/List.module.css';

function Desktop() {
	const content = () => {
		return (
			<>
				<div className={styles.listItemContainer}>
					<Link href="/notepad/about" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/notes/notes.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>About me.txt</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Text Document</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>
					<Link href="/explorer/projects" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/folder/folder.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Projects</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>
					<Link href="/explorer/tools" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/folder/folder.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Tools</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>
					<Link href="/explorer/podcasts" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/folder/folder.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Podcasts I listen to</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.01.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>
					<Link href="/explorer/links" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/folder/folder.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Links</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>

					<Link href="/explorer/pictures" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/pictures/pictures.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Pictures</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>

					<Link href="/explorer/videos" passHref>
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/icons/videos/videos.png"
									alt="icon"
									width={16}
									height={16}
								></Image>
								<p>Videos</p>
							</div>
							<p className={styles.listItemDateModified}>
								30.12.2021 04:02
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</Link>
				</div>
			</>
		);
	};

	return (
		<ExplorerPage
			path="/explorer/desktop"
			head={{
				title: 'Desktop',
				description:
					'Desktop shortcuts and folders on my Windows portfolio.',
				path: '/explorer/desktop',
			}}
			content={content}
		/>
	);
}

export default Desktop;
