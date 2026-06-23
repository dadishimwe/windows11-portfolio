import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../../../config/site';
import { HOME_DIR } from '../../../config/filesystem';
import { runTerminalCommand } from '../../../lib/terminalCommands';
import { HistoryType } from '../../../typings';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Terminal.module.css';

const terminalPath = `MINGW64:/c/Users/${site.username}`;
const terminalPrompt = `${site.username}@${site.hostname}`;

function formatPromptPath(cwd: string) {
	if (cwd === HOME_DIR) return '~';
	return cwd.replace(HOME_DIR, '~');
}

function Terminal() {
	const [history, setHistory] = useState<HistoryType[]>([]);
	const [cwd, setCwd] = useState(HOME_DIR);
	const [cachedPublicIp, setCachedPublicIp] = useState<string>();

	const inputRef = useRef<HTMLInputElement>(null);
	const commandHistoryRef = useRef<string[]>([]);
	const historyIndexRef = useRef(-1);
	const draftRef = useRef('');

	const promptPath = formatPromptPath(cwd);

	const executeCommand = useCallback(
		async (input: string) => {
			const trimmed = input.trim();
			const promptAtExecution = formatPromptPath(cwd);
			const result = await runTerminalCommand(input, {
				cwd,
				cachedPublicIp,
			});

			if (result.clear) {
				setHistory([]);
				return;
			}

			if (result.newCwd) {
				setCwd(result.newCwd);
			}

			if (result.cachedPublicIp) {
				setCachedPublicIp(result.cachedPublicIp);
			}

			if (trimmed) {
				const previous = commandHistoryRef.current;
				if (previous[previous.length - 1] !== trimmed) {
					commandHistoryRef.current = [...previous, trimmed];
				}
			}

			setHistory((prev) => [
				...prev,
				{
					input,
					response: result.response,
					promptPath: promptAtExecution,
				},
			]);
		},
		[cwd, cachedPublicIp]
	);

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;

		const handleKeyDown = async (e: KeyboardEvent) => {
			const commandHistory = commandHistoryRef.current;

			if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (commandHistory.length === 0) return;

				if (historyIndexRef.current === -1) {
					draftRef.current = input.value;
					historyIndexRef.current = commandHistory.length - 1;
				} else {
					historyIndexRef.current = Math.max(
						0,
						historyIndexRef.current - 1
					);
				}

				input.value = commandHistory[historyIndexRef.current];
				return;
			}

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (historyIndexRef.current === -1) return;

				const nextIndex = historyIndexRef.current + 1;
				if (nextIndex >= commandHistory.length) {
					historyIndexRef.current = -1;
					input.value = draftRef.current;
					return;
				}

				historyIndexRef.current = nextIndex;
				input.value = commandHistory[nextIndex];
				return;
			}

			if (e.key === 'Enter') {
				e.preventDefault();
				const value = input.value;
				await executeCommand(value);
				input.value = '';
				historyIndexRef.current = -1;
				draftRef.current = '';
			}
		};

		const handleFocus = () => input.focus();

		input.addEventListener('keydown', handleKeyDown);
		document.addEventListener('click', handleFocus);

		input.focus();

		return () => {
			input.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleFocus);
		};
	}, [executeCommand]);

	return (
		<DraggableWindow
			windowName={'terminal'}
			topTitle={terminalPath}
			topIcon={
				<Image
					src={`/icons/terminal/terminal.png`}
					alt="ico"
					width={20}
					height={20}
				/>
			}
		>
			<div className={`${styles.main} terminal`}>
				{history.map((item, index) => (
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
					<div className={`${styles.promt}`}>
						<p>$</p>
						<input
							ref={inputRef}
							type="text"
							className="prompt"
							spellCheck={false}
							autoComplete="off"
						/>
					</div>
				</div>
			</div>
			<div className={styles.background} />
		</DraggableWindow>
	);
}

export default Terminal;
