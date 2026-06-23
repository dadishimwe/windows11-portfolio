import { getAboutNotepadText } from '../../../config/notepadContent';
import { useWindowManager } from '../../../hooks/useWindowManager';
import Notepad from '../Notepad/Notepad';

function NotepadWindow() {
	const { closeWindow } = useWindowManager();

	return (
		<Notepad
			initialText={getAboutNotepadText()}
			onClose={() => closeWindow('notepad')}
		/>
	);
}

export default NotepadWindow;
