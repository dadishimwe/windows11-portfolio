import type { NextApiRequest, NextApiResponse } from 'next';
import {
	PISTON_ALLOWED_LANGUAGES,
	PISTON_EXECUTE_URL,
	PISTON_LANGUAGE_VERSIONS,
	PISTON_MAX_SOURCE_BYTES,
	PISTON_RATE_LIMIT_PER_MINUTE,
	PISTON_REQUEST_TIMEOUT_MS,
} from '../../config/codeStudio/piston';

type RunCodeBody = {
	language?: string;
	fileName?: string;
	content?: string;
};

type PistonStage = {
	stdout?: string;
	stderr?: string;
	code?: number;
	signal?: string | null;
};

type PistonResponse = {
	language?: string;
	version?: string;
	compile?: PistonStage;
	run?: PistonStage;
};

const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(req: NextApiRequest): string {
	const forwarded = req.headers['x-forwarded-for'];
	if (typeof forwarded === 'string') {
		return forwarded.split(',')[0]?.trim() || 'unknown';
	}
	return req.socket.remoteAddress ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const windowStart = now - 60_000;
	const timestamps = (rateLimitBuckets.get(ip) ?? []).filter(
		(time) => time > windowStart
	);

	if (timestamps.length >= PISTON_RATE_LIMIT_PER_MINUTE) {
		rateLimitBuckets.set(ip, timestamps);
		return true;
	}

	timestamps.push(now);
	rateLimitBuckets.set(ip, timestamps);
	return false;
}

function sanitizeFileName(fileName: string): string {
	const base = fileName.split(/[/\\]/).pop() ?? 'main.c';
	return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64) || 'main.c';
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const body = req.body as RunCodeBody;
	const language = typeof body.language === 'string' ? body.language : '';
	const content = typeof body.content === 'string' ? body.content : '';
	const fileName = sanitizeFileName(
		typeof body.fileName === 'string' ? body.fileName : 'main.c'
	);

	if (!PISTON_ALLOWED_LANGUAGES.has(language)) {
		return res.status(400).json({ error: 'Unsupported language' });
	}

	if (!content.trim()) {
		return res.status(400).json({ error: 'Empty source code' });
	}

	if (Buffer.byteLength(content, 'utf8') > PISTON_MAX_SOURCE_BYTES) {
		return res.status(413).json({ error: 'Source code too large' });
	}

	const clientIp = getClientIp(req);
	if (isRateLimited(clientIp)) {
		return res.status(429).json({
			error: 'Rate limit exceeded',
			fallback: true,
		});
	}

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), PISTON_REQUEST_TIMEOUT_MS);

	try {
		const upstream = await fetch(PISTON_EXECUTE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				language,
				version: PISTON_LANGUAGE_VERSIONS[language] ?? '*',
				files: [{ name: fileName, content }],
			}),
			signal: controller.signal,
		});

		clearTimeout(timer);

		if (!upstream.ok) {
			const shouldFallback = upstream.status === 429 || upstream.status >= 500;
			return res.status(upstream.status).json({
				error: `Piston upstream error (${upstream.status})`,
				fallback: shouldFallback,
			});
		}

		const data = (await upstream.json()) as PistonResponse;
		const compile = data.compile ?? {};
		const run = data.run ?? {};

		return res.status(200).json({
			language: data.language ?? language,
			version: data.version,
			compile: {
				stdout: compile.stdout ?? '',
				stderr: compile.stderr ?? '',
				code: compile.code ?? 0,
			},
			run: {
				stdout: run.stdout ?? '',
				stderr: run.stderr ?? '',
				code: run.code ?? 0,
				signal: run.signal ?? null,
			},
		});
	} catch (error) {
		clearTimeout(timer);
		const aborted = error instanceof Error && error.name === 'AbortError';
		console.error('[run-code] Piston request failed:', error);
		return res.status(502).json({
			error: aborted ? 'Compiler timed out' : 'Compiler unavailable',
			fallback: true,
		});
	}
}
