import { certifications } from './certifications';
import { site } from './site';

export function getAboutNotepadText(): string {
	const certLines = certifications
		.map((cert) => `• ${cert.name} (${cert.issuer})`)
		.join('\n');

	return `Hello, my name is ${site.name}! 👋

I'm a network engineer and data scientist passionate about infrastructure and machine learning. I love building reliable systems and turning data into something useful.

Certifications:
${certLines}

Open the Links folder on the desktop to find me on LinkedIn, GitHub, Instagram, or shoot me an email.

This site is a Windows 11-style portfolio built with Next.js and React.

Source code: ${site.githubRepo}
	`;
}
