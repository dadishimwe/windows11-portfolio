import Image from 'next/image';
import { PdfDocument } from '../../../typings';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './PdfViewer.module.css';

type Props = {
	document: PdfDocument;
	onClose: () => void;
};

function PdfViewer({ document, onClose }: Props) {
	return (
		<DraggableWindow
			windowName="pdfViewer"
			topTitle={document.title}
			topIcon={
				<Image
					src="/svg/pdf.svg"
					alt=""
					width={20}
					height={20}
				/>
			}
			onClose={onClose}
		>
			<div className={styles.shell}>
				<div className={styles.toolbar}>
					<p className={styles.toolbarTitle}>{document.fileName}</p>
					<div className={styles.toolbarActions}>
						<a
							className={styles.toolbarButton}
							href={document.downloadUrl}
							download={document.fileName}
							target="_blank"
							rel="noopener noreferrer"
						>
							Download
						</a>
						<a
							className={styles.toolbarButton}
							href={document.pdfUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open in new tab
						</a>
					</div>
				</div>
				<div className={styles.viewer}>
					<object
						className={styles.frame}
						data={document.pdfUrl}
						type="application/pdf"
						aria-label={document.title}
					>
						<div className={styles.fallback}>
							<p>
								Inline preview is not available for this PDF in
								your browser.
							</p>
							<a
								className={styles.toolbarButton}
								href={document.pdfUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Open PDF in new tab
							</a>
						</div>
					</object>
				</div>
			</div>
		</DraggableWindow>
	);
}

export default PdfViewer;
