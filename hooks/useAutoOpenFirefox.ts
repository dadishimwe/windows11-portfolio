import { useEffect, useRef, useContext } from 'react';
import { buildInitialFirefoxTabs } from '../lib/firefoxTabs';
import { useWindowManager } from './useWindowManager';
import { Context } from '../context/ContextProvider';

/** Opens Firefox on the blog when the desktop loads (not on mobile). */
function useAutoOpenFirefox(skip = false) {
	const { openWindow } = useWindowManager();
	const { firefoxTabsState, activeFirefoxTabIdState } = useContext(Context);
	const [, setFirefoxTabs] = firefoxTabsState;
	const [, setActiveFirefoxTabId] = activeFirefoxTabIdState;
	const openedRef = useRef(false);

	useEffect(() => {
		if (skip) return;
		if (openedRef.current) return;
		openedRef.current = true;

		const tabs = buildInitialFirefoxTabs();
		setFirefoxTabs(tabs);
		setActiveFirefoxTabId(tabs[0].id);
		void openWindow('firefox');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skip]);
}

export default useAutoOpenFirefox;
