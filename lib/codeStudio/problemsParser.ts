export type CodeProblem = {
	file: string;
	line: number;
	column: number;
	message: string;
	severity: 'error' | 'warning';
};

export function parsePythonProblems(
	fileName: string,
	traceback: string
): CodeProblem[] {
	const problems: CodeProblem[] = [];
	const lines = traceback.split('\n');

	for (const line of lines) {
		const match = line.match(/File "<stdin>", line (\d+)/);
		if (match) {
			problems.push({
				file: fileName,
				line: Number(match[1]),
				column: 1,
				message: 'See traceback below',
				severity: 'error',
			});
		}
	}

	const lastLine = lines.filter(Boolean).pop();
	if (lastLine && !lastLine.startsWith('File ')) {
		if (problems.length === 0) {
			problems.push({
				file: fileName,
				line: 1,
				column: 1,
				message: lastLine.trim(),
				severity: 'error',
			});
		} else {
			problems[problems.length - 1].message = lastLine.trim();
		}
	}

	return problems;
}

export function parseGccProblems(
	fileName: string,
	diagnostics: string
): CodeProblem[] {
	const problems: CodeProblem[] = [];
	const lines = diagnostics.split('\n');

	for (const line of lines) {
		const detailed = line.match(
			/^(.+?):(\d+):(\d+):\s*(error|warning):\s*(.+)$/
		);
		if (detailed) {
			problems.push({
				file: detailed[1].split(/[/\\]/).pop() ?? fileName,
				line: Number(detailed[2]),
				column: Number(detailed[3]),
				message: detailed[5].trim(),
				severity: detailed[4] as 'error' | 'warning',
			});
			continue;
		}

		const simple = line.match(
			/^(.+?):(\d+):\s*(error|warning):\s*(.+)$/
		);
		if (!simple) continue;

		problems.push({
			file: simple[1].split(/[/\\]/).pop() ?? fileName,
			line: Number(simple[2]),
			column: 1,
			message: simple[4].trim(),
			severity: simple[3] as 'error' | 'warning',
		});
	}

	if (problems.length === 0 && diagnostics.trim()) {
		return parseRunError(fileName, diagnostics, 'c');
	}

	return problems;
}

export function parseRunError(
	fileName: string,
	error: string,
	language: 'python' | 'c'
): CodeProblem[] {
	if (language === 'python') {
		return parsePythonProblems(fileName, error);
	}

	return [
		{
			file: fileName,
			line: 1,
			column: 1,
			message: error,
			severity: 'error',
		},
	];
}
