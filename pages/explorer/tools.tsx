import Image from 'next/image';
import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import PageHead from '../../components/utils/PageHead/PageHead';
import styles from '../../styles/utils/List.module.css';

function Tools() {
	const content = () => {
		return (
			<>
				<div className={styles.listItemContainer}>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/vscode/vscode.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>Visual Studio Code - Insiders</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 03:32
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/githubdesktop/githubdesktop.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>Github Desktop</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 05:10
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/mongodbcompass/mongodbcompass.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>MongoDBCompass</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 05:01
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/postman/postman.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>Postman</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 01:35
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/photoshop/photoshop.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>Photoshop</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 02:11
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/illustrator/illustrator.png"
								alt="icon"
								width={16}
								height={16}
							></Image>
							<p>Illustrator</p>
						</div>
						<p className={styles.listItemDateModified}>
							30/12/2021 05:59
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>2kt</p>
					</div>
				</div>
			</>
		);
	};
	return (
		<>
			<PageHead
				title="Tools"
				description="The toolbox I use daily — networking, data science, and development tools."
				path="/explorer/tools"
			/>
			<div style={{ height: '100%' }}>
				<FileExplorer
					icon="folder"
					folder="Tools"
					topNav={true}
					component={content()}
				/>
				<Icons />
			</div>
		</>
	);
}

export default Tools;
