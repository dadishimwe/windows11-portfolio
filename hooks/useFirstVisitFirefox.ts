import { useContext, useEffect } from 'react';
import { handleWindowPriority } from '../components/utils/WindowPriority/WindowPriority';
import { Context } from '../context/ContextProvider';
import { FIRST_VISIT_STORAGE_KEY } from '../lib/firstVisit';
import { useWindowManager } from './useWindowManager';

function useFirstVisitFirefox() {
	const { minimizedState, windowPriorityState } = useContext(Context);
	const [, setMinimized] = minimizedState;
	const [windowPriority, setWindowPriority] = windowPriorityState;
	const { openWindow } = useWindowManager();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (localStorage.getItem(FIRST_VISIT_STORAGE_KEY)) return;

		localStorage.setItem(FIRST_VISIT_STORAGE_KEY, '1');
		setMinimized((prev) => ({ ...prev, firefox: false }));

		void openWindow('firefox').then(() => {
			void handleWindowPriority({
				windowName: 'firefox',
				windowPriority,
			}).then((newPriority) => {
				if (newPriority) setWindowPriority(newPriority);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export default useFirstVisitFirefox;
