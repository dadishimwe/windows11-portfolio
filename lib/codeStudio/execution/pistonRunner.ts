export type PistonRunResult = {
	ok: boolean;
	stdout: string;
	stderr: string;
	compileStderr: string;
	compileExitCode: number;
	runExitCode: number;
	fallback?: boolean;
	error?: string;
};

type ApiSuccess = {
	compile: { stdout: string; stderr: string; code: number };
	run: { stdout: string; stderr: string; code: number; signal: string | null };
};

type ApiError = {
	error: string;
	fallback?: boolean;
};

export async function runPistonCode(params: {
	language: 'c' | 'cpp' | 'python';
	fileName: string;
	content: string;
}): Promise<PistonRunResult> {
	try {
		const response = await fetch('/api/run-code', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(params),
		});

		const data = (await response.json()) as ApiSuccess & ApiError;

		if (!response.ok) {
			return {
				ok: false,
				stdout: '',
				stderr: '',
				compileStderr: '',
				compileExitCode: 1,
				runExitCode: 1,
				fallback: Boolean(data.fallback),
				error: data.error ?? `Request failed (${response.status})`,
			};
		}

		return {
			ok: true,
			stdout: data.run.stdout ?? '',
			stderr: data.run.stderr ?? '',
			compileStderr: data.compile.stderr ?? '',
			compileExitCode: data.compile.code ?? 0,
			runExitCode: data.run.code ?? 0,
		};
	} catch (error) {
		return {
			ok: false,
			stdout: '',
			stderr: '',
			compileStderr: '',
			compileExitCode: 1,
			runExitCode: 1,
			fallback: true,
			error:
				error instanceof Error ? error.message : 'Network error',
		};
	}
}

export function formatPistonOutput(
	fileName: string,
	language: string,
	result: PistonRunResult
): string {
	const lines = [`$ ${language} ${fileName}`];

	if (result.compileStderr.trim()) {
		lines.push(result.compileStderr.trimEnd());
	}
	if (result.compileExitCode !== 0 && !result.compileStderr.trim()) {
		lines.push(`compile: exit ${result.compileExitCode}`);
	}

	if (result.compileExitCode === 0) {
		if (language === 'c' || language === 'cpp') {
			lines.push(`$ ./${fileName.replace(/\.[^.]+$/, '')}`);
		}
		if (result.stdout.trim()) lines.push(result.stdout.trimEnd());
		if (result.stderr.trim()) lines.push(result.stderr.trimEnd());
		if (result.runExitCode !== 0 && !result.stderr.trim()) {
			lines.push(`exit code: ${result.runExitCode}`);
		}
	}

	if (result.error) {
		lines.push(`Error: ${result.error}`);
	}

	return lines.filter(Boolean).join('\n');
}
