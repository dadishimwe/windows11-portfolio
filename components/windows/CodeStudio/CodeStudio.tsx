import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
	KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	VscFiles,
	VscPlay,
	VscRunAll,
	VscSearch,
	VscSettingsGear,
} from 'react-icons/vsc';
import { codeStudioAppMeta } from '../../../config/apps/codeStudio';
import { getReplayScript } from '../../../config/codeStudio/replays';
import {
	isRunnableLanguage,
	languageFromFileName,
	monacoLanguageId,
} from '../../../config/codeStudio/languages';
import {
	codeWorkspaces,
	getWorkspaceById,
	defaultWorkspaceId,
} from '../../../config/codeStudio/workspaces';
import { runReplay } from '../../../lib/codeStudio/execution/replayRunner';
import {
	preloadPyodide,
	runPythonCode,
	subscribePyodideStatus,
	type PyodideStatus,
} from '../../../lib/codeStudio/execution/pythonRunner';
import {
	CODE_STUDIO_OPEN_EVENT,
	parseCodeStudioOpenDetail,
} from '../../../lib/codeStudio/openCodeStudio';
import { parseRunError, type CodeProblem } from '../../../lib/codeStudio/problemsParser';
import {
	isDefaultContent,
	listWorkspaceFiles,
	loadPersistedState,
	OpenFile,
	restoreWorkspace,
	savePersistedState,
} from '../../../lib/codeStudio/workspace';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './CodeStudio.module.css';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
});

type PanelTab = 'output' | 'terminal' | 'problems';

type Props = {
	onClose?: () => void;
};

