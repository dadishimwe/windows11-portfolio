import { FIREFOX_HOME_URL } from '../config/taskbar';

const DOMAIN_PATTERN =
	/^([\w-]+\.)+[\w-]{2,}(:\d+)?(\/.*)?$/i;

export function resolveBrowserTarget(input: string): string {
	const trimmed = input.trim();
	if (!trimmed) return FIREFOX_HOME_URL;

	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed;
	}

	if (trimmed.startsWith('localhost') || DOMAIN_PATTERN.test(trimmed)) {
		return `https://${trimmed}`;
	}

	return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

export function displayUrl(url: string): string {
	try {
		const parsed = new URL(url);
		if (parsed.hostname.includes('duckduckgo.com') && parsed.searchParams.has('q')) {
			return parsed.searchParams.get('q') ?? 'Search';
		}
		return parsed.hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}
