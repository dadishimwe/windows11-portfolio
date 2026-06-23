import { useEffect, useRef, useContext } from 'react';
import { buildInitialFirefoxTabs } from '../lib/firefoxTabs';
import { useWindowManager } from './useWindowManager';
import { Context } from '../context/ContextProvider';

/** Opens Firefox on dadishimwe.com whenever the desktop loads. */
function useAutoOpenFirefox() {
	const { openWindow } = useWindowManager();
	const { firefoxTabsState, activeFirefoxTabIdState } = useContext(Context);
	const [, setFirefoxTabs] = firefoxTabsState;
	const [, setActiveFirefoxTabId] = activeFirefoxTabIdState;
	const openedRef = useRef(false);

	useEffect(() => {
		if (openedRef.current) return;
		openedRef.current = true;

		const tabs = buildInitialFirefoxTabs();
		setFirefoxTabs(tabs);
		setActiveFirefoxTabId(tabs[0].id);
		void openWindow('firefox');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export default useAutoOpenFirefox;
