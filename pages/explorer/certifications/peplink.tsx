import ExplorerPdfFolderPage from '../../../components/explorer/ExplorerPdfFolderPage';
import { CLOUDINARY_CERT_PEPLINK_PREFIX } from '../../../config/cloudinary';
import { getCloudinaryPdfs } from '../../../lib/cloudinary';
import { PdfDocument } from '../../../typings';

type Props = {
	documents: PdfDocument[];
};

function PeplinkCertifications({ documents }: Props) {
	return (
		<ExplorerPdfFolderPage
			path="/explorer/certifications/peplink"
			head={{
				title: 'Peplink Certifications',
				description: 'Peplink training and PCE certificates.',
				path: '/explorer/certifications/peplink',
			}}
			documents={documents}
			emptyMessage="No Peplink certificates in Cloudinary yet. Upload PDFs to portfolio/certifications/peplink."
		/>
	);
}

export async function getStaticProps() {
	const documents =
		(await getCloudinaryPdfs(CLOUDINARY_CERT_PEPLINK_PREFIX)) ?? [];

	return {
		props: { documents },
		revalidate: 60,
	};
}

export default PeplinkCertifications;
