import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { usePdfViewer } from './usePdfViewer';
import { PdfDocument } from '../typings';

export function useOpenResumeOnLoad(resume: PdfDocument | null) {
	const router = useRouter();
	const { openPdf } = usePdfViewer();

	useEffect(() => {
		if (!resume || router.query.embed === 'true') return;
		void openPdf(resume);
	}, [openPdf, resume, router.query.embed]);
}
