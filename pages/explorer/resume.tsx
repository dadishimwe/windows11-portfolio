import ExplorerPdfFolderPage from '../../components/explorer/ExplorerPdfFolderPage';
import { CLOUDINARY_RESUME_PREFIX } from '../../config/cloudinary';
import { getCloudinaryPdfs } from '../../lib/cloudinary';
import { PdfDocument } from '../../typings';

type Props = {
	documents: PdfDocument[];
};

function ResumeFolder({ documents }: Props) {
	return (
		<ExplorerPdfFolderPage
			path="/explorer/resume"
			head={{
				title: 'Resume',
				description: "Dadi Ishimwe's résumé.",
				path: '/explorer/resume',
			}}
			documents={documents}
			emptyMessage="No résumé in Cloudinary yet. Upload a PDF to portfolio/resume."
		/>
	);
}

export async function getStaticProps() {
	const documents = (await getCloudinaryPdfs(CLOUDINARY_RESUME_PREFIX)) ?? [];

	return {
		props: { documents },
		revalidate: 60,
	};
}

export default ResumeFolder;
