/** Public Piston endpoint — override with PISTON_API_URL for self-hosted. */
export const PISTON_EXECUTE_URL =
	process.env.PISTON_API_URL ?? 'https://emkc.org/api/v2/piston/execute';

export const PISTON_ALLOWED_LANGUAGES = new Set(['c', 'cpp', 'python']);

export const PISTON_MAX_SOURCE_BYTES = 32 * 1024;

export const PISTON_REQUEST_TIMEOUT_MS = 12_000;

/** Per-IP requests allowed per rolling minute (best-effort on serverless). */
export const PISTON_RATE_LIMIT_PER_MINUTE = 12;

export const PISTON_LANGUAGE_VERSIONS: Record<string, string> = {
	c: '*',
	cpp: '*',
	python: '*',
};
