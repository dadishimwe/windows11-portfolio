import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { site } from '../config/site';
import { buildPersonJsonLd, buildWebSiteJsonLd } from '../lib/seo';

export default function Home() {
	return (
		<>
			<PageHead
				title="Desktop"
				description={site.description}
				path="/"
				jsonLd={[buildPersonJsonLd(), buildWebSiteJsonLd()]}
			/>
			<div style={{ height: '100%' }}>
				<Icons />
			</div>
		</>
	);
}
