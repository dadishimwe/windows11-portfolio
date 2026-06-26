import { CODE_STUDIO_STORAGE_KEY } from '../../config/apps/codeStudio';
import {
	CodeWorkspace,
	defaultWorkspaceId,
	getDefaultFileContent,
	getWorkspaceById,
	codeWorkspaces,
} from '../../config/codeStudio/workspaces';

export type OpenFile = {
	path: string;
	content: string;
	isDirty: boolean;
};

export type CodeStudioPersistedState = {
	workspaceId: string;
	openFiles: string[];
	activeFile: string;
	files: Record<string, string>;
};

export function hashContent(content: string): string {
	let hash = 0;
	for (let i = 0; i < content.length; i += 1) {
		hash = (hash << 5) - hash + content.charCodeAt(i);
		hash |= 0;
	}
	return String(hash);
}

export function isDefaultContent(
	workspaceId: string,
	filePath: string,
	content: string
): boolean {
	const original = getDefaultFileContent(workspaceId, filePath);
	if (original === undefined) return false;
	return original === content;
}

export function buildWorkspaceState(workspace: CodeWorkspace): {
	openFiles: OpenFile[];
	activeFile: string;
} {
	const defaultFile =
		workspace.files.find((file) => file.path === workspace.defaultFile) ??
		workspace.files[0];

	const openFiles: OpenFile[] = workspace.files
		.filter((file) => file.language !== 'markdown' || file.path === 'README.md')
		.slice(0, 4)
		.map((file) => ({
			path: file.path,
			content: file.content,
			isDirty: false,
		}));

	const hasDefault = openFiles.some((file) => file.path === defaultFile.path);
	if (!hasDefault) {
		openFiles.unshift({
			path: defaultFile.path,
			content: defaultFile.content,
			isDirty: false,
		});
	}

	return {
		openFiles,
		activeFile: defaultFile.path,
	};
}

export function loadPersistedState(): CodeStudioPersistedState | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = sessionStorage.getItem(CODE_STUDIO_STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CodeStudioPersistedState;
		if (!parsed.workspaceId || !parsed.activeFile || !parsed.files) return null;
		if (!getWorkspaceById(parsed.workspaceId)) return null;
		return parsed;
	} catch {
		return null;
	}
}

export function savePersistedState(state: CodeStudioPersistedState) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(CODE_STUDIO_STORAGE_KEY, JSON.stringify(state));
}

export function restoreWorkspace(
	workspaceId: string,
	persisted: CodeStudioPersistedState | null
): { openFiles: OpenFile[]; activeFile: string } {
	const workspace = getWorkspaceById(workspaceId);
	if (!workspace) {
		const fallback = getWorkspaceById(defaultWorkspaceId)!;
		return buildWorkspaceState(fallback);
	}

	if (!persisted || persisted.workspaceId !== workspaceId) {
		return buildWorkspaceState(workspace);
	}

	const openPaths =
		persisted.openFiles.length > 0
			? persisted.openFiles
			: [workspace.defaultFile];

	const openFiles: OpenFile[] = openPaths.map((path) => {
		const defaultContent = getDefaultFileContent(workspaceId, path) ?? '';
		const content = persisted.files[path] ?? defaultContent;
		return {
			path,
			content,
			isDirty: content !== defaultContent,
		};
	});

	const activeFile = openPaths.includes(persisted.activeFile)
		? persisted.activeFile
		: openFiles[0]?.path ?? workspace.defaultFile;

	return { openFiles, activeFile };
}

export function listWorkspaceFiles(workspace: CodeWorkspace): string[] {
	return workspace.files.map((file) => file.path);
}

export function findFileInWorkspaces(fileName: string): {
	workspaceId: string;
	fileName: string;
} | null {
	for (const workspace of codeWorkspaces) {
		const match = workspace.files.find((file) => file.path === fileName);
		if (match) {
			return { workspaceId: workspace.id, fileName: match.path };
		}
	}
	return null;
}
