import Image from 'next/image';
import { useRouter } from 'next/router';
import ExplorerLink from '../../components/explorer/ExplorerLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import ExplorerPdfRow from '../../components/explorer/ExplorerPdfRow';
import { getCloudinaryResume } from '../../lib/cloudinary';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import { PdfDocument } from '../../typings';
import styles from '../../styles/utils/List.module.css';

type Props = {
	resume: PdfDocument | null;
};

function Downloads({ resume }: Props) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	const content = () => (
		<div className={styles.listItemContainer}>
			<ExplorerLink href="/explorer/resume" passHref>
				<div className={styles.listItem}>
					<div className={styles.listItemName}>
						<Image
							src="/icons/documents/documents_small.png"
							alt=""
							width={16}
							height={16}
						/>
						<p>Resume</p>
					</div>
					<p className={styles.listItemDateModified}>
						{EXPLORER_ITEM_DATE}
					</p>
					<p className={styles.listItemType}>File folder</p>
					<p className={styles.listItemSize}>
						{resume ? '1 item' : 'Empty'}
					</p>
				</div>
			</ExplorerLink>
			<ExplorerLink href="/explorer/certifications" passHref>
				<div className={styles.listItem}>
					<div className={styles.listItemName}>
						<Image
							src="/icons/documents/documents_small.png"
							alt=""
							width={16}
							height={16}
						/>
						<p>Certifications</p>
					</div>
					<p className={styles.listItemDateModified}>
						{EXPLORER_ITEM_DATE}
					</p>
					<p className={styles.listItemType}>File folder</p>
					<p className={styles.listItemSize}>—</p>
				</div>
			</ExplorerLink>
			{resume && (
				<ExplorerPdfRow document={resume} isEmbed={isEmbed} />
			)}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/downloads"
			head={{
				title: 'Downloads',
				description: 'Résumé and downloadable certificates.',
				path: '/explorer/downloads',
			}}
			content={content}
		/>
	);
}

export async function getStaticProps() {
	const resume = await getCloudinaryResume();

	return {
		props: { resume },
		revalidate: 60,
	};
}

export default Downloads;
