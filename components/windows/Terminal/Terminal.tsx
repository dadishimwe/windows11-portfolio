import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
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

	const promptPath = formatPromptPath(cwd);

	const executeCommand = useCallback(
		async (input: string) => {
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
		const handleFocus = () => {
			const terminal = document.getElementsByClassName(
				'prompt'
			)[0] as HTMLInputElement;
			terminal?.focus();
			terminal?.scrollIntoView();
		};

		const handleKeyUp = async (e: KeyboardEvent) => {
			if (e.key !== 'Enter') return;

			const target = e.target as HTMLInputElement;
			if (!target.classList.contains('prompt')) return;

			const input = target.value;
			await executeCommand(input);
			target.value = '';
		};

		document.addEventListener('keydown', handleFocus);
		document.addEventListener('click', handleFocus);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleFocus);
			document.removeEventListener('keyup', handleKeyUp);
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
						<input type="text" className="prompt" />
					</div>
				</div>
			</div>
			<div className={styles.background} />
		</DraggableWindow>
	);
}

export default Terminal;
