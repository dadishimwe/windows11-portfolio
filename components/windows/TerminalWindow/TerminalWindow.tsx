import { useWindowManager } from '../../../hooks/useWindowManager';
import Terminal from '../Terminal/Terminal';

function TerminalWindow() {
	const { closeWindow } = useWindowManager();

	return <Terminal onClose={() => closeWindow('terminal')} />;
}

export default TerminalWindow;
