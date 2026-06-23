import { useContext, useEffect } from 'react';
import { handleWindowPriority } from '../components/utils/WindowPriority/WindowPriority';
import { Context } from '../context/ContextProvider';
import { FIRST_VISIT_STORAGE_KEY } from '../lib/firstVisit';

function useFirstVisitFirefox() {
	const { firefoxOpenState, minimizedState, windowPriorityState } =
		useContext(Context);
	const [, setFirefoxOpen] = firefoxOpenState;
	const [minimized, setMinimized] = minimizedState;
	const [windowPriority, setWindowPriority] = windowPriorityState;

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (localStorage.getItem(FIRST_VISIT_STORAGE_KEY)) return;

		localStorage.setItem(FIRST_VISIT_STORAGE_KEY, '1');
		setFirefoxOpen(true);
		setMinimized({ ...minimized, firefox: false });

		void handleWindowPriority({
			windowName: 'firefox',
			windowPriority,
		}).then((newPriority) => {
			if (newPriority) setWindowPriority(newPriority);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

export default useFirstVisitFirefox;
