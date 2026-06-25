import { useCallback, useEffect, useState } from 'react';
import {
	readMuted,
	readVolume,
	writeMuted,
	writeVolume,
} from '../lib/systemTray';

export function useVolume() {
	const [volume, setVolumeState] = useState(70);
	const [muted, setMutedState] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setVolumeState(readVolume());
		setMutedState(readMuted());
		setHydrated(true);
	}, []);

	const setVolume = useCallback((value: number) => {
		const next = Math.min(100, Math.max(0, value));
		setVolumeState(next);
		writeVolume(next);
		if (next > 0) {
			setMutedState(false);
			writeMuted(false);
		}
	}, []);

	const setMuted = useCallback((nextMuted: boolean) => {
		setMutedState(nextMuted);
		writeMuted(nextMuted);
	}, []);

	const toggleMute = useCallback(() => {
		setMutedState((prev) => {
			const next = !prev;
			writeMuted(next);
			return next;
		});
	}, []);

	return {
		volume,
		muted,
		hydrated,
		setVolume,
		setMuted,
		toggleMute,
		effectiveVolume: muted ? 0 : volume,
	};
}
