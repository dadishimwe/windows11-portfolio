const VOLUME_KEY = 'portfolio:volume';
const MUTED_KEY = 'portfolio:muted';

export const WIFI_SSID = 'Dadi-Portfolio-5G';

export function readVolume(): number {
	if (typeof window === 'undefined') return 70;
	const raw = sessionStorage.getItem(VOLUME_KEY);
	const parsed = raw === null ? 70 : Number(raw);
	if (!Number.isFinite(parsed)) return 70;
	return Math.min(100, Math.max(0, parsed));
}

export function writeVolume(value: number) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(VOLUME_KEY, String(Math.min(100, Math.max(0, value))));
}

export function readMuted(): boolean {
	if (typeof window === 'undefined') return false;
	return sessionStorage.getItem(MUTED_KEY) === 'true';
}

export function writeMuted(muted: boolean) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(MUTED_KEY, muted ? 'true' : 'false');
}
