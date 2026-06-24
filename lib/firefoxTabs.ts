import { FIREFOX_HOME_URL } from '../config/taskbar';
import { getBlogHostname } from '../config/site';

export type FirefoxTab = {
	id: string;
	url: string;
	title: string;
	history: string[];
	historyIndex: number;
};

export function createFirefoxTab(url: string, title?: string): FirefoxTab {
	const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	return {
		id,
		url,
		title: title ?? url,
		history: [url],
		historyIndex: 0,
	};
}

export function buildInitialFirefoxTabs(): FirefoxTab[] {
	return [createFirefoxTab(FIREFOX_HOME_URL, getBlogHostname())];
}

export function navigateFirefoxTab(tab: FirefoxTab, url: string): FirefoxTab {
	const trimmedHistory = tab.history.slice(0, tab.historyIndex + 1);
	return {
		...tab,
		url,
		title: url,
		history: [...trimmedHistory, url],
		historyIndex: trimmedHistory.length,
	};
}

export function goBackInTab(tab: FirefoxTab): FirefoxTab | null {
	if (tab.historyIndex <= 0) return null;
	const nextIndex = tab.historyIndex - 1;
	return {
		...tab,
		url: tab.history[nextIndex],
		historyIndex: nextIndex,
	};
}

export function goForwardInTab(tab: FirefoxTab): FirefoxTab | null {
	if (tab.historyIndex >= tab.history.length - 1) return null;
	const nextIndex = tab.historyIndex + 1;
	return {
		...tab,
		url: tab.history[nextIndex],
		historyIndex: nextIndex,
	};
}
