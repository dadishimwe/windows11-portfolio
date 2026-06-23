import { useContext } from 'react';
import { Context } from '../../context/ContextProvider';
import ExplorerWindow from '../windows/ExplorerWindow/ExplorerWindow';
import Firefox from '../windows/Firefox/Firefox';
import NotepadWindow from '../windows/NotepadWindow/NotepadWindow';
import TerminalWindow from '../windows/TerminalWindow/TerminalWindow';

function DesktopWindows() {
	const { openWindowsState } = useContext(Context);
	const [openWindows] = openWindowsState;

	return (
		<>
			{openWindows.fileExplorer && <ExplorerWindow />}
			{openWindows.notepad && <NotepadWindow />}
			{openWindows.terminal && <TerminalWindow />}
			{openWindows.firefox && <Firefox />}
		</>
	);
}

export default DesktopWindows;
