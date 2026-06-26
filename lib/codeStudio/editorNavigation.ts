import type { editor } from 'monaco-editor';

export type EditorLocation = {
	file: string;
	line: number;
	column: number;
};

export function revealEditorLocation(
	editorInstance: editor.IStandaloneCodeEditor,
	location: EditorLocation
) {
	const line = Math.max(1, location.line);
	const column = Math.max(1, location.column);

	editorInstance.setPosition({ lineNumber: line, column });
	editorInstance.revealLineInCenter(line);
	editorInstance.focus();
}
