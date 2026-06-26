import { useCallback, useState } from 'react';
import { getExplorerAddressBar, getExplorerMeta } from '../../../config/explorerRoutes';
import { useWindowManager } from '../../../hooks/useWindowManager';
import FileExplorer from '../FileExplorer/FileExplorer';
import styles from './ExplorerWindow.module.css';

function ExplorerWindow() {
	const { explorerPath, setExplorerPath, closeWindow } = useWindowManager();
	const [iframeKey, setIframeKey] = useState(0);
	const meta = getExplorerMeta(explorerPath);

	const handleNavigate = useCallback(
		(path: string) => {
			const normalized = path.split('?')[0];
			if (normalized === explorerPath) {
				setIframeKey((key) => key + 1);
				return;
			}
			setExplorerPath(normalized);
		},
		[explorerPath, setExplorerPath]
	);

	return (
		<FileExplorer
			folder={meta.folder}
			addressBar={getExplorerAddressBar(explorerPath)}
			icon={meta.icon}
			topNav={meta.topNav}
			navigationMode="context"
			currentPath={explorerPath}
			onNavigate={handleNavigate}
			onClose={() => closeWindow('fileExplorer')}
			component={
				<iframe
					key={`${explorerPath}-${iframeKey}`}
					className={styles.embedFrame}
					src={`${explorerPath}?embed=true`}
					title={meta.folder}
				/>
			}
		/>
	);
}

export default ExplorerWindow;
