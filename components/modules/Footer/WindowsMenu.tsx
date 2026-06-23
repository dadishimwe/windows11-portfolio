import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
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
							/>
						</div>
					</div>
					<div className={styles.winMenuPinned}>
						<div className={styles.winMenuPinnedContainer}>
							<div className={styles.winMenuPinnedTop}>
								<h2>Pinned</h2>
								<div>
									<p>All apps</p>
									<IoIosArrowForward />
								</div>
							</div>
							<div className={styles.winMenuPinnedBottom}>
								<div
									role="button"
									tabIndex={0}
									onClick={() =>
										onOpenApp(
											'fileExplorer',
											'/explorer/quick-access'
										)
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											onOpenApp(
												'fileExplorer',
												'/explorer/quick-access'
											);
										}
									}}
								>
									<Image
										src="/icons/explorer/explorer.png"
										alt="File Explorer"
										width={30}
										height={30}
									/>
									<p>File Explorer</p>
								</div>
								<div
									role="button"
									tabIndex={0}
									onClick={() => onOpenApp('terminal')}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											onOpenApp('terminal');
										}
									}}
								>
									<Image
										src="/icons/terminal/terminal.png"
										alt="Terminal"
										width={30}
										height={30}
									/>
									<p>Terminal</p>
								</div>
								<div
									role="button"
									tabIndex={0}
									onClick={() =>
										onOpenApp(
											'fileExplorer',
											'/explorer/pictures'
										)
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											onOpenApp(
												'fileExplorer',
												'/explorer/pictures'
											);
										}
									}}
								>
									<Image
										src="/icons/pictures/pictures.png"
										alt="Photos"
										width={30}
										height={30}
									/>
									<p>Photos</p>
								</div>
								<div
									role="button"
									tabIndex={0}
									onClick={() => onOpenApp('firefox')}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											onOpenApp('firefox');
										}
									}}
								>
									<Image
										src="/icons/firefox/firefox.png"
										alt="Firefox"
										width={30}
										height={30}
									/>
									<p>Firefox</p>
								</div>
							</div>
						</div>
						<div className={styles.winMenuPinnedContainer}>
							<div className={styles.winMenuPinnedTop}>
								<h2>Connect</h2>
								<div>
									<p>Social</p>
									<IoIosArrowForward />
								</div>
							</div>
							<div className={styles.winMenuPinnedBottom}>
								{startMenuSocialApps.map((app) => (
									<div
										key={app.id}
										role="button"
										tabIndex={0}
										onClick={() => onOpenSocial(app.href)}
										onKeyDown={(e) => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												onOpenSocial(app.href);
											}
										}}
									>
										<Image
											src={app.icon}
											alt={app.label}
											width={30}
											height={30}
										/>
										<p>{app.label}</p>
									</div>
								))}
								<div
									role="button"
									tabIndex={0}
									onClick={() =>
										onOpenSocial(`mailto:${site.email}`)
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											onOpenSocial(
												`mailto:${site.email}`
											);
										}
									}}
								>
									<Image
										src="/svg/email.svg"
										alt="Email"
										width={30}
										height={30}
									/>
									<p>Email</p>
								</div>
							</div>
						</div>
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
					<div>
						<AiOutlinePoweroff />
					</div>
				</div>
				<div className={styles.winMenuBg} />
			</div>
		</motion.div>
	);
}

export default WindowsMenu;
