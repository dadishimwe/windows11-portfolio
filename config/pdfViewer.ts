import type { PdfDocument } from '../typings';

export type PdfViewerState = {
	isOpen: boolean;
	document: PdfDocument | null;
};

export const initialPdfViewerState: PdfViewerState = {
	isOpen: false,
	document: null,
};
