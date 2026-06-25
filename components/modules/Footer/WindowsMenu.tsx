import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlinePoweroff } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import { VscSearch } from 'react-icons/vsc';
import { OpenWindows } from '../../../config/openWindows';
import { site } from '../../../config/site';
import { startMenuSocialApps } from '../../../config/taskbar';
import styles from './WindowsMenu.module.css';

type Props = {
	winMenu: boolean;
	handleWinMenu: () => void;
	onOpenApp: (
		windowName: keyof OpenWindows,
		explorerPath?: string
	) => void;
	onOpenSocial: (href: string) => void;
};

type PinnedApp = {
	id: string;
	label: string;
	keywords: string[];
	icon: string;
	onClick: () => void;
};

const slideVerticalAnimation = {
	open: {
		y: 0,
		transition: {
			duration: 0.3,
		},
		display: 'block',
	},
	close: {
		y: 550,
		transition: {
			duration: 0.3,
		},
		transitionEnd: {
			display: 'none',
		},
	},
};

function WindowsMenu({
	winMenu,
	handleWinMenu,
	onOpenApp,
	onOpenSocial,
}: Props) {
	const node = useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const pinnedApps: PinnedApp[] = useMemo(
		() => [
			{
				id: 'explorer',
				label: 'File Explorer',
				keywords: ['file', 'explorer', 'files', 'folders'],
				icon: '/icons/explorer/explorer.png',
				onClick: () =>
					onOpenApp('fileExplorer', '/explorer/quick-access'),
			},
			{
				id: 'terminal',
				label: 'Terminal',
				keywords: ['terminal', 'shell', 'cli', 'bash'],
				icon: '/icons/terminal/terminal.png',
				onClick: () => onOpenApp('terminal'),
			},
			{
				id: 'photos',
				label: 'Photos',
				keywords: ['photos', 'pictures', 'images', 'gallery'],
				icon: '/icons/pictures/pictures.png',
				onClick: () =>
					onOpenApp('fileExplorer', '/explorer/pictures'),
			},
			{
				id: 'firefox',
				label: 'Firefox',
				keywords: ['firefox', 'browser', 'web', 'blog'],
				icon: '/icons/firefox/firefox.png',
				onClick: () => onOpenApp('firefox'),
			},
			{
				id: 'mail',
				label: 'Mail',
				keywords: ['mail', 'email', 'contact', 'compose'],
				icon: '/svg/email.svg',
				onClick: () => onOpenApp('mail'),
			},
			{
				id: 'snake',
				label: 'Packet Snake',
				keywords: ['snake', 'game', 'play', 'packet', 'games'],
				icon: '/svg/snake.svg',
				onClick: () => onOpenApp('snake'),
			},
		],
		[onOpenApp]
	);

	const connectApps: PinnedApp[] = useMemo(
		() => [
			...startMenuSocialApps.map((app) => ({
				id: app.id,
				label: app.label,
				keywords: [app.id, app.label.toLowerCase()],
				icon: app.icon,
				onClick: () => onOpenSocial(app.href),
			})),
		],
		[onOpenSocial]
	);

	const matchesSearch = (label: string, keywords: string[]) => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return true;
		const haystack = [label, ...keywords].join(' ').toLowerCase();
		return haystack.includes(query);
	};

	const visiblePinned = pinnedApps.filter((app) =>
		matchesSearch(app.label, app.keywords)
	);
	const visibleConnect = connectApps.filter((app) =>
		matchesSearch(app.label, app.keywords)
	);
	const hasResults = visiblePinned.length > 0 || visibleConnect.length > 0;

	useEffect(() => {
		if (!winMenu) {
			setSearchQuery('');
		}
	}, [winMenu]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (null === node.current) return;
			if (
				node.current.contains(target) ||
				target.className.includes('windowsIcon')
			)
				return;
			if (winMenu) {
				handleWinMenu();
			}
		};

		if (winMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [handleWinMenu, winMenu]);

	const renderAppTile = (app: PinnedApp) => (
		<div
			key={app.id}
			role="button"
			tabIndex={0}
			onClick={app.onClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					app.onClick();
				}
			}}
		>
			<Image src={app.icon} alt={app.label} width={30} height={30} />
			<p>{app.label}</p>
		</div>
	);

	return (
		<motion.div
			initial="close"
			animate={winMenu ? 'open' : 'close'}
			variants={slideVerticalAnimation}
			className={styles.overflow}
		>
			<div className={styles.winMenu} ref={node}>
				<div className={styles.winMenuContainer}>
					<div className={styles.winMenuSearch}>
						<div className={styles.inputWithIcon}>
							<VscSearch />
							<input
								type="text"
								placeholder="Type here to search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								aria-label="Search apps"
							/>
						</div>
					</div>
					<div className={styles.winMenuPinned}>
						{searchQuery.trim() && !hasResults && (
							<p className={styles.searchEmpty}>
								No apps match &ldquo;{searchQuery.trim()}
								&rdquo;
							</p>
						)}
						{visiblePinned.length > 0 && (
							<div className={styles.winMenuPinnedContainer}>
								<div className={styles.winMenuPinnedTop}>
									<h2>Pinned</h2>
									<div className={styles.decorativeHeader}>
										<p>All apps</p>
										<IoIosArrowForward />
									</div>
								</div>
								<div className={styles.winMenuPinnedBottom}>
									{visiblePinned.map(renderAppTile)}
								</div>
							</div>
						)}
						{visibleConnect.length > 0 && (
							<div className={styles.winMenuPinnedContainer}>
								<div className={styles.winMenuPinnedTop}>
									<h2>Connect</h2>
									<div className={styles.decorativeHeader}>
										<p>Social</p>
										<IoIosArrowForward />
									</div>
								</div>
								<div className={styles.winMenuPinnedBottom}>
									{visibleConnect.map(renderAppTile)}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className={styles.winMenuFooter}>
					<div>
						<Image
							src="/images/programmer.png"
							alt=""
							width={30}
							height={30}
						/>
						<p>{site.username}</p>
					</div>
					<div
						className={styles.decorativeHeader}
						title="Sign out (decorative)"
					>
						<AiOutlinePoweroff />
					</div>
				</div>
				<div className={styles.winMenuBg} />
			</div>
		</motion.div>
	);
}

export default WindowsMenu;
