import Image from 'next/image';
import { KeyboardEvent } from 'react';
import { postOpenPdfMessage } from '../../lib/pdfViewerMessages';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import { PdfDocument } from '../../typings';
import styles from '../../styles/utils/List.module.css';

type Props = {
	document: PdfDocument;
	isEmbed: boolean;
};

function ExplorerPdfRow({ document, isEmbed }: Props) {
	const open = () => {
		if (isEmbed) {
			postOpenPdfMessage(document);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			open();
		}
	};

	return (
		<div
			className={styles.listItem}
			role="button"
			tabIndex={0}
			onClick={open}
			onKeyDown={handleKeyDown}
		>
			<div className={styles.listItemName}>
				{document.thumbnailUrl ? (
					<Image
						src={document.thumbnailUrl}
						alt=""
						width={16}
						height={16}
						className={styles.pdfThumb}
					/>
				) : (
					<Image
						src="/icons/documents/documents_small.png"
						alt=""
						width={16}
						height={16}
					/>
				)}
				<p>{document.title}</p>
			</div>
			<p className={styles.listItemDateModified}>{EXPLORER_ITEM_DATE}</p>
			<p className={styles.listItemType}>PDF Document</p>
			<p className={styles.listItemSize}>—</p>
		</div>
	);
}

export default ExplorerPdfRow;
