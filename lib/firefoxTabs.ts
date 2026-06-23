import { FIREFOX_HOME_URL } from '../config/taskbar';

export type FirefoxTab = {
	id: string;
	url: string;
	title: string;
};

export function createFirefoxTab(url: string, title?: string): FirefoxTab {
	const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	return {
		id,
		url,
		title: title ?? url,
	};
}

export function buildInitialFirefoxTabs(): FirefoxTab[] {
	return [createFirefoxTab(FIREFOX_HOME_URL, 'dadishimwe.com')];
}
