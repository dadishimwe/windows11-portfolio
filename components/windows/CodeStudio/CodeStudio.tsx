import dynamic from 'next/dynamic';
import Image from 'next/image';
import type { editor } from 'monaco-editor';
import {
	KeyboardEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type MouseEvent as ReactMouseEvent,
} from 'react';
import Codicon from './Codicon';
import CodeStudioMenuBar, { MenuSection } from './CodeStudioMenuBar';
import CodeStudioSettingsPanel from './CodeStudioSettingsPanel';
import CodeStudioSidebar, { SidebarView } from './CodeStudioSidebar';
import FileTypeIcon from './FileTypeIcon';
import { useCodeStudioSettings } from './useCodeStudioSettings';
import { usePanelResize } from './usePanelResize';
import { codeStudioAppMeta } from '../../../config/apps/codeStudio';
import { getReplayScript } from '../../../config/codeStudio/replays';
import {
	formatPistonOutput,
	runPistonCode,
} from '../../../lib/codeStudio/execution/pistonRunner';
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
	revealEditorLocation,
	type EditorLocation,
} from '../../../lib/codeStudio/editorNavigation';
import {
	CODE_STUDIO_OPEN_EVENT,
	parseCodeStudioOpenDetail,
	type CodeStudioOpenDetail,
} from '../../../lib/codeStudio/openCodeStudio';
import {
	parseGccProblems,
	parseRunError,
	type CodeProblem,
} from '../../../lib/codeStudio/problemsParser';
import {
	isDefaultContent,
	loadPersistedState,
	OpenFile,
	restoreWorkspace,
	savePersistedState,
} from '../../../lib/codeStudio/workspace';
import { searchWorkspaceFiles } from '../../../lib/codeStudio/search';
import { FONT_FAMILY_MAP } from '../../../lib/codeStudio/settings';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './CodeStudio.module.css';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
	ssr: false,
});

