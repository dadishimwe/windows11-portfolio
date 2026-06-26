import { useRouter } from 'next/router';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import ExplorerPdfRow from '../../components/explorer/ExplorerPdfRow';
import { PdfDocument } from '../../typings';
import styles from '../../styles/utils/List.module.css';

type Props = {
	path: string;
	head: {
		title: string;
		description: string;
		path: string;
	};
	documents: PdfDocument[];
	emptyMessage?: string;
};

function ExplorerPdfFolderPage({
	path,
	head,
	documents,
	emptyMessage = 'This folder is empty.',
}: Props) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	const content = () => (
		<div className={styles.listItemContainer}>
			{documents.length === 0 && (
				<p className={styles.emptyFolder}>{emptyMessage}</p>
			)}
			{documents.map((document) => (
				<ExplorerPdfRow
					key={document.public_id}
					document={document}
					isEmbed={isEmbed}
				/>
			))}
		</div>
	);

	return <ExplorerPage path={path} head={head} content={content} />;
}

export default ExplorerPdfFolderPage;
