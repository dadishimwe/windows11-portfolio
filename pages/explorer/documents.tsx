import Image from 'next/image';
import ExplorerLink from '../../components/explorer/ExplorerLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import styles from '../../styles/utils/List.module.css';

function Documents() {
	const content = () => (
		<div className={styles.listItemContainer}>
			<ExplorerLink href="/explorer/certifications" passHref>
				<div className={styles.listItem}>
					<div className={styles.listItemName}>
						<Image
							src="/icons/documents/documents_small.png"
							alt="icon"
							width={16}
							height={16}
						/>
						<p>Certifications</p>
					</div>
					<p className={styles.listItemDateModified}>
						{EXPLORER_ITEM_DATE}
					</p>
					<p className={styles.listItemType}>File folder</p>
					<p className={styles.listItemSize}>4 folders</p>
				</div>
			</ExplorerLink>
			<ExplorerLink href="/explorer/resume" passHref>
				<div className={styles.listItem}>
					<div className={styles.listItemName}>
						<Image
							src="/icons/documents/documents_small.png"
							alt="icon"
							width={16}
							height={16}
						/>
						<p>Resume</p>
					</div>
					<p className={styles.listItemDateModified}>
						{EXPLORER_ITEM_DATE}
					</p>
					<p className={styles.listItemType}>File folder</p>
					<p className={styles.listItemSize}>—</p>
				</div>
			</ExplorerLink>
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/documents"
			head={{
				title: 'Documents',
				description:
					'Documents folder — certifications, résumé, and personal files.',
				path: '/explorer/documents',
			}}
			content={content}
		/>
	);
}

export default Documents;
