import ExplorerPdfFolderPage from '../../../components/explorer/ExplorerPdfFolderPage';
import { CLOUDINARY_CERT_MIT_PREFIX } from '../../../config/cloudinary';
import { getCloudinaryPdfs } from '../../../lib/cloudinary';
import { PdfDocument } from '../../../typings';

type Props = {
	documents: PdfDocument[];
};

function MitCertifications({ documents }: Props) {
	return (
		<ExplorerPdfFolderPage
			path="/explorer/certifications/mit"
			head={{
				title: 'MIT Certifications',
				description: 'MIT program certificates.',
				path: '/explorer/certifications/mit',
			}}
			documents={documents}
			emptyMessage="No MIT certificates in Cloudinary yet. Upload PDFs to portfolio/certifications/mit."
		/>
	);
}

export async function getStaticProps() {
	const documents =
		(await getCloudinaryPdfs(CLOUDINARY_CERT_MIT_PREFIX)) ?? [];

	return {
		props: { documents },
		revalidate: 60,
	};
}

export default MitCertifications;
