import Image from 'next/image';
import ExplorerLink from '../../components/explorer/ExplorerLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { certExplorerFolders } from '../../config/documents';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import styles from '../../styles/utils/List.module.css';

function CertificationsHub() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{certExplorerFolders.map((folder) => (
				<ExplorerLink key={folder.id} href={folder.explorerPath} passHref>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src={folder.icon}
								alt=""
								width={16}
								height={16}
							/>
							<p>{folder.name}</p>
						</div>
						<p className={styles.listItemDateModified}>
							{EXPLORER_ITEM_DATE}
						</p>
						<p className={styles.listItemType}>File folder</p>
						<p className={styles.listItemSize}>
							{folder.kind === 'credly' ? 'Credly' : 'PDF'}
						</p>
					</div>
				</ExplorerLink>
			))}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/certifications"
			head={{
				title: 'Certifications',
				description:
					'Fortinet (Credly), Peplink, MIT, and MIT Online / edX certificates.',
				path: '/explorer/certifications',
			}}
			content={content}
		/>
	);
}

export default CertificationsHub;
