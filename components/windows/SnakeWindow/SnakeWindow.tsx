import { useWindowManager } from '../../../hooks/useWindowManager';
import Snake from '../Snake/Snake';

function SnakeWindow() {
	const { closeWindow } = useWindowManager();

	return <Snake onClose={() => closeWindow('snake')} />;
}

export default SnakeWindow;