function CodeStudio({ onClose }: Props) {
	const persisted = useMemo(() => loadPersistedState(), []);
	const initialWorkspaceId = persisted?.workspaceId ?? defaultWorkspaceId;
	const initialWorkspace = getWorkspaceById(initialWorkspaceId)!;

	const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
	const [openFiles, setOpenFiles] = useState<OpenFile[]>(() => {
		const restored = restoreWorkspace(initialWorkspaceId, persisted);
		return restored.openFiles;
	});
	const [activeFile, setActiveFile] = useState(() => {
		const restored = restoreWorkspace(initialWorkspaceId, persisted);
		return restored.activeFile;
	});
	const [panelTab, setPanelTab] = useState<PanelTab>('output');
	const [outputText, setOutputText] = useState('');
	const [terminalLines, setTerminalLines] = useState<string[]>([
		'Code Studio terminal — type python <file> or help',
	]);
	const [terminalInput, setTerminalInput] = useState('');
	const [problems, setProblems] = useState<CodeProblem[]>([]);
	const [isRunning, setIsRunning] = useState(false);
	const [runMode, setRunMode] = useState<'idle' | 'replay' | 'live'>('idle');
	const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>('idle');
	const [cursor, setCursor] = useState({ line: 1, column: 1 });

	const cancelReplayRef = useRef<(() => void) | null>(null);
	const workspace = getWorkspaceById(workspaceId) ?? initialWorkspace;

	const activeOpenFile = openFiles.find((file) => file.path === activeFile);
	const activeLanguage = activeOpenFile
		? languageFromFileName(activeOpenFile.path)
		: 'text';

	const persist = useCallback(
		(nextWorkspaceId: string, files: OpenFile[], nextActive: string) => {
			savePersistedState({
				workspaceId: nextWorkspaceId,
				openFiles: files.map((file) => file.path),
				activeFile: nextActive,
				files: Object.fromEntries(
					files.map((file) => [file.path, file.content])
				),
			});
		},
		[]
	);

	const openFileInEditor = useCallback(
		(filePath: string) => {
			const existing = openFiles.find((file) => file.path === filePath);
			if (existing) {
				setActiveFile(filePath);
				return;
			}

			const source = workspace.files.find((file) => file.path === filePath);
			if (!source) return;

			const nextFiles = [
				...openFiles,
				{ path: filePath, content: source.content, isDirty: false },
			];
			setOpenFiles(nextFiles);
			setActiveFile(filePath);
			persist(workspaceId, nextFiles, filePath);
		},
		[openFiles, persist, workspace.files, workspaceId]
	);

	const switchWorkspace = useCallback(
		(nextWorkspaceId: string) => {
			const nextWorkspace = getWorkspaceById(nextWorkspaceId);
			if (!nextWorkspace) return;

			const built = restoreWorkspace(nextWorkspaceId, null);
			setWorkspaceId(nextWorkspaceId);
			setOpenFiles(built.openFiles);
			setActiveFile(built.activeFile);
			setOutputText('');
			setProblems([]);
			setPanelTab('output');
			persist(nextWorkspaceId, built.openFiles, built.activeFile);
		},
		[persist]
	);

	useEffect(() => {
		const unsubscribe = subscribePyodideStatus(setPyodideStatus);
		preloadPyodide();
		return unsubscribe;
	}, []);

	useEffect(() => {
		const handleOpen = (event: Event) => {
			const detail = parseCodeStudioOpenDetail(
				(event as CustomEvent).detail
			);
			if (detail.workspaceId) switchWorkspace(detail.workspaceId);
			if (detail.fileName) openFileInEditor(detail.fileName);
		};

		window.addEventListener(CODE_STUDIO_OPEN_EVENT, handleOpen);
		return () =>
			window.removeEventListener(CODE_STUDIO_OPEN_EVENT, handleOpen);
	}, [openFileInEditor, switchWorkspace]);

	const updateActiveContent = useCallback(
		(content: string) => {
			if (!activeOpenFile) return;
			const defaultContent = workspace.files.find(
				(file) => file.path === activeOpenFile.path
			)?.content;
			const isDirty = defaultContent !== undefined && content !== defaultContent;

			const nextFiles = openFiles.map((file) =>
				file.path === activeOpenFile.path
					? { ...file, content, isDirty }
					: file
			);
			setOpenFiles(nextFiles);
			persist(workspaceId, nextFiles, activeFile);
		},
		[activeFile, activeOpenFile, openFiles, persist, workspace.files, workspaceId]
	);

	const handleRun = useCallback(async () => {
		if (!activeOpenFile || isRunning) return;

		const language = languageFromFileName(activeOpenFile.path);
		if (!isRunnableLanguage(language)) {
			setOutputText('This file type is not runnable.');
			setPanelTab('output');
			return;
		}

		if (language === 'c') {
			const replay = getReplayScript(workspaceId, activeOpenFile.path);
			if (replay) {
				setIsRunning(true);
				setRunMode('replay');
				setPanelTab('output');
				setOutputText('');
				setProblems(
					(replay.problems ?? []).map((problem) => ({
						...problem,
						severity: problem.severity ?? 'error',
					}))
				);
				cancelReplayRef.current?.();
				cancelReplayRef.current = runReplay(replay, {
					onUpdate: setOutputText,
					onComplete: () => {
						setIsRunning(false);
						setRunMode('idle');
					},
				});
				return;
			}
			setOutputText(
				'Live C compilation ships in Phase 3. Edit and run Python samples for now.'
			);
			setPanelTab('output');
			return;
		}

		const useReplay =
			isDefaultContent(
				workspaceId,
				activeOpenFile.path,
				activeOpenFile.content
			) && getReplayScript(workspaceId, activeOpenFile.path);

		setIsRunning(true);
		setPanelTab('output');
		setProblems([]);
		setOutputText('');

		if (useReplay) {
			setRunMode('replay');
			cancelReplayRef.current?.();
			cancelReplayRef.current = runReplay(useReplay, {
				onUpdate: setOutputText,
				onComplete: () => {
					setIsRunning(false);
					setRunMode('idle');
					if (useReplay.problems?.length) {
						setProblems(
							useReplay.problems.map((problem) => ({
								...problem,
								severity: problem.severity ?? 'error',
							}))
						);
						setPanelTab('problems');
					}
				},
			});
			return;
		}

		setRunMode('live');
		setOutputText('Loading Python runtime...\n');
		const prefix = `$ python ${activeOpenFile.path}\n`;
		const result = await runPythonCode(activeOpenFile.content);
		const combined = [
			prefix,
			result.stdout,
			result.stderr,
			result.error ? `Error: ${result.error}` : '',
		]
			.filter(Boolean)
			.join('\n');
		setOutputText(combined);

		if (result.error || result.stderr) {
			const parsed = parseRunError(
				activeOpenFile.path,
				result.error || result.stderr,
				'python'
			);
			setProblems(parsed);
			if (parsed.length > 0) setPanelTab('problems');
		}

		setIsRunning(false);
		setRunMode('idle');
	}, [activeOpenFile, isRunning, workspaceId]);

	useEffect(() => {
		const onKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'F5') {
				event.preventDefault();
				void handleRun();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleRun]);

	const handleTerminalSubmit = () => {
		const trimmed = terminalInput.trim();
		if (!trimmed) return;

		const nextLines = [...terminalLines, `$ ${trimmed}`];

		if (trimmed === 'help') {
			nextLines.push('Commands: help, clear, python <file>, run');
		} else if (trimmed === 'clear') {
			setTerminalLines([]);
			setTerminalInput('');
			return;
		} else if (trimmed === 'run') {
			void handleRun();
			nextLines.push('Running active file...');
		} else if (trimmed.startsWith('python ')) {
			const fileName = trimmed.slice('python '.length).trim();
			openFileInEditor(fileName);
			nextLines.push(`Opened ${fileName}`);
		} else {
			nextLines.push(`bash: ${trimmed.split(' ')[0]}: command not found`);
		}

		setTerminalLines(nextLines);
		setTerminalInput('');
		setPanelTab('terminal');
	};

	const onTerminalKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') handleTerminalSubmit();
	};

	const pyodideLabel =
		pyodideStatus === 'ready'
			? 'Pyodide ready'
			: pyodideStatus === 'loading'
				? 'Loading Pyodide...'
				: pyodideStatus === 'error'
					? 'Pyodide error'
					: 'Python 3.11 (Pyodide)';

	return (
		<DraggableWindow
			windowName="codeStudio"
			topTitle={codeStudioAppMeta.title}
			topIcon={
				<Image
					src={codeStudioAppMeta.icon}
					alt=""
					width={20}
					height={20}
				/>
			}
			onClose={onClose}
		>
			<div className={styles.shell}>
				{runMode === 'replay' && (
					<div className={styles.banner}>Demo replay — sample output</div>
				)}
				<div className={styles.body}>
					<aside className={styles.activityBar}>
						<button
							type="button"
							className={`${styles.activityButton} ${styles.activityButtonActive}`}
							title="Explorer"
						>
							<VscFiles size={24} />
						</button>
						<button
							type="button"
							className={styles.activityButton}
							title="Search"
						>
							<VscSearch size={24} />
						</button>
						<button
							type="button"
							className={styles.activityButton}
							title="Run"
							onClick={() => void handleRun()}
						>
							<VscRunAll size={24} />
						</button>
						<button
							type="button"
							className={styles.activityButton}
							title="Settings"
						>
							<VscSettingsGear size={24} />
						</button>
					</aside>

					<aside className={styles.sidebar}>
						<div className={styles.sidebarSection}>WORKSPACES</div>
						<select
							className={styles.workspaceSelect}
							value={workspaceId}
							onChange={(event) => switchWorkspace(event.target.value)}
						>
							{codeWorkspaces.map((item) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
						<div className={styles.sidebarSection}>EXPLORER</div>
						<ul className={styles.fileList}>
							{listWorkspaceFiles(workspace).map((filePath) => {
								const open = openFiles.find(
									(file) => file.path === filePath
								);
								const isActive = activeFile === filePath;
								return (
									<li key={filePath}>
										<button
											type="button"
											className={`${styles.fileItem} ${
												isActive ? styles.fileItemActive : ''
											} ${open?.isDirty ? styles.fileDirty : ''}`}
											onClick={() => openFileInEditor(filePath)}
										>
											{filePath}
										</button>
									</li>
								);
							})}
						</ul>
					</aside>

					<section className={styles.main}>
						<div className={styles.menuBar}>
							<span>File</span>
							<span>Edit</span>
							<span>Selection</span>
							<span>View</span>
							<span>Run</span>
							<button
								type="button"
								className={styles.menuRun}
								disabled={isRunning}
								onClick={() => void handleRun()}
							>
								<VscPlay style={{ verticalAlign: 'middle' }} /> Run
							</button>
						</div>

						<div className={styles.tabs}>
							{openFiles.map((file) => (
								<button
									key={file.path}
									type="button"
									className={`${styles.tab} ${
										file.path === activeFile ? styles.tabActive : ''
									} ${file.isDirty ? styles.tabDirty : ''}`}
									onClick={() => setActiveFile(file.path)}
								>
									{file.path}
								</button>
							))}
						</div>

						<div className={styles.editorArea}>
							{activeOpenFile ? (
								<MonacoEditor
									height="100%"
									language={monacoLanguageId(activeLanguage)}
									theme="vs-dark"
									value={activeOpenFile.content}
									onChange={(value) =>
										updateActiveContent(value ?? '')
									}
									onMount={(editor) => {
										editor.onDidChangeCursorPosition((event) => {
											setCursor({
												line: event.position.lineNumber,
												column: event.position.column,
											});
										});
									}}
									options={{
										fontSize: 13,
										minimap: { enabled: false },
										scrollBeyondLastLine: false,
										automaticLayout: true,
										padding: { top: 8 },
									}}
								/>
							) : (
								<div className={styles.emptyEditor}>
									Open a file from the explorer
								</div>
							)}
						</div>

						<div className={styles.panel}>
							<div className={styles.panelTabs}>
								{(['output', 'terminal', 'problems'] as PanelTab[]).map(
									(tab) => (
										<button
											key={tab}
											type="button"
											className={`${styles.panelTab} ${
												panelTab === tab ? styles.panelTabActive : ''
											}`}
											onClick={() => setPanelTab(tab)}
										>
											{tab}
											{tab === 'problems' && problems.length > 0
												? ` (${problems.length})`
												: ''}
										</button>
									)
								)}
							</div>
							<div className={styles.panelBody}>
								{panelTab === 'output' && (
									<div>{outputText || 'Run a file to see output.'}</div>
								)}
								{panelTab === 'terminal' && (
									<div>
										{terminalLines.map((line, index) => (
											<div key={`${line}-${index}`}>{line}</div>
										))}
										<div className={styles.terminalInputRow}>
											<span>$</span>
											<input
												className={styles.terminalInput}
												value={terminalInput}
												onChange={(event) =>
													setTerminalInput(event.target.value)
												}
												onKeyDown={onTerminalKeyDown}
												placeholder="help"
											/>
										</div>
									</div>
								)}
								{panelTab === 'problems' && (
									<ul className={styles.problemsList}>
										{problems.length === 0 && (
											<li>No problems detected.</li>
										)}
										{problems.map((problem, index) => (
											<li
												key={`${problem.file}-${problem.line}-${index}`}
												className={styles.problemItem}
												onClick={() => openFileInEditor(problem.file)}
											>
												<div>
													{problem.file} [{problem.line},{problem.column}]
												</div>
												<div className={styles.problemMessage}>
													{problem.message}
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</section>
				</div>

				<footer className={styles.statusBar}>
					<span className={styles.statusItem}>⎇ main</span>
					<span className={styles.statusItem}>{pyodideLabel}</span>
					<span className={styles.statusSpacer} />
					<span className={styles.statusItem}>UTF-8</span>
					<span className={styles.statusItem}>Spaces: 4</span>
					<span className={styles.statusItem}>
						Ln {cursor.line}, Col {cursor.column}
					</span>
				</footer>
			</div>
		</DraggableWindow>
	);
}

export default CodeStudio;
