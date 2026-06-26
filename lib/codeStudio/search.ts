import { CodeWorkspace } from '../../config/codeStudio/workspaces';

export type SearchMatch = {
	file: string;
	line: number;
	column: number;
	preview: string;
};

export function searchWorkspaceFiles(
	workspace: CodeWorkspace,
	query: string,
	limit = 80
): SearchMatch[] {
	const trimmed = query.trim().toLowerCase();
	if (!trimmed) return [];

	const results: SearchMatch[] = [];

	for (const file of workspace.files) {
		const lines = file.content.split('\n');
		for (let index = 0; index < lines.length; index += 1) {
			const line = lines[index];
			const column = line.toLowerCase().indexOf(trimmed);
			if (column === -1) continue;

			results.push({
				file: file.path,
				line: index + 1,
				column: column + 1,
				preview: line.trim(),
			});

			if (results.length >= limit) return results;
		}
	}

	return results;
}

export function filterWorkspaceFileNames(
	workspace: CodeWorkspace,
	query: string
): string[] {
	const trimmed = query.trim().toLowerCase();
	const names = workspace.files.map((file) => file.path);
	if (!trimmed) return names;
	return names.filter((name) => name.toLowerCase().includes(trimmed));
}
