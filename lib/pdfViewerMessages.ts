import { PdfDocument } from '../typings';

export const OPEN_PDF_MESSAGE = 'portfolio:open-pdf';

export type OpenPdfPayload = {
	document: PdfDocument;
};

export function postOpenPdfMessage(document: PdfDocument) {
	if (typeof window === 'undefined') return;

	window.parent.postMessage(
		{
			type: OPEN_PDF_MESSAGE,
			payload: { document },
		},
		window.location.origin
	);
}

export function isOpenPdfMessage(
	data: unknown
): data is { type: string; payload: OpenPdfPayload } {
	if (!data || typeof data !== 'object') return false;
	const message = data as { type?: string; payload?: OpenPdfPayload };
	return (
		message.type === OPEN_PDF_MESSAGE && !!message.payload?.document?.pdfUrl
	);
}
