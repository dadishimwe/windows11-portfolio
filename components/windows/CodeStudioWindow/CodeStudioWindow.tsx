import { useWindowManager } from '../../../hooks/useWindowManager';
import CodeStudio from '../CodeStudio/CodeStudio';

function CodeStudioWindow() {
	const { closeWindow } = useWindowManager();

	return <CodeStudio onClose={() => closeWindow('codeStudio')} />;
}

export default CodeStudioWindow;
