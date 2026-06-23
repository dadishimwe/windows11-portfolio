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
				description="Network engineer and data scientist. Fortinet NSE, FCF, FCA, and FortiGate Operator certified."
				path="/notepad/about"
			/>
			<Icons />
		</>
	);
}

export default About;
