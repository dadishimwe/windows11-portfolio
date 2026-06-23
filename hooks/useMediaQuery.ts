import { useCallback, useEffect, useState } from 'react';

export function useMediaQuery(maxWidth: number): boolean {
	const query = `(max-width: ${maxWidth}px)`;
	const [matches, setMatches] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia(query).matches;
	});

	const updateTarget = useCallback(
		(e: MediaQueryListEvent | MediaQueryList) => {
			setMatches(e.matches);
		},
		[]
	);

	useEffect(() => {
		const media = window.matchMedia(query);
		updateTarget(media);
		media.addEventListener('change', updateTarget);
		return () => media.removeEventListener('change', updateTarget);
	}, [query, updateTarget]);

	return matches;
}

export const MOBILE_BREAKPOINT = 880;
