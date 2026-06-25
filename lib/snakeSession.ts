import {
	defaultSnakeSpeedId,
	SnakeSpeedId,
	snakeSpeedPresets,
} from '../config/apps/snake';

const HIGH_SCORE_KEY = 'portfolio-snake-high-score';
const UNLOCKED_CERTS_KEY = 'portfolio-snake-unlocked-certs';
const LAST_GAME_KEY = 'portfolio-snake-last-game';
const SPEED_KEY = 'portfolio-snake-speed';

export type SnakeLastGame = {
	score: number;
	pingMs: number;
	at: string;
};

function readJson<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	try {
		const raw = window.sessionStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown) {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSnakeHighScore(): number {
	if (typeof window === 'undefined') return 0;
	const raw = window.sessionStorage.getItem(HIGH_SCORE_KEY);
	const parsed = raw ? Number.parseInt(raw, 10) : 0;
	return Number.isFinite(parsed) ? parsed : 0;
}

export function getUnlockedCertIds(): string[] {
	return readJson<string[]>(UNLOCKED_CERTS_KEY, []);
}

export function unlockCert(certId: string): string[] {
	const current = getUnlockedCertIds();
	if (current.includes(certId)) return current;
	const next = [...current, certId];
	writeJson(UNLOCKED_CERTS_KEY, next);
	return next;
}

export function getLastGame(): SnakeLastGame | null {
	return readJson<SnakeLastGame | null>(LAST_GAME_KEY, null);
}

export function computePingMs(score: number): number {
	const base = 140 - Math.min(score, 80);
	const jitter = Math.floor(Math.random() * 40) - 20;
	return Math.max(12, Math.min(999, base + jitter));
}

export function recordSnakeGame(score: number): SnakeLastGame {
	const pingMs = computePingMs(score);
	const result: SnakeLastGame = {
		score,
		pingMs,
		at: new Date().toISOString(),
	};

	if (typeof window !== 'undefined') {
		const best = getSnakeHighScore();
		if (score > best) {
			window.sessionStorage.setItem(HIGH_SCORE_KEY, String(score));
		}
		writeJson(LAST_GAME_KEY, result);
	}

	return result;
}

export function getSnakeSpeedId(): SnakeSpeedId {
	if (typeof window === 'undefined') return defaultSnakeSpeedId;
	const raw = window.sessionStorage.getItem(SPEED_KEY);
	if (snakeSpeedPresets.some((preset) => preset.id === raw)) {
		return raw as SnakeSpeedId;
	}
	return defaultSnakeSpeedId;
}

export function setSnakeSpeedId(speedId: SnakeSpeedId): void {
	if (typeof window === 'undefined') return;
	window.sessionStorage.setItem(SPEED_KEY, speedId);
}

export function stepSnakeSpeed(direction: 'slower' | 'faster'): SnakeSpeedId {
	const current = getSnakeSpeedId();
	const index = snakeSpeedPresets.findIndex((preset) => preset.id === current);
	const nextIndex =
		direction === 'faster'
			? Math.min(index + 1, snakeSpeedPresets.length - 1)
			: Math.max(index - 1, 0);
	const nextId = snakeSpeedPresets[nextIndex].id;
	setSnakeSpeedId(nextId);
	return nextId;
}

export function formatSnakeLog(): string {
	const best = getSnakeHighScore();
	const last = getLastGame();
	const unlocked = getUnlockedCertIds();

	const lines = [
		'# /var/games/snake.log — Packet Snake session stats',
		`best_score=${best}`,
	];

	if (last) {
		lines.push(
			`last_score=${last.score}`,
			`last_ping_ms=${last.pingMs}`,
			`last_played=${last.at}`
		);
	} else {
		lines.push('last_score=—', 'last_ping_ms=—', 'last_played=never');
	}

	lines.push(
		`speed=${getSnakeSpeedId()}`,
		`unlocked_certs=${unlocked.length ? unlocked.join(',') : 'none'}`,
		'',
		'# Tip: play snake from Tools or type: play snake'
	);

	return lines.join('\n');
}
