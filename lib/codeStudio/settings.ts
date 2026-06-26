export const CODE_STUDIO_SETTINGS_KEY = 'portfolio-code-studio-settings';

export type CodeStudioTheme = 'vs-dark' | 'hc-black';
export type CodeStudioFontFamily = 'cascadia' | 'fira' | 'consolas';

export type CodeStudioSettings = {
	fontSize: number;
	tabSize: 2 | 4;
	wordWrap: 'on' | 'off';
	fontLigatures: boolean;
	theme: CodeStudioTheme;
	showMinimap: boolean;
	panelVisible: boolean;
	fontFamily: CodeStudioFontFamily;
};

export const defaultCodeStudioSettings: CodeStudioSettings = {
	fontSize: 13,
	tabSize: 4,
	wordWrap: 'off',
	fontLigatures: true,
	theme: 'vs-dark',
	showMinimap: false,
	panelVisible: true,
	fontFamily: 'cascadia',
};

export const FONT_FAMILY_MAP: Record<CodeStudioFontFamily, string> = {
	cascadia: "'Cascadia Code', Consolas, monospace",
	fira: "'Fira Code', Consolas, monospace",
	consolas: "Consolas, 'Courier New', monospace",
};

export function loadCodeStudioSettings(): CodeStudioSettings {
	if (typeof window === 'undefined') return defaultCodeStudioSettings;

	try {
		const raw = sessionStorage.getItem(CODE_STUDIO_SETTINGS_KEY);
		if (!raw) return defaultCodeStudioSettings;
		const parsed = JSON.parse(raw) as Partial<CodeStudioSettings>;
		return {
			...defaultCodeStudioSettings,
			...parsed,
			fontSize: clampFontSize(parsed.fontSize),
			tabSize: parsed.tabSize === 2 ? 2 : 4,
			wordWrap: parsed.wordWrap === 'on' ? 'on' : 'off',
			theme: parsed.theme === 'hc-black' ? 'hc-black' : 'vs-dark',
			fontFamily: isFontFamily(parsed.fontFamily)
				? parsed.fontFamily
				: defaultCodeStudioSettings.fontFamily,
		};
	} catch {
		return defaultCodeStudioSettings;
	}
}

export function saveCodeStudioSettings(settings: CodeStudioSettings) {
	if (typeof window === 'undefined') return;
	sessionStorage.setItem(
		CODE_STUDIO_SETTINGS_KEY,
		JSON.stringify(settings)
	);
}

function clampFontSize(value: unknown): number {
	const size = typeof value === 'number' ? value : defaultCodeStudioSettings.fontSize;
	return Math.min(20, Math.max(11, Math.round(size)));
}

function isFontFamily(value: unknown): value is CodeStudioFontFamily {
	return value === 'cascadia' || value === 'fira' || value === 'consolas';
}
