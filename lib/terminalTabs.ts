import { HistoryType } from '../typings';
import { HOME_DIR } from '../config/filesystem';

export type TerminalSession = {
	id: string;
	title: string;
	history: HistoryType[];
	cwd: string;
	cachedPublicIp?: string;
};

let terminalTabCounter = 0;

export function createTerminalSession(title?: string): TerminalSession {
	terminalTabCounter += 1;
	return {
		id: `term-${Date.now()}-${terminalTabCounter}`,
		title: title ?? `MINGW64-${terminalTabCounter}`,
		history: [],
		cwd: HOME_DIR,
	};
}

export function buildInitialTerminalSessions(): TerminalSession[] {
	return [createTerminalSession('MINGW64')];
}
