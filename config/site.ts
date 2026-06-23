export const site = {
	name: 'Dadi Ishimwe',
	username: 'dadishimwe',
	hostname: 'Dadi',
	email: 'dadi29skl@gmail.com',
	github: 'https://github.com/dadishimwe',
	githubRepo: 'https://github.com/dadishimwe/windows11-portfolio',
	linkedin: 'https://www.linkedin.com/in/dadi-ishimwe-473a50275',
	instagram:
		'https://www.instagram.com/dadishimwe?igsh=dWpnMHN1b2VxcW9n',
	description:
		'Network engineer and data scientist passionate about infrastructure and machine learning.',
	keywords:
		'dadi ishimwe, dadishimwe, network engineering, data science, machine learning, fortinet, peplink, portfolio',
	ogSiteName: 'Dadi Ishimwe — Windows Portfolio',
	ogImage: '/images/programmer.png',
};

export function getSiteUrl() {
	return (
		process.env.NEXT_PUBLIC_SITE_URL ||
		'https://w11dadi.vercel.app'
	);
}
