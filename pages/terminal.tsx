import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { useOpenFromRoute } from '../hooks/useOpenFromRoute';

function Terminal() {
	useOpenFromRoute('terminal');

	return (
		<>
			<PageHead
				title="Terminal"
				description="A place to execute commands and feel like being a hacker."
				path="/terminal"
			/>
			<Icons />
		</>
	);
}

export default Terminal;
