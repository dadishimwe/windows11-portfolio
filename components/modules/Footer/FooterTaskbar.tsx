import { useContext } from 'react';
import {
	getMediaTaskbarMeta,
	openExternalUrl,
	startMenuSocialApps,
	taskbarPinnedApps,
	windowTaskbarMeta,
	WindowTaskbarMeta,
} from '../../../config/taskbar';
import { useMediaPlayer } from '../../../hooks/useMediaPlayer';
import { usePdfViewer } from '../../../hooks/usePdfViewer';
import { useWindowManager } from '../../../hooks/useWindowManager';
import {
	getMinimizedWindowNames,
	getOpenWindowNames,
} from '../../../lib/windowUtils';
import { Context } from '../../../context/ContextProvider';
import TaskbarButton from './TaskbarButton';
import styles from './Footer.module.css';
import WindowsMenu from './WindowsMenu';

type Props = {
	winMenu: boolean;
	handleWinMenu: () => void;
};

function isPathPinnedOpen(
	app: WindowTaskbarMeta,
	explorerPath: string,
	fileExplorerOpen: boolean
) {
	if (!fileExplorerOpen) return false;
	if (app.pathPin && app.explorerPath) {
		return explorerPath === app.explorerPath;
	}
	if (app.windowName === 'fileExplorer' && !app.pathPin) {
		return true;
	}
	return false;
}

