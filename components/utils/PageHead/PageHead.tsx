import Head from 'next/head';
import { getSiteUrl, site } from '../../../config/site';

type Props = {
	title: string;
	description?: string;
	path?: string;
};

function PageHead({ title, description, path }: Props) {
	const pageTitle = `${site.username} - ${title}`;
	const ogTitle = `${site.name} - ${title}`;
	const desc = description || site.description;
	const url = path ? `${getSiteUrl()}${path}` : getSiteUrl();

	return (
		<Head>
			<title>{pageTitle}</title>
			{path && <link rel="canonical" href={url} />}
			<meta name="description" content={desc} />
			<meta property="og:title" content={ogTitle} />
			<meta property="og:url" content={url} />
			<meta property="og:description" content={desc} />
		</Head>
	);
}

export default PageHead;
