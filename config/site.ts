export const site = {
	name: 'Dadi Ishimwe',
	username: 'dadishimwe',
	hostname: 'Dadi',
	email: 'dadi29skl@gmail.com',
	github: 'https://github.com/dadishimwe',
	githubRepo: 'https://github.com/dadishimwe/windows11-portfolio',
	linkedin: 'https://www.linkedin.com/in/dadi-ishimwe-473a50275',
	credly: 'https://www.credly.com/users/dadishimwe',
	instagram:
		'https://www.instagram.com/dadishimwe?igsh=dWpnMHN1b2VxcW9n',
	/** Windows portfolio (this site). */
	portfolioUrl: 'https://dadishimwe.com',
	/** Personal blog (GitHub Pages / separate host). */
	blogUrl: 'https://blog.dadishimwe.com',
	/** @deprecated Use `blogUrl` — kept for older references. */
	personalWebsite: 'https://blog.dadishimwe.com',
	description:
		'Network engineer and data scientist passionate about infrastructure, cybersecurity, and machine learning.',
	keywords:
		'dadi ishimwe, dadishimwe, network engineering, cybersecurity, fortinet, data science, machine learning, portfolio',
	ogSiteName: 'Dadi Ishimwe — Windows Portfolio',
	ogImage: '/images/programmer.png',
	ogImageAlt: 'Dadi Ishimwe — network engineer and data scientist',
};

export function getSiteUrl() {
	return (
		process.env.NEXT_PUBLIC_SITE_URL ||
		site.portfolioUrl
	);
}

export function getBlogUrl() {
	return process.env.NEXT_PUBLIC_BLOG_URL || site.blogUrl;
}

export function getBlogHostname() {
	try {
		return new URL(getBlogUrl()).hostname.replace(/^www\./, '');
	} catch {
		return 'blog.dadishimwe.com';
	}
}
