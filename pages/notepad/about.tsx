import Icons from '../../components/modules/Icons/Icons';
import PageHead from '../../components/utils/PageHead/PageHead';
import { site } from '../../config/site';
import { useOpenFromRoute } from '../../hooks/useOpenFromRoute';

function About() {
	useOpenFromRoute('notepad');

	return (
		<>
			<PageHead
				title="About me"
				description="Network engineer and data scientist. Fortinet & Peplink certified. MIT Emerging Talent alum."
				path="/notepad/about"
			/>
			<Icons />
		</>
	);
}

export default About;
