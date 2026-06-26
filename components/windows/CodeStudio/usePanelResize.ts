import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

const STORAGE_KEY = 'portfolio-code-studio-panel-height';

function loadHeight(fallback: number): number {
	if (typeof window === 'undefined') return fallback;
	const raw = sessionStorage.getItem(STORAGE_KEY);
	const parsed = raw ? Number(raw) : NaN;
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function usePanelResize(options?: {
	initial?: number;
	min?: number;
	max?: number;
}) {
	const initial = options?.initial ?? 200;
	const min = options?.min ?? 96;
	const max = options?.max ?? 520;

	const [panelHeight, setPanelHeight] = useState(() => loadHeight(initial));
	const draggingRef = useRef(false);
	const startYRef = useRef(0);
	const startHeightRef = useRef(initial);

	useEffect(() => {
		sessionStorage.setItem(STORAGE_KEY, String(panelHeight));
	}, [panelHeight]);

	useEffect(() => {
		const onMouseMove = (event: MouseEvent) => {
			if (!draggingRef.current) return;
			const delta = startYRef.current - event.clientY;
			const next = Math.min(
				max,
				Math.max(min, startHeightRef.current + delta)
			);
			setPanelHeight(next);
		};

		const onMouseUp = () => {
			draggingRef.current = false;
			document.body.style.cursor = '';
			document.body.style.userSelect = '';
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, [max, min]);

	const onResizeStart = useCallback(
		(event: ReactMouseEvent) => {
			draggingRef.current = true;
			startYRef.current = event.clientY;
			startHeightRef.current = panelHeight;
			document.body.style.cursor = 'row-resize';
			document.body.style.userSelect = 'none';
			event.preventDefault();
		},
		[panelHeight]
	);

	return { panelHeight, onResizeStart, setPanelHeight };
}
