import Image from 'next/image';
import EmbedAppLink from '../../components/explorer/EmbedAppLink';
import ExplorerLink from '../../components/explorer/ExplorerLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import styles from '../../styles/utils/List.module.css';

function Desktop() {
	const content = () => {
		return (
			<>
				<div className={styles.listItemContainer}>
					<EmbedAppLink windowName="notepad" href="/notepad/about">
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Text Document</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</EmbedAppLink>
					<ExplorerLink href="/explorer/projects" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>
					<ExplorerLink href="/explorer/tools" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>
					<ExplorerLink href="/explorer/podcasts" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>
					<ExplorerLink href="/explorer/links" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>

					<ExplorerLink href="/explorer/pictures" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>

					<ExplorerLink href="/explorer/videos" passHref>
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
								{EXPLORER_ITEM_DATE}
							</p>
							<p className={styles.listItemType}>Folder</p>
							<p className={styles.listItemSize}>2kt</p>
						</div>
					</ExplorerLink>
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
