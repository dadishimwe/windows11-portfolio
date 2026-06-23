import Icons from '../../components/modules/Icons/Icons';
import Notepad from '../../components/windows/Notepad/Notepad';
import PageHead from '../../components/utils/PageHead/PageHead';
import { site } from '../../config/site';

function About() {
	const textContent = () => {
		return `Hello, my name is ${site.name}! 👋

I'm a network engineer and data scientist passionate about infrastructure and machine learning. I love building reliable systems and turning data into something useful.

Certifications:
• Fortinet Certified
• Peplink Certified

Education:
• MIT Emerging Talent — Computer and Data Science

Open the Links folder on the desktop to find me on LinkedIn, GitHub, Instagram, or shoot me an email.

This site is a Windows 11-style portfolio built with Next.js and React.

Source code: ${site.githubRepo}
		`;
	};

	return (
		<>
			<PageHead
				title="About me"
				description="Network engineer and data scientist. Fortinet & Peplink certified. MIT Emerging Talent alum."
				path="/notepad/about"
			/>
			<div style={{ height: '100%' }}>
				<Notepad initialText={textContent()} />
				<Icons />
			</div>
		</>
	);
}

export default About;
