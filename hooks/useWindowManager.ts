import { useCallback, useContext } from 'react';
import { DEFAULT_EXPLORER_PATH } from '../config/explorerRoutes';
import { OpenWindows } from '../config/openWindows';
import { handleWindowPriority } from '../components/utils/WindowPriority/WindowPriority';
import { Context } from '../context/ContextProvider';
import { OpenWindowOptions } from '../lib/windowUtils';

export function useWindowManager() {
	const {
		openWindowsState,
		minimizedState,
		explorerPathState,
		explorerHistoryState,
		windowPriorityState,
	} = useContext(Context);

	const [openWindows, setOpenWindows] = openWindowsState;
	const [minimized, setMinimized] = minimizedState;
	const [explorerPath, setExplorerPath] = explorerPathState;
	const [, setExplorerHistory] = explorerHistoryState;
	const [windowPriority, setWindowPriority] = windowPriorityState;

	const focusWindow = useCallback(
		async (windowName: string) => {
			const newPriority = await handleWindowPriority({
				windowName,
				windowPriority,
			});
			if (newPriority) setWindowPriority(newPriority);
		},
		[setWindowPriority, windowPriority]
	);

	const openWindow = useCallback(
		async (name: keyof OpenWindows, options?: OpenWindowOptions) => {
			setOpenWindows((prev) => ({ ...prev, [name]: true }));
			setMinimized((prev) => ({ ...prev, [name]: false }));

			if (name === 'fileExplorer') {
				setExplorerPath(options?.explorerPath ?? DEFAULT_EXPLORER_PATH);
			}

			await focusWindow(name);

			if (name === 'terminal' && typeof window !== 'undefined') {
				window.dispatchEvent(new CustomEvent('terminal:focus'));
			}
		},
		[focusWindow, setExplorerPath, setMinimized, setOpenWindows]
	);

	const closeWindow = useCallback(
		(name: keyof OpenWindows) => {
			setOpenWindows((prev) => ({ ...prev, [name]: false }));
			setMinimized((prev) => ({ ...prev, [name]: false }));
			if (name === 'fileExplorer') setExplorerHistory([]);
		},
		[setExplorerHistory, setMinimized, setOpenWindows]
	);

	const toggleWindow = useCallback(
		async (name: keyof OpenWindows, options?: OpenWindowOptions) => {
			if (openWindows[name] && !minimized[name]) {
				setMinimized((prev) => ({ ...prev, [name]: true }));
				return;
			}

			await openWindow(name, options);
		},
		[minimized, openWindow, openWindows]
	);

	return {
		openWindows,
		minimized,
		explorerPath,
		setExplorerPath,
		openWindow,
		closeWindow,
		toggleWindow,
		focusWindow,
	};
}
