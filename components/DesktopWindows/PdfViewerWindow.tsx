import { usePdfViewer } from '../../hooks/usePdfViewer';
import PdfViewer from '../windows/PdfViewer/PdfViewer';

function PdfViewerWindow() {
	const { pdfViewer, closePdf } = usePdfViewer();

	if (!pdfViewer.isOpen || !pdfViewer.document) {
		return null;
	}

	return (
		<PdfViewer document={pdfViewer.document} onClose={closePdf} />
	);
}

export default PdfViewerWindow;
