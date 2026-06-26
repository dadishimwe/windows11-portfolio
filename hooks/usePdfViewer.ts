import { useCallback, useContext } from 'react';
import { handleWindowPriority } from '../components/utils/WindowPriority/WindowPriority';
import {
	initialPdfViewerState,
	PdfViewerState,
} from '../config/pdfViewer';
import { Context } from '../context/ContextProvider';
import { PdfDocument } from '../typings';

export type { PdfViewerState } from '../config/pdfViewer';

export function usePdfViewer() {
	const { pdfViewerState, minimizedState, windowPriorityState } =
		useContext(Context);

	const [pdfViewer, setPdfViewer] = pdfViewerState;
	const [minimized, setMinimized] = minimizedState;
	const [windowPriority, setWindowPriority] = windowPriorityState;

	const openPdf = useCallback(
		async (document: PdfDocument) => {
			setPdfViewer({ isOpen: true, document });
			setMinimized((prev) => ({ ...prev, pdfViewer: false }));

			const newPriority = await handleWindowPriority({
				windowName: 'pdfViewer',
				windowPriority,
			});
			if (newPriority) setWindowPriority(newPriority);
		},
		[setMinimized, setPdfViewer, setWindowPriority, windowPriority]
	);

	const closePdf = useCallback(() => {
		setPdfViewer(initialPdfViewerState);
		setMinimized((prev) => ({ ...prev, pdfViewer: false }));
	}, [setMinimized, setPdfViewer]);

	const restorePdf = useCallback(async () => {
		if (!pdfViewer.isOpen) return;
		setMinimized((prev) => ({ ...prev, pdfViewer: false }));

		const newPriority = await handleWindowPriority({
			windowName: 'pdfViewer',
			windowPriority,
		});
		if (newPriority) setWindowPriority(newPriority);
	}, [
		pdfViewer.isOpen,
		setMinimized,
		setWindowPriority,
		windowPriority,
	]);

	const focusPdf = useCallback(async () => {
		if (!pdfViewer.isOpen || minimized.pdfViewer) return;
		const newPriority = await handleWindowPriority({
			windowName: 'pdfViewer',
			windowPriority,
		});
		if (newPriority) setWindowPriority(newPriority);
	}, [
		minimized.pdfViewer,
		pdfViewer.isOpen,
		setWindowPriority,
		windowPriority,
	]);

	return {
		pdfViewer,
		openPdf,
		closePdf,
		restorePdf,
		focusPdf,
	};
}