type PanelTab = 'output' | 'terminal' | 'problems';
type RunMode = 'idle' | 'replay' | 'live' | 'fallback';

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
	const [runMode, setRunMode] = useState<RunMode>('idle');
	const [bannerMessage, setBannerMessage] = useState<string | null>(null);
	const [runAfterOpen, setRunAfterOpen] = useState<string | null>(null);
	const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>('idle');
	const [cursor, setCursor] = useState({ line: 1, column: 1 });
	const [explorerOpen, setExplorerOpen] = useState(true);
	const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
	const [searchQuery, setSearchQuery] = useState('');
	const { settings, updateSettings, resetSettings } = useCodeStudioSettings();
	const { panelHeight, onResizeStart } = usePanelResize({ initial: 200 });
	const [resizeActive, setResizeActive] = useState(false);
	const [pendingLocation, setPendingLocation] = useState<EditorLocation | null>(
		null
	);

	const cancelReplayRef = useRef<(() => void) | null>(null);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const workspace = getWorkspaceById(workspaceId) ?? initialWorkspace;

	const mapReplayProblems = useCallback(
		(script: NonNullable<ReturnType<typeof getReplayScript>>) =>
			(script.problems ?? []).map((problem) => ({
				...problem,
				severity: problem.severity ?? 'error',
			})),
		[]
	);

	const startReplay = useCallback(
		(
			script: NonNullable<ReturnType<typeof getReplayScript>>,
			mode: 'replay' | 'fallback',
			banner?: string
		) => {
			setIsRunning(true);
			setRunMode(mode);
			setBannerMessage(banner ?? (mode === 'replay' ? 'Demo replay — sample output' : null));
			setPanelTab('output');
			setOutputText('');
			setProblems(mapReplayProblems(script));
			cancelReplayRef.current?.();
			cancelReplayRef.current = runReplay(script, {
				onUpdate: setOutputText,
				onComplete: () => {
					setIsRunning(false);
					setRunMode('idle');
					setBannerMessage(null);
				},
			});
		},
		[mapReplayProblems]
	);

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

	const goToLocation = useCallback(
		(location: EditorLocation) => {
			setPendingLocation(location);
			openFileInEditor(location.file);
		},
		[openFileInEditor]
	);

	useEffect(() => {
		if (!pendingLocation || pendingLocation.file !== activeFile) return;

		const frameId = requestAnimationFrame(() => {
			if (!editorRef.current) return;
			revealEditorLocation(editorRef.current, pendingLocation);
			setPendingLocation(null);
		});

		return () => cancelAnimationFrame(frameId);
	}, [pendingLocation, activeFile]);

	const closeFile = useCallback(
		(filePath: string) => {
			const index = openFiles.findIndex((file) => file.path === filePath);
			if (index === -1) return;

			const nextFiles = openFiles.filter((file) => file.path !== filePath);
			let nextActive = activeFile;

			if (activeFile === filePath) {
				const fallback =
					nextFiles[Math.min(index, nextFiles.length - 1)] ??
					nextFiles[nextFiles.length - 1];
				nextActive = fallback?.path ?? '';
			}

			setOpenFiles(nextFiles);
			setActiveFile(nextActive);
			persist(workspaceId, nextFiles, nextActive);
		},
		[activeFile, openFiles, persist, workspaceId]
	);

	const applyCodeStudioOpen = useCallback(
		(detail: CodeStudioOpenDetail) => {
			if (detail.workspaceId && detail.workspaceId !== workspaceId) {
				const nextWorkspace = getWorkspaceById(detail.workspaceId);
				if (!nextWorkspace) return;

				const built = restoreWorkspace(detail.workspaceId, null);
				let nextFiles = built.openFiles;
				let nextActive = built.activeFile;

				if (detail.fileName) {
					const source = nextWorkspace.files.find(
						(file) => file.path === detail.fileName
					);
					if (source) {
						if (!nextFiles.some((file) => file.path === detail.fileName)) {
							nextFiles = [
								...nextFiles,
								{
									path: detail.fileName,
									content: source.content,
									isDirty: false,
								},
							];
						}
						nextActive = detail.fileName;
					}
				}

				setWorkspaceId(detail.workspaceId);
				setOpenFiles(nextFiles);
				setActiveFile(nextActive);
				persist(detail.workspaceId, nextFiles, nextActive);
				if (detail.run) setRunAfterOpen(nextActive);
				return;
			}

			if (detail.fileName) openFileInEditor(detail.fileName);
			if (detail.run) {
				setRunAfterOpen(detail.fileName ?? activeFile);
			}
		},
		[activeFile, openFileInEditor, persist, workspaceId]
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
			applyCodeStudioOpen(
				parseCodeStudioOpenDetail((event as CustomEvent).detail)
			);
		};

		window.addEventListener(CODE_STUDIO_OPEN_EVENT, handleOpen);
		return () =>
			window.removeEventListener(CODE_STUDIO_OPEN_EVENT, handleOpen);
	}, [applyCodeStudioOpen]);

	useEffect(() => {
		if (!runAfterOpen || activeFile !== runAfterOpen || isRunning) return;
		setRunAfterOpen(null);
		void handleRun();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [runAfterOpen, activeFile]);

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

		const replay = getReplayScript(workspaceId, activeOpenFile.path);
		const useReplay =
			isDefaultContent(
				workspaceId,
				activeOpenFile.path,
				activeOpenFile.content
			) && replay;

		if (useReplay) {
			startReplay(replay, 'replay');
			return;
		}

		setIsRunning(true);
		setRunMode('live');
		setBannerMessage(null);
		setPanelTab('output');
		setProblems([]);
		setOutputText('');

		if (language === 'python') {
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
			return;
		}

		if (language === 'c') {
			setOutputText(`Compiling ${activeOpenFile.path}...\n`);
			const piston = await runPistonCode({
				language: 'c',
				fileName: activeOpenFile.path,
				content: activeOpenFile.content,
			});

			if (piston.ok) {
				setOutputText(
					formatPistonOutput(activeOpenFile.path, 'gcc', piston)
				);
				const diagnostics = piston.compileStderr || piston.stderr;
				if (piston.compileExitCode !== 0 || diagnostics) {
					const parsed = parseGccProblems(
						activeOpenFile.path,
						diagnostics
					);
					setProblems(parsed);
					if (parsed.length > 0) setPanelTab('problems');
				}
				setIsRunning(false);
				setRunMode('idle');
				return;
			}

			if (piston.fallback && replay) {
				startReplay(
					replay,
					'fallback',
					'Demo mode — live compiler busy. Showing sample output.'
				);
				return;
			}

			setOutputText(
				formatPistonOutput(activeOpenFile.path, 'gcc', piston)
			);
			const parsed = parseGccProblems(
				activeOpenFile.path,
				piston.compileStderr || piston.error || 'Compilation failed'
			);
			setProblems(parsed);
			if (parsed.length > 0) setPanelTab('problems');
			setIsRunning(false);
			setRunMode('idle');
		}
	}, [activeOpenFile, isRunning, startReplay, workspaceId]);

	useEffect(() => {
		const onKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'F5') {
				event.preventDefault();
				void handleRun();
				return;
			}
			if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f') {
				event.preventDefault();
				setSidebarView('search');
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
			nextLines.push(
				'Commands: help, clear, run, python <file>, gcc <file.c>'
			);
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
			setRunAfterOpen(fileName);
			nextLines.push(`Running ${fileName}...`);
		} else if (trimmed.startsWith('gcc ')) {
			const fileName =
				trimmed
					.split(/\s+/)
					.find((part) => part.endsWith('.c')) ?? '';
			if (!fileName) {
				nextLines.push('usage: gcc <file.c>');
			} else {
				openFileInEditor(fileName);
				setRunAfterOpen(fileName);
				nextLines.push(`Compiling ${fileName}...`);
			}
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

	const runtimeLabel =
		activeLanguage === 'c'
			? 'GCC (Piston)'
			: activeLanguage === 'python'
				? pyodideStatus === 'ready'
					? 'Python 3.11 (Pyodide)'
					: pyodideStatus === 'loading'
						? 'Loading Pyodide...'
						: pyodideStatus === 'error'
							? 'Pyodide error'
							: 'Python 3.11 (Pyodide)'
				: 'Plain Text';

	const searchResults = useMemo(
		() => searchWorkspaceFiles(workspace, searchQuery),
		[workspace, searchQuery]
	);

	const windowTitle = activeOpenFile
		? `${activeOpenFile.path} — ${workspace.name} — Visual Studio Code`
		: `Welcome — Visual Studio Code`;

	const menuSections = useMemo<MenuSection[]>(
		() => [
			{
				id: 'file',
				label: 'File',
				items: [
					{
						id: 'open-explorer',
						label: 'Open File…',
						onSelect: () => {
							setSidebarView('explorer');
							setExplorerOpen(true);
						},
					},
					{
						id: 'close-editor',
						label: 'Close Editor',
						disabled: !activeOpenFile,
						onSelect: () => {
							if (activeOpenFile) closeFile(activeOpenFile.path);
						},
					},
					{
						id: 'file-run',
						label: 'Run',
						shortcut: 'F5',
						disabled: !activeOpenFile || isRunning,
						onSelect: () => void handleRun(),
					},
					{
						id: 'preferences',
						label: 'Preferences',
						onSelect: () => setSidebarView('settings'),
					},
				],
			},
			{
				id: 'edit',
				label: 'Edit',
				items: [
					{
						id: 'find',
						label: 'Find in Files',
						shortcut: 'Ctrl+Shift+F',
						onSelect: () => setSidebarView('search'),
					},
				],
			},
			{
				id: 'view',
				label: 'View',
				items: [
					{
						id: 'minimap',
						label: 'Minimap',
						checked: settings.showMinimap,
						onSelect: () =>
							updateSettings({ showMinimap: !settings.showMinimap }),
					},
					{
						id: 'panel',
						label: 'Panel',
						checked: settings.panelVisible,
						onSelect: () =>
							updateSettings({ panelVisible: !settings.panelVisible }),
					},
					{
						id: 'explorer-view',
						label: 'Explorer',
						checked: sidebarView === 'explorer',
						onSelect: () => setSidebarView('explorer'),
					},
					{
						id: 'search-view',
						label: 'Search',
						checked: sidebarView === 'search',
						onSelect: () => setSidebarView('search'),
					},
					{
						id: 'settings-view',
						label: 'Settings',
						checked: sidebarView === 'settings',
						onSelect: () => setSidebarView('settings'),
					},
				],
			},
			{
				id: 'run',
				label: 'Run',
				items: [
					{
						id: 'start-run',
						label: 'Start Debugging',
						shortcut: 'F5',
						disabled: !activeOpenFile || isRunning,
						onSelect: () => void handleRun(),
					},
				],
			},
			{
				id: 'terminal',
				label: 'Terminal',
				items: [
					{
						id: 'show-terminal',
						label: 'Show Integrated Terminal',
						onSelect: () => {
							updateSettings({ panelVisible: true });
							setPanelTab('terminal');
						},
					},
				],
			},
			{
				id: 'help',
				label: 'Help',
				items: [
					{
						id: 'shortcuts',
						label: 'Keyboard Shortcuts',
						onSelect: () => {
							updateSettings({ panelVisible: true });
							setPanelTab('output');
							setOutputText(
								[
									'F5 — Run active file',
									'Ctrl+Shift+F — Search in files',
									'Terminal: python <file>, gcc <file.c>, run',
								].join('\n')
							);
						},
					},
				],
			},
		],
		[
			activeOpenFile,
			closeFile,
			handleRun,
			isRunning,
			settings.panelVisible,
			settings.showMinimap,
			sidebarView,
			updateSettings,
		]
	);

	const handleResizeStart = (event: ReactMouseEvent) => {
		setResizeActive(true);
		onResizeStart(event);
	};

	useEffect(() => {
		const onMouseUp = () => setResizeActive(false);
		window.addEventListener('mouseup', onMouseUp);
		return () => window.removeEventListener('mouseup', onMouseUp);
	}, []);

	return (
		<DraggableWindow
			windowName="codeStudio"
			topTitle=" "
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
				<div className={styles.customTitleBar}>
					<div className={styles.titleBarLeft}>
						<Image
							src={codeStudioAppMeta.icon}
							alt=""
							width={16}
							height={16}
						/>
						<span className={styles.titleBarMuted}>Portfolio</span>
					</div>
					<div className={styles.titleBarCenter}>{windowTitle}</div>
					<div className={styles.titleBarRight} />
				</div>
				{bannerMessage && (
					<div
						className={`${styles.banner} ${
							runMode === 'fallback' ? styles.bannerFallback : ''
						}`}
					>
						{bannerMessage}
					</div>
				)}
				<div className={styles.body}>
					<aside className={styles.activityBar}>
						<button
							type="button"
							className={`${styles.activityButton} ${
								sidebarView === 'explorer'
									? styles.activityButtonActive
									: ''
							}`}
							title="Explorer"
							onClick={() => setSidebarView('explorer')}
						>
							<Codicon name="files" size="md" />
						</button>
						<button
							type="button"
							className={`${styles.activityButton} ${
								sidebarView === 'search'
									? styles.activityButtonActive
									: ''
							}`}
							title="Search"
							onClick={() => setSidebarView('search')}
						>
							<Codicon name="search" size="md" />
						</button>
						<div className={styles.activitySpacer} />
						<button
							type="button"
							className={styles.activityButton}
							title="Run and Debug"
							onClick={() => void handleRun()}
						>
							<Codicon name="run-all" size="md" />
						</button>
						<button
							type="button"
							className={`${styles.activityButton} ${
								sidebarView === 'settings'
									? styles.activityButtonActive
									: ''
							}`}
							title="Settings"
							onClick={() => setSidebarView('settings')}
						>
							<Codicon name="settings-gear" size="md" />
						</button>
					</aside>

					{sidebarView === 'settings' ? (
						<CodeStudioSettingsPanel
							settings={settings}
							onChange={updateSettings}
							onReset={resetSettings}
						/>
					) : (
						<CodeStudioSidebar
							view={sidebarView}
							workspace={workspace}
							workspaceId={workspaceId}
							workspaceOptions={codeWorkspaces}
							explorerOpen={explorerOpen}
							openFiles={openFiles}
							activeFile={activeFile}
							searchQuery={searchQuery}
							searchResults={searchResults}
							onSwitchWorkspace={switchWorkspace}
							onToggleExplorer={() => setExplorerOpen((open) => !open)}
							onSearchQueryChange={setSearchQuery}
							onOpenFile={openFileInEditor}
							onGoToSearchResult={(result) =>
								goToLocation({
									file: result.file,
									line: result.line,
									column: result.column,
								})
							}
						/>
					)}

					<section className={styles.main}>
						<CodeStudioMenuBar menus={menuSections} />

						<div className={styles.tabs}>
							{openFiles.map((file) => (
								<div
									key={file.path}
									role="tab"
									tabIndex={0}
									className={`${styles.tab} ${
										file.path === activeFile ? styles.tabActive : ''
									} ${file.isDirty ? styles.tabDirty : ''}`}
									onClick={() => setActiveFile(file.path)}
									onKeyDown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											setActiveFile(file.path);
										}
									}}
								>
									<FileTypeIcon fileName={file.path} size={14} />
									<span className={styles.tabLabel}>{file.path}</span>
									<button
										type="button"
										className={styles.tabClose}
										title="Close"
										onClick={(event) => {
											event.stopPropagation();
											closeFile(file.path);
										}}
									>
										<Codicon name="close" />
									</button>
								</div>
							))}
						</div>

						{activeOpenFile && (
							<div className={styles.breadcrumbBar}>
								<span>{workspace.name}</span>
								<span>›</span>
								<span className={styles.breadcrumbActive}>
									{activeOpenFile.path}
								</span>
							</div>
						)}

						<div className={styles.editorToolbar}>
							<button
								type="button"
								className={`${styles.toolbarButton} ${styles.toolbarButtonPrimary}`}
								disabled={isRunning || !activeOpenFile}
								onClick={() => void handleRun()}
								title="Run (F5)"
							>
								<Codicon name="play" />
								Run
							</button>
						</div>

						<div className={styles.editorArea}>
							{activeOpenFile ? (
								<MonacoEditor
									height="100%"
									language={monacoLanguageId(activeLanguage)}
									theme={settings.theme}
									value={activeOpenFile.content}
									onChange={(value) =>
										updateActiveContent(value ?? '')
									}
									onMount={(editorInstance) => {
										editorRef.current = editorInstance;
										editorInstance.onDidChangeCursorPosition(
											(event) => {
												setCursor({
													line: event.position.lineNumber,
													column: event.position.column,
												});
											}
										);
										if (
											pendingLocation &&
											pendingLocation.file === activeFile
										) {
											revealEditorLocation(
												editorInstance,
												pendingLocation
											);
											setPendingLocation(null);
										}
									}}
									options={{
										fontSize: settings.fontSize,
										fontFamily:
											FONT_FAMILY_MAP[settings.fontFamily],
										fontLigatures: settings.fontLigatures,
										tabSize: settings.tabSize,
										wordWrap: settings.wordWrap,
										lineHeight: 20,
										minimap: {
											enabled: settings.showMinimap,
										},
										scrollBeyondLastLine: false,
										automaticLayout: true,
										padding: { top: 8 },
										renderLineHighlight: 'line',
										bracketPairColorization: { enabled: true },
										folding: true,
										lineNumbers: 'on',
										scrollbar: {
											verticalScrollbarSize: 10,
											horizontalScrollbarSize: 10,
										},
									}}
								/>
							) : (
								<div className={styles.emptyEditor}>
									<p className={styles.welcomeTitle}>
										Portfolio Code Studio
									</p>
									<div className={styles.welcomeShortcuts}>
										<div className={styles.welcomeShortcut}>
											<span className={styles.welcomeKey}>
												Open file
											</span>
											<span>Explorer sidebar</span>
										</div>
										<div className={styles.welcomeShortcut}>
											<span className={styles.welcomeKey}>Run</span>
											<span>F5</span>
										</div>
										<div className={styles.welcomeShortcut}>
											<span className={styles.welcomeKey}>
												Terminal
											</span>
											<span>python &lt;file&gt;</span>
										</div>
									</div>
								</div>
							)}
						</div>

						{settings.panelVisible && (
							<div
								className={`${styles.panelResizeHandle} ${
									resizeActive ? styles.panelResizeHandleActive : ''
								}`}
								onMouseDown={handleResizeStart}
								title="Drag to resize panel"
							/>
						)}

						<div
							className={`${styles.panel} ${
								settings.panelVisible ? '' : styles.panelHidden
							}`}
							style={
								settings.panelVisible
									? { height: panelHeight }
									: undefined
							}
						>
							<div className={styles.panelHeader}>
								<div className={styles.panelTabs}>
									{(
										['output', 'terminal', 'problems'] as PanelTab[]
									).map((tab) => (
										<button
											key={tab}
											type="button"
											className={`${styles.panelTab} ${
												panelTab === tab
													? styles.panelTabActive
													: ''
											}`}
											onClick={() => setPanelTab(tab)}
										>
											{tab}
											{tab === 'problems' && problems.length > 0
												? ` (${problems.length})`
												: ''}
										</button>
									))}
								</div>
								<div className={styles.panelActions}>
									{panelTab === 'output' && (
										<button
											type="button"
											className={styles.panelAction}
											title="Clear output"
											onClick={() => setOutputText('')}
										>
											<Codicon name="trash" />
										</button>
									)}
								</div>
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
											<span className={styles.terminalPrompt}>
												$
											</span>
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
												onClick={() =>
													goToLocation({
														file: problem.file,
														line: problem.line,
														column: problem.column,
													})
												}
											>
												{problem.severity === 'warning' ? (
													<Codicon
														name="warning"
														className={styles.problemIconWarning}
													/>
												) : (
													<Codicon
														name="error"
														className={styles.problemIcon}
													/>
												)}
												<div>
													<div className={styles.problemMeta}>
														{problem.file} [{problem.line},
														{problem.column}]
													</div>
													<div className={styles.problemMessage}>
														{problem.message}
													</div>
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
					<div className={styles.statusLeft}>
						<span className={styles.statusItem}>⎇ main</span>
						<span className={styles.statusItem}>{runtimeLabel}</span>
					</div>
					<div className={styles.statusRight}>
						<span className={styles.statusItem}>UTF-8</span>
						<span className={styles.statusItem}>
							Spaces: {settings.tabSize}
						</span>
						<span className={styles.statusItem}>
							Ln {cursor.line}, Col {cursor.column}
						</span>
					</div>
				</footer>
			</div>
		</DraggableWindow>
	);
}

export default CodeStudio;
