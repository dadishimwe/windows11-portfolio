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
