export type CodeLanguage = 'python' | 'c' | 'markdown' | 'text';

const EXTENSION_MAP: Record<string, CodeLanguage> = {
	py: 'python',
	c: 'c',
	h: 'c',
	md: 'markdown',
	txt: 'text',
};

export function languageFromFileName(fileName: string): CodeLanguage {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
	return EXTENSION_MAP[ext] ?? 'text';
}

export function monacoLanguageId(language: CodeLanguage): string {
	switch (language) {
		case 'python':
			return 'python';
		case 'c':
			return 'c';
		case 'markdown':
			return 'markdown';
		default:
			return 'plaintext';
	}
}

export function isRunnableLanguage(language: CodeLanguage): boolean {
	return language === 'python' || language === 'c';
}
