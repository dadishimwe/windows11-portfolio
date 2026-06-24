import Head from 'next/head';
import { getSiteUrl, site } from '../../../config/site';

type Props = {
	title: string;
	description?: string;
	path?: string;
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function PageHead({ title, description, path, jsonLd }: Props) {
	const pageTitle = `${site.username} - ${title}`;
	const ogTitle = `${site.name} - ${title}`;
	const desc = description || site.description;
	const siteUrl = getSiteUrl().replace(/\/$/, '');
	const url = path ? `${siteUrl}${path}` : siteUrl;
	const ogImage = `${siteUrl}${site.ogImage}`;

	return (
		<Head>
			<title>{pageTitle}</title>
			<link rel="canonical" href={url} />
			<meta name="description" content={desc} />
			<meta property="og:title" content={ogTitle} />
			<meta property="og:description" content={desc} />
			<meta property="og:url" content={url} />
			<meta property="og:image" content={ogImage} />
			<meta property="og:image:alt" content={site.ogImageAlt} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={ogTitle} />
			<meta name="twitter:description" content={desc} />
			<meta name="twitter:image" content={ogImage} />
			{jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd),
					}}
				/>
			)}
		</Head>
	);
}

export default PageHead;
