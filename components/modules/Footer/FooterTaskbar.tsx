import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Context } from '../../../context/ContextProvider';
import {
	pinnedApps,
	windowTaskbarMeta,
} from '../../../config/taskbar';
import { handleWindowPriority } from '../../utils/WindowPriority/WindowPriority';
import {
	getMinimizedWindows,
	getOpenWindows,
	routeToWindow,
} from '../../../lib/windowUtils';
import { openExternalUrl } from '../../../config/taskbar';
import TaskbarButton from './TaskbarButton';
import styles from './Footer.module.css';
import WindowsMenu from './WindowsMenu';

type Props = {
	winMenu: boolean;
	handleWinMenu: () => void;
};

function FooterTaskbar({ winMenu, handleWinMenu }: Props) {
	const router = useRouter();
	const { minimizedState, firefoxOpenState, windowPriorityState } =
		useContext(Context);
	const [minimized, setMinimized] = minimizedState;
	const [firefoxOpen, setFirefoxOpen] = firefoxOpenState;
	const [windowPriority, setWindowPriority] = windowPriorityState;

	const firefoxOverlay = firefoxOpen ? ['firefox'] : [];
	const openWindows = getOpenWindows(
		router.asPath,
		minimized,
		firefoxOverlay
	);
	const minimizedWindows = getMinimizedWindows(minimized);

	const focusWindow = async (windowName: string) => {
		const newPriority = await handleWindowPriority({
			windowName,
			windowPriority,
		});
		if (newPriority) setWindowPriority(newPriority);
	};

	const handleRestoreWindow = (windowName: string) => {
		setMinimized({ ...minimized, [windowName]: false });

		if (windowName === 'firefox') {
			setFirefoxOpen(true);
			void focusWindow('firefox');
			return;
		}

		if (routeToWindow(router.asPath) !== windowName) {
			const href = windowTaskbarMeta[windowName]?.href;
			if (href) router.push(href);
		}
	};

	const handleFirefoxClick = async () => {
		if (!firefoxOpen) {
			setFirefoxOpen(true);
			setMinimized({ ...minimized, firefox: false });
			await focusWindow('firefox');
			return;
		}

		if (minimized.firefox) {
			setMinimized({ ...minimized, firefox: false });
			await focusWindow('firefox');
			return;
		}

		await focusWindow('firefox');
	};

	const isFirefoxActive =
		firefoxOpen && !minimized.firefox && openWindows.includes('firefox');
	const isFirefoxMinimized = firefoxOpen && minimized.firefox;

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
				{openWindows.map((windowName) => {
					const meta = windowTaskbarMeta[windowName];
					if (!meta) return null;

					if (windowName === 'firefox') {
						return (
							<TaskbarButton
								key="open-firefox"
								label={meta.title}
								icon={meta.icon}
								isActive
								onClick={() => void focusWindow('firefox')}
							/>
						);
					}

					return (
						<TaskbarButton
							key={`open-${windowName}`}
							label={meta.title}
							icon={meta.icon}
							href={meta.href}
							isActive
						/>
					);
				})}
				{minimizedWindows
					.filter((windowName) => !openWindows.includes(windowName))
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
				{!isFirefoxActive && !isFirefoxMinimized && (
					<TaskbarButton
						label="Firefox"
						icon="/icons/firefox/firefox.png"
						onClick={() => void handleFirefoxClick()}
					/>
				)}
				{pinnedApps.map((app) => (
					<TaskbarButton
						key={app.id}
						label={app.label}
						icon={app.icon}
						external
						onClick={() => openExternalUrl(app.href)}
					/>
				))}
			</section>
			<WindowsMenu winMenu={winMenu} handleWinMenu={handleWinMenu} />
		</>
	);
}

export default FooterTaskbar;
