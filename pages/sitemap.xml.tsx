import { GetServerSideProps } from 'next';
import { getSiteUrl } from '../config/site';
import { sitemapRoutes } from '../config/sitemapRoutes';

function escapeXml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function SiteMap() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = getSiteUrl().replace(/\/$/, '');
	const lastmod = new Date().toISOString().split('T')[0];

	const body = sitemapRoutes
		.map(({ path, changefreq, priority }) => {
			const loc = `${siteUrl}${path === '/' ? '' : path}`;
			return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>${changefreq ? `\n    <changefreq>${changefreq}</changefreq>` : ''}${priority !== undefined ? `\n    <priority>${priority}</priority>` : ''}
  </url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

	res.setHeader('Content-Type', 'application/xml');
	res.write(xml);
	res.end();

	return { props: {} };
};

export default SiteMap;
