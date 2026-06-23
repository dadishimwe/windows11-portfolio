import { getExplorerMeta } from '../../../config/explorerRoutes';
import { useWindowManager } from '../../../hooks/useWindowManager';
import FileExplorer from '../FileExplorer/FileExplorer';
import styles from './ExplorerWindow.module.css';

function ExplorerWindow() {
	const { explorerPath, setExplorerPath, closeWindow } = useWindowManager();
	const meta = getExplorerMeta(explorerPath);

	return (
		<FileExplorer
			folder={meta.folder}
			icon={meta.icon}
			topNav={meta.topNav}
			navigationMode="context"
			currentPath={explorerPath}
			onNavigate={setExplorerPath}
			onClose={() => closeWindow('fileExplorer')}
			component={
				<iframe
					key={explorerPath}
					className={styles.embedFrame}
					src={`${explorerPath}?embed=true`}
					title={meta.folder}
				/>
			}
		/>
	);
}

export default ExplorerWindow;
