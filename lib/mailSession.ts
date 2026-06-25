export type SentMessage = {
	id: string;
	to: string;
	subject: string;
	preview: string;
	body: string;
	date: string;
};

const SENT_KEY = 'portfolio:mail:sent';
const STARRED_KEY = 'portfolio:mail:starred';
const READ_KEY = 'portfolio:mail:read';

function readJson<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = sessionStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSentMessages(): SentMessage[] {
	return readJson<SentMessage[]>(SENT_KEY, []);
}

export function addSentMessage(message: Omit<SentMessage, 'id' | 'date'>) {
	const entry: SentMessage = {
		...message,
		id: `sent-${Date.now()}`,
		date: new Date().toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
	};
	const next = [entry, ...getSentMessages()];
	writeJson(SENT_KEY, next);
	return entry;
}

export function getStarredIds(): string[] {
	return readJson<string[]>(STARRED_KEY, []);
}

export function toggleStarred(id: string): string[] {
	const set = new Set(getStarredIds());
	if (set.has(id)) set.delete(id);
	else set.add(id);
	const next = Array.from(set);
	writeJson(STARRED_KEY, next);
	return next;
}

export function getReadIds(): string[] {
	return readJson<string[]>(READ_KEY, []);
}

export function markRead(id: string) {
	const set = new Set(getReadIds());
	if (set.has(id)) return Array.from(set);
	set.add(id);
	const next = Array.from(set);
	writeJson(READ_KEY, next);
	return next;
}
