import Icons from '../components/modules/Icons/Icons';
import { default as TerminalComponent } from '../components/windows/Terminal/Terminal';
import PageHead from '../components/utils/PageHead/PageHead';

function Terminal() {
	return (
		<>
			<PageHead
				title="Terminal"
				description="A place to execute commands and feel like being a hacker."
				path="/terminal"
			/>
			<div style={{ height: '100%' }}>
				<TerminalComponent />
				<Icons />
			</div>
		</>
	);
}

export default Terminal;
