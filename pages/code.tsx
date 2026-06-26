import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { useOpenFromRoute } from '../hooks/useOpenFromRoute';

function CodePage() {
	useOpenFromRoute('codeStudio');

	return (
		<>
			<PageHead
				title="Visual Studio Code"
				description="Portfolio Code Studio — network automation and ML sample workspaces with in-browser Python."
				path="/code"
			/>
			<Icons />
		</>
	);
}

export default CodePage;
