import { getBlogUrl, getSiteUrl, site } from '../config/site';

export function buildPersonJsonLd() {
	const siteUrl = getSiteUrl().replace(/\/$/, '');

	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: site.name,
		url: siteUrl,
		image: `${siteUrl}${site.ogImage}`,
		sameAs: [
			site.github,
			site.linkedin,
			site.instagram,
			getBlogUrl(),
		],
		jobTitle: 'Network Engineer',
		description: site.description,
	};
}

export function buildWebSiteJsonLd() {
	const siteUrl = getSiteUrl().replace(/\/$/, '');

	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: site.ogSiteName,
		url: siteUrl,
		description: site.description,
		author: {
			'@type': 'Person',
			name: site.name,
		},
	};
}
