import { useContext } from 'react';
import {
	openExternalUrl,
	startMenuSocialApps,
	taskbarPinnedApps,
	windowTaskbarMeta,
} from '../../../config/taskbar';
import { useWindowManager } from '../../../hooks/useWindowManager';
import {
	getMinimizedWindowNames,
	getOpenWindowNames,
} from '../../../lib/windowUtils';
import TaskbarButton from './TaskbarButton';
import styles from './Footer.module.css';
import WindowsMenu from './WindowsMenu';

type Props = {
	winMenu: boolean;
	handleWinMenu: () => void;
};

function FooterTaskbar({ winMenu, handleWinMenu }: Props) {
	const { openWindows, minimized, focusWindow, toggleWindow } =
		useWindowManager();

	const openWindowNames = getOpenWindowNames(openWindows, minimized);
	const minimizedWindowNames = getMinimizedWindowNames(openWindows, minimized);

	const handleRestoreWindow = (windowName: string) => {
		const meta = windowTaskbarMeta[windowName];
		void toggleWindow(windowName as keyof typeof openWindows, {
			explorerPath: meta?.explorerPath,
		});
	};

	const handlePinnedClick = (app: (typeof taskbarPinnedApps)[number]) => {
		if (!app.windowName) return;

		void toggleWindow(
			app.windowName as keyof typeof openWindows,
			app.explorerPath ? { explorerPath: app.explorerPath } : undefined
		);
	};

	const isPinnedActive = (app: (typeof taskbarPinnedApps)[number]) => {
		if (!app.windowName) return false;
		return (
			openWindows[app.windowName as keyof typeof openWindows] &&
			!minimized[app.windowName]
		);
	};

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
				{taskbarPinnedApps.map((app) => {
					const windowName = app.windowName;
					const isOpen =
						windowName &&
						openWindows[windowName as keyof typeof openWindows];
					const isMin = windowName && minimized[windowName];
					const isActive = isPinnedActive(app);

					if (isOpen && !isMin && openWindowNames.includes(windowName!)) {
						return (
							<TaskbarButton
								key={`open-${app.title}`}
								label={app.title}
								icon={app.icon}
								isActive
								onClick={() => void focusWindow(windowName!)}
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
								onClick={() => handleRestoreWindow(windowName!)}
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
				})}
				{openWindowNames
					.filter(
						(name) =>
							!taskbarPinnedApps.some(
								(app) => app.windowName === name
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
								onClick={() => void focusWindow(windowName)}
							/>
						);
					})}
				{minimizedWindowNames
					.filter(
						(name) =>
							!openWindowNames.includes(name) &&
							!taskbarPinnedApps.some(
								(app) => app.windowName === name
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
								onClick={() => handleRestoreWindow(windowName)}
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
