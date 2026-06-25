import { useContext } from 'react';
import { Context } from '../../context/ContextProvider';
import { useEmbedBridge } from '../../hooks/useEmbedBridge';
import ExplorerWindow from '../windows/ExplorerWindow/ExplorerWindow';
import Firefox from '../windows/Firefox/Firefox';
import NotepadWindow from '../windows/NotepadWindow/NotepadWindow';
import TerminalWindow from '../windows/TerminalWindow/TerminalWindow';
import MailWindow from '../windows/MailWindow/MailWindow';
import MediaPlayerWindow from './MediaPlayerWindow';

function DesktopWindows() {
	const { openWindowsState } = useContext(Context);
	const [openWindows] = openWindowsState;

	useEmbedBridge();

	return (
		<>
			{openWindows.fileExplorer && <ExplorerWindow />}
			{openWindows.notepad && <NotepadWindow />}
			{openWindows.terminal && <TerminalWindow />}
			{openWindows.firefox && <Firefox />}
			{openWindows.mail && <MailWindow />}
			<MediaPlayerWindow />
		</>
	);
}

export default DesktopWindows;
