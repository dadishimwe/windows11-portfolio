import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Context } from '../../../context/ContextProvider';
import {
	openExternalUrl,
	pinnedApps,
	windowTaskbarMeta,
} from '../../../config/taskbar';
import {
	getMinimizedWindows,
	getOpenWindows,
	routeToWindow,
} from '../../../lib/windowUtils';
import TaskbarButton from './TaskbarButton';
import styles from './Footer.module.css';
import WindowsMenu from './WindowsMenu';

type Props = {
	winMenu: boolean;
	handleWinMenu: () => void;
};

function FooterTaskbar({ winMenu, handleWinMenu }: Props) {
	const router = useRouter();
	const { minimizedState } = useContext(Context);
	const [minimized, setMinimized] = minimizedState;

	const openWindows = getOpenWindows(router.asPath, minimized);
	const minimizedWindows = getMinimizedWindows(minimized);

	const handleRestoreWindow = (windowName: string) => {
		setMinimized({ ...minimized, [windowName]: false });

		if (routeToWindow(router.asPath) !== windowName) {
			const href = windowTaskbarMeta[windowName]?.href;
			if (href) router.push(href);
		}
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
				{openWindows.map((windowName) => {
					const meta = windowTaskbarMeta[windowName];
					if (!meta) return null;

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
				{minimizedWindows.map((windowName) => {
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
