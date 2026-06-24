import { GetServerSideProps } from 'next';
import { getSiteUrl } from '../config/site';

function Robots() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const siteUrl = getSiteUrl().replace(/\/$/, '');

	const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

	res.setHeader('Content-Type', 'text/plain');
	res.write(body);
	res.end();

	return { props: {} };
};

export default Robots;