function FooterTaskbar({ winMenu, handleWinMenu }: Props) {
	const { mediaPlayerState, pdfViewerState } = useContext(Context);
	const [mediaPlayer] = mediaPlayerState;
	const [pdfViewer] = pdfViewerState;

	const {
		openWindows,
		minimized,
		explorerPath,
		focusWindow,
		toggleWindow,
		navigateExplorer,
	} = useWindowManager();

	const { focusMedia, restoreMedia } = useMediaPlayer();
	const { focusPdf, restorePdf } = usePdfViewer();

	const openWindowNames = getOpenWindowNames(
		openWindows,
		minimized,
		mediaPlayer.isOpen,
		pdfViewer.isOpen
	);
	const minimizedWindowNames = getMinimizedWindowNames(
		openWindows,
		minimized,
		mediaPlayer.isOpen,
		pdfViewer.isOpen
	);

	const handleRestoreWindow = (windowName: string) => {
		if (windowName === 'mediaPlayer') {
			void restoreMedia();
			return;
		}

		if (windowName === 'pdfViewer') {
			void restorePdf();
			return;
		}

		const meta = windowTaskbarMeta[windowName];
		void toggleWindow(windowName as keyof typeof openWindows, {
			explorerPath: meta?.explorerPath,
		});
	};

	const handlePinnedClick = (app: (typeof taskbarPinnedApps)[number]) => {
		if (!app.windowName) return;

		if (
			app.windowName === 'fileExplorer' &&
			app.explorerPath &&
			openWindows.fileExplorer
		) {
			navigateExplorer(app.explorerPath);
			return;
		}

		void toggleWindow(
			app.windowName as keyof typeof openWindows,
			app.explorerPath ? { explorerPath: app.explorerPath } : undefined
		);
	};

	const handleOpenWindowClick = (windowName: string) => {
		if (windowName === 'mediaPlayer') {
			void focusMedia();
			return;
		}
		if (windowName === 'pdfViewer') {
			void focusPdf();
			return;
		}
		void focusWindow(windowName);
	};

	const handleMinimizedClick = (windowName: string) => {
		if (windowName === 'mediaPlayer') {
			void restoreMedia();
			return;
		}
		if (windowName === 'pdfViewer') {
			void restorePdf();
			return;
		}
		handleRestoreWindow(windowName);
	};

	const renderPinnedApp = (app: (typeof taskbarPinnedApps)[number]) => {
		const windowName = app.windowName;
		if (!windowName) return null;

		const fileExplorerOpen = openWindows.fileExplorer;
		const pathOpen = isPathPinnedOpen(app, explorerPath, fileExplorerOpen);
		const isMin = minimized[windowName];

		if (app.pathPin) {
			if (pathOpen && !isMin) {
				return (
					<TaskbarButton
						key={`open-${app.title}`}
						label={app.title}
						icon={app.icon}
						isActive
						onClick={() => void focusWindow(windowName)}
					/>
				);
			}

			return (
				<TaskbarButton
					key={`pin-${app.title}`}
					label={app.title}
					icon={app.icon}
					onClick={() => handlePinnedClick(app)}
				/>
			);
		}

		const isOpen = openWindows[windowName as keyof typeof openWindows];

		if (isOpen && !isMin) {
			return (
				<TaskbarButton
					key={`open-${app.title}`}
					label={app.title}
					icon={app.icon}
					isActive
					onClick={() => void focusWindow(windowName)}
				/>
			);
		}

		if (isOpen && isMin) {
			return (
				<TaskbarButton
					key={`min-${app.title}`}
					label={app.title}
					icon={app.icon}
					isMinimized
					onClick={() => handleRestoreWindow(windowName)}
				/>
			);
		}

		return (
			<TaskbarButton
				key={`pin-${app.title}`}
				label={app.title}
				icon={app.icon}
				onClick={() => handlePinnedClick(app)}
			/>
		);
	};

	const mediaTaskbarMeta = mediaPlayer.isOpen
		? getMediaTaskbarMeta(mediaPlayer.kind)
		: null;
	const pdfTaskbarTitle = pdfViewer.document?.title ?? 'Document';

	return (
		<>
			<section className={styles.iconContainer}>
				<div className="windowsIcon">
					<TaskbarButton
						label="Start"
						icon="/icons/windows/windows.png"
						onClick={handleWinMenu}
					/>
				</div>
				{taskbarPinnedApps.map((app) => renderPinnedApp(app))}
				{mediaPlayer.isOpen &&
					mediaTaskbarMeta &&
					!minimized.mediaPlayer && (
						<TaskbarButton
							key="open-mediaPlayer"
							label={mediaTaskbarMeta.title}
							icon={mediaTaskbarMeta.icon}
							isActive
							onClick={() => {
								if (minimized.mediaPlayer) {
									void restoreMedia();
								} else {
									void focusMedia();
								}
							}}
						/>
					)}
				{mediaPlayer.isOpen && minimized.mediaPlayer && mediaTaskbarMeta && (
					<TaskbarButton
						key="min-mediaPlayer"
						label={mediaTaskbarMeta.title}
						icon={mediaTaskbarMeta.icon}
						isMinimized
						onClick={() => void restoreMedia()}
					/>
				)}
				{pdfViewer.isOpen && !minimized.pdfViewer && (
					<TaskbarButton
						key="open-pdfViewer"
						label={pdfTaskbarTitle}
						icon="/icons/documents/documents.png"
						isActive
						onClick={() => {
							if (minimized.pdfViewer) {
								void restorePdf();
							} else {
								void focusPdf();
							}
						}}
					/>
				)}
				{pdfViewer.isOpen && minimized.pdfViewer && (
					<TaskbarButton
						key="min-pdfViewer"
						label={pdfTaskbarTitle}
						icon="/icons/documents/documents.png"
						isMinimized
						onClick={() => void restorePdf()}
					/>
				)}
				{openWindowNames
					.filter(
						(name) =>
							name !== 'mediaPlayer' &&
							name !== 'pdfViewer' &&
							!taskbarPinnedApps.some(
								(app) =>
									app.windowName === name && !app.pathPin
							)
					)
					.map((windowName) => {
						const meta = windowTaskbarMeta[windowName];
						if (!meta) return null;

						return (
							<TaskbarButton
								key={`open-${windowName}`}
								label={meta.title}
								icon={meta.icon}
								isActive
								onClick={() => handleOpenWindowClick(windowName)}
							/>
						);
					})}
				{minimizedWindowNames
					.filter(
						(name) =>
							name !== 'mediaPlayer' &&
							name !== 'pdfViewer' &&
							!openWindowNames.includes(name) &&
							!taskbarPinnedApps.some(
								(app) => app.windowName === name && !app.pathPin
							)
					)
					.map((windowName) => {
						const meta = windowTaskbarMeta[windowName];
						if (!meta) return null;

						return (
							<TaskbarButton
								key={`min-${windowName}`}
								label={meta.title}
								icon={meta.icon}
								isMinimized
								onClick={() => handleMinimizedClick(windowName)}
							/>
						);
					})}
			</section>
			<WindowsMenu
				winMenu={winMenu}
				handleWinMenu={handleWinMenu}
				onOpenApp={(windowName, explorerPath) => {
					handleWinMenu();
					void toggleWindow(windowName, explorerPath ? { explorerPath } : undefined);
				}}
				onOpenSocial={(href) => {
					handleWinMenu();
					openExternalUrl(href);
				}}
			/>
		</>
	);
}

export default FooterTaskbar;
