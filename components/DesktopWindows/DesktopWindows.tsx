import { useContext } from 'react';
import { Context } from '../../context/ContextProvider';
import { useMediaPlayerBridge } from '../../hooks/useMediaPlayerBridge';
import ExplorerWindow from '../windows/ExplorerWindow/ExplorerWindow';
import Firefox from '../windows/Firefox/Firefox';
import NotepadWindow from '../windows/NotepadWindow/NotepadWindow';
import TerminalWindow from '../windows/TerminalWindow/TerminalWindow';
import MediaPlayerWindow from './MediaPlayerWindow';

function DesktopWindows() {
	const { openWindowsState } = useContext(Context);
	const [openWindows] = openWindowsState;

	useMediaPlayerBridge();

	return (
		<>
			{openWindows.fileExplorer && <ExplorerWindow />}
			{openWindows.notepad && <NotepadWindow />}
			{openWindows.terminal && <TerminalWindow />}
			{openWindows.firefox && <Firefox />}
			<MediaPlayerWindow />
		</>
	);
}

export default DesktopWindows;
