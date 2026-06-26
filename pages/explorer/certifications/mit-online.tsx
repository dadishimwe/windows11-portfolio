import ExplorerPdfFolderPage from '../../../components/explorer/ExplorerPdfFolderPage';
import { CLOUDINARY_CERT_MIT_ONLINE_PREFIX } from '../../../config/cloudinary';
import { getCloudinaryPdfs } from '../../../lib/cloudinary';
import { PdfDocument } from '../../../typings';

type Props = {
	documents: PdfDocument[];
};

function MitOnlineCertifications({ documents }: Props) {
	return (
		<ExplorerPdfFolderPage
			path="/explorer/certifications/mit-online"
			head={{
				title: 'MIT Online & edX',
				description:
					'MIT Emerging Talent, Universal AI, and other MIT Online / edX credentials.',
				path: '/explorer/certifications/mit-online',
			}}
			documents={documents}
			emptyMessage="No MIT Online certificates in Cloudinary yet. Upload PDFs to portfolio/certifications/mit-online."
		/>
	);
}

export async function getStaticProps() {
	const documents =
		(await getCloudinaryPdfs(CLOUDINARY_CERT_MIT_ONLINE_PREFIX)) ?? [];

	return {
		props: { documents },
		revalidate: 60,
	};
}

export default MitOnlineCertifications;
