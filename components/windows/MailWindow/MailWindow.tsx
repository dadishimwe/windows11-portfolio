import { useWindowManager } from '../../../hooks/useWindowManager';
import Mail from '../Mail/Mail';

function MailWindow() {
	const { closeWindow } = useWindowManager();

	return <Mail onClose={() => closeWindow('mail')} />;
}

export default MailWindow;
