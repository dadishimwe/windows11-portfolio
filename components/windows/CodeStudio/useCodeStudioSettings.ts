import { useCallback, useEffect, useState } from 'react';
import {
	CodeStudioSettings,
	defaultCodeStudioSettings,
	loadCodeStudioSettings,
	saveCodeStudioSettings,
} from '../../../lib/codeStudio/settings';

export function useCodeStudioSettings() {
	const [settings, setSettings] = useState<CodeStudioSettings>(
		defaultCodeStudioSettings
	);

	useEffect(() => {
		setSettings(loadCodeStudioSettings());
	}, []);

	const updateSettings = useCallback(
		(patch: Partial<CodeStudioSettings>) => {
			setSettings((current) => {
				const next = { ...current, ...patch };
				saveCodeStudioSettings(next);
				return next;
			});
		},
		[]
	);

	const resetSettings = useCallback(() => {
		saveCodeStudioSettings(defaultCodeStudioSettings);
		setSettings(defaultCodeStudioSettings);
	}, []);

	return { settings, updateSettings, resetSettings };
}
