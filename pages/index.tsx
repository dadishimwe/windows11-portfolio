import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { site } from '../config/site';
import { getCloudinaryResume } from '../lib/cloudinary';
import { buildPersonJsonLd, buildWebSiteJsonLd } from '../lib/seo';
import { PdfDocument } from '../typings';

type Props = {
	resume: PdfDocument | null;
};

export default function Home({ resume }: Props) {
	return (
		<>
			<PageHead
				title="Desktop"
				description={site.description}
				path="/"
				jsonLd={[buildPersonJsonLd(), buildWebSiteJsonLd()]}
			/>
			<div style={{ height: '100%' }}>
				<Icons resume={resume} />
			</div>
		</>
	);
}

export async function getStaticProps() {
	const resume = await getCloudinaryResume();

	return {
		props: { resume },
		revalidate: 60,
	};
}
