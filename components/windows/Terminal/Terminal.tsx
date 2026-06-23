import Image from 'next/image';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../../../config/site';
import { HOME_DIR } from '../../../config/filesystem';
import { runTerminalCommand } from '../../../lib/terminalCommands';
import {
	buildInitialTerminalSessions,
	createTerminalSession,
	TerminalSession,
} from '../../../lib/terminalTabs';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Terminal.module.css';

const terminalPath = `MINGW64:/c/Users/${site.username}`;
const terminalPrompt = `${site.username}@${site.hostname}`;

function formatPromptPath(cwd: string) {
	if (cwd === HOME_DIR) return '~';
	return cwd.replace(HOME_DIR, '~');
}

function Terminal({ onClose }: { onClose?: () => void }) {
	const [sessions, setSessions] = useState<TerminalSession[]>(
		buildInitialTerminalSessions
	);
	const [activeSessionId, setActiveSessionId] = useState(
		() => buildInitialTerminalSessions()[0].id
	);
	const [inputValue, setInputValue] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);
	const commandHistoryRef = useRef<string[]>([]);
	const historyIndexRef = useRef(-1);
	const draftRef = useRef('');

	const activeSession =
		sessions.find((session) => session.id === activeSessionId) ??
		sessions[0];

	const promptPath = formatPromptPath(activeSession.cwd);

	const updateSession = useCallback(
		(sessionId: string, updater: (session: TerminalSession) => TerminalSession) => {
			setSessions((prev) =>
				prev.map((session) =>
					session.id === sessionId ? updater(session) : session
				)
			);
		},
		[]
	);

	const executeCommand = useCallback(
		async (input: string) => {
			const trimmed = input.trim();
			const session = sessions.find((item) => item.id === activeSessionId);
			if (!session) return;

			const promptAtExecution = formatPromptPath(session.cwd);
			const result = await runTerminalCommand(input, {
				cwd: session.cwd,
				cachedPublicIp: session.cachedPublicIp,
			});

			if (result.clear) {
				updateSession(activeSessionId, (current) => ({
					...current,
					history: [],
				}));
				return;
			}

			updateSession(activeSessionId, (current) => {
				const next: TerminalSession = { ...current };

				if (result.newCwd) next.cwd = result.newCwd;
				if (result.cachedPublicIp) {
					next.cachedPublicIp = result.cachedPublicIp;
				}

				next.history = [
					...current.history,
					{
						input,
						response: result.response,
						promptPath: promptAtExecution,
					},
				];

				return next;
			});

			if (trimmed) {
				const previous = commandHistoryRef.current;
				if (previous[previous.length - 1] !== trimmed) {
					commandHistoryRef.current = [...previous, trimmed];
				}
			}
		},
		[activeSessionId, sessions, updateSession]
	);

	const handleInputKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
		const commandHistory = commandHistoryRef.current;

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (commandHistory.length === 0) return;

			if (historyIndexRef.current === -1) {
				draftRef.current = inputValue;
				historyIndexRef.current = commandHistory.length - 1;
			} else {
				historyIndexRef.current = Math.max(
					0,
					historyIndexRef.current - 1
				);
			}

			setInputValue(commandHistory[historyIndexRef.current]);
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndexRef.current === -1) return;

			const nextIndex = historyIndexRef.current + 1;
			if (nextIndex >= commandHistory.length) {
				historyIndexRef.current = -1;
				setInputValue(draftRef.current);
				return;
			}

			historyIndexRef.current = nextIndex;
			setInputValue(commandHistory[nextIndex]);
			return;
		}

		if (e.key === 'Enter') {
			e.preventDefault();
			await executeCommand(inputValue);
			setInputValue('');
			historyIndexRef.current = -1;
			draftRef.current = '';
		}
	};

	const handleAddTab = () => {
		const nextSession = createTerminalSession();
		setSessions((prev) => [...prev, nextSession]);
		setActiveSessionId(nextSession.id);
		setInputValue('');
		historyIndexRef.current = -1;
		draftRef.current = '';
	};

	const handleCloseTab = (sessionId: string) => {
		if (sessions.length === 1) {
			const replacement = createTerminalSession('MINGW64');
			setSessions([replacement]);
			setActiveSessionId(replacement.id);
			setInputValue('');
			commandHistoryRef.current = [];
			historyIndexRef.current = -1;
			draftRef.current = '';
			return;
		}

		const sessionIndex = sessions.findIndex(
			(session) => session.id === sessionId
		);
		const nextSessions = sessions.filter(
			(session) => session.id !== sessionId
		);
		setSessions(nextSessions);

		if (sessionId === activeSessionId) {
			const nextSession =
				nextSessions[Math.max(0, sessionIndex - 1)] ?? nextSessions[0];
			setActiveSessionId(nextSession.id);
			setInputValue('');
			historyIndexRef.current = -1;
			draftRef.current = '';
		}
	};

	useEffect(() => {
		inputRef.current?.focus();
	}, [activeSessionId]);

	return (
		<DraggableWindow
			windowName="terminal"
			topTitle={terminalPath}
			topIcon={
				<Image
					src="/icons/terminal/terminal.png"
					alt="ico"
					width={20}
					height={20}
				/>
			}
			onClose={onClose}
			terminalTabBar={{
				tabs: sessions.map((session) => ({
					id: session.id,
					title: session.title,
				})),
				activeTabId: activeSessionId,
				onSelect: (id) => {
					setActiveSessionId(id);
					setInputValue('');
					historyIndexRef.current = -1;
					draftRef.current = '';
				},
				onClose: handleCloseTab,
				onAdd: handleAddTab,
			}}
		>
			<div
				className={styles.shell}
				onClick={() => inputRef.current?.focus()}
			>
				<div className={styles.background} aria-hidden />
				<div className={`${styles.main} terminal`}>
					{activeSession.history.map((item, index) => (
						<div
							key={`${item.input}${index}`}
							className={styles.historyItem}
						>
							<p className={styles.terminalTitle}>
								{terminalPrompt} <span>MINGW64</span>{' '}
								<span>{item.promptPath ?? promptPath}</span>
							</p>
							<p>$ {item.input}</p>
							{item.response?.split('<br/>')?.map((text, line) => (
								<p key={line}>{text}</p>
							))}
						</div>
					))}
					<div className={styles.historyItem}>
						<p className={styles.terminalTitle}>
							{terminalPrompt} <span>MINGW64</span>{' '}
							<span>{promptPath}</span>
						</p>
						<div className={styles.promt}>
							<p>$</p>
							<input
								ref={inputRef}
								type="text"
								className="prompt"
								spellCheck={false}
								autoComplete="off"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleInputKeyDown}
							/>
						</div>
					</div>
				</div>
			</div>
		</DraggableWindow>
	);
}

export default Terminal;
