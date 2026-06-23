import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { OpenWindows } from '../config/openWindows';
import { OpenWindowOptions } from '../lib/windowUtils';
import { useWindowManager } from './useWindowManager';

export function useOpenFromRoute(
	windowName: keyof OpenWindows,
	options?: OpenWindowOptions & { enabled?: boolean }
) {
	const router = useRouter();
	const { openWindow } = useWindowManager();
	const enabled = options?.enabled !== false;

	useEffect(() => {
		if (!enabled) return;

		const explorerPath =
			options?.explorerPath ?? router.asPath.split('?')[0];
		void openWindow(
			windowName,
			windowName === 'fileExplorer' ? { explorerPath } : undefined
		);
		// Open once when landing on a deep-linked route
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled]);
}
