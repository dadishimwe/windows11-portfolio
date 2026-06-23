import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AiOutlineWifi } from 'react-icons/ai';
import { FiVolume2 } from 'react-icons/fi';
import { Context } from '../../../context/ContextProvider';
import { windowTitles } from '../../../lib/windowUtils';
import { ErrorType } from '../../../typings';
import Error from '../../windows/Error/Error';
import styles from './Footer.module.css';
import WindowsMenu from './WindowsMenu';

function Footer() {
	const [winMenu, setWinMenu] = useState(false);
	const [errors, setError] = useState([] as ErrorType[]);
	const { minimizedState } = useContext(Context);
	const [minimized, setMinimized] = minimizedState;

	const handleError = (err: string) => {
		setError([...errors, { error: err, index: errors.length }]);
	};

	const handleWinMenu = () => {
		setWinMenu(!winMenu);
	};

	const handleRestoreWindow = (windowName: string) => {
		setMinimized({ ...minimized, [windowName]: false });
	};

	const [hourStr, setHourStr] = useState('00:00 PM');
	const [dateStr, setDateStr] = useState('1/1/1970');

	useEffect(() => {
		let isMounted = true;

		const updateClock = () => {
			if (typeof navigator === 'undefined' || !isMounted) return;

			setHourStr(
				new Date().toLocaleTimeString(navigator.language, {
					hour: '2-digit',
					minute: '2-digit',
				})
			);
			setDateStr(new Date().toLocaleDateString(navigator.language));
		};

		updateClock();
		const intervalId = window.setInterval(updateClock, 1000);

		return () => {
			isMounted = false;
			window.clearInterval(intervalId);
		};
	}, []);

	const minimizedWindows = Object.entries(minimized).filter(
		([, isMinimized]) => isMinimized
	);

	return (
		<>
			{errors &&
				errors.map((err) => {
					return (
						<Error
							key={err.index}
							error={err.error}
							errors={errors}
							setError={setError}
							index={err.index}
						/>
					);
				})}
			<div className={styles.container}>
				<section className={styles.iconContainer}>
					<div
						className={`${styles.icon} windowsIcon`}
						onClick={() => handleWinMenu()}
					>
						<Image
							src={'/icons/windows/windows.png'}
							width={25}
							height={25}
							alt="logo"
							className="windowsIcon"
						/>
					</div>
					<Link href="/explorer/quick-access" passHref>
						<div className={styles.icon}>
							<Image
								src={'/icons/explorer/explorer.png'}
								width={25}
								height={25}
								alt="logo"
							/>
						</div>
					</Link>
					{minimizedWindows.map(([windowName]) => (
						<div
							key={windowName}
							className={`${styles.icon} ${styles.minimizedWindow}`}
							onClick={() => handleRestoreWindow(windowName)}
							title={`Restore ${windowTitles[windowName] || windowName}`}
						>
							<p>{windowTitles[windowName] || windowName}</p>
						</div>
					))}
					<div
						className={styles.icon}
						onClick={() => handleError('Firefox')}
					>
						<Image
							src={'/icons/firefox/firefox.png'}
							width={25}
							height={25}
							alt="logo"
						/>
					</div>
					<div
						className={styles.icon}
						onClick={() => handleError('Spotify')}
					>
						<Image
							src={'/icons/spotify/spotify.png'}
							width={25}
							height={25}
							alt="logo"
						/>
					</div>
					<div
						className={styles.icon}
						onClick={() => handleError('Steam')}
					>
						<Image
							src={'/icons/steam/steam.png'}
							width={25}
							height={25}
							alt="logo"
						/>
					</div>
					<div
						className={styles.icon}
						onClick={() => handleError('Discord')}
					>
						<Image
							src={'/icons/discord/discord.png'}
							width={25}
							height={25}
							alt="logo"
						/>
					</div>
					<div
						className={styles.icon}
						onClick={() =>
							handleError('Visual Studio Code - Insiders')
						}
					>
						<Image
							src={'/icons/vscode/vscode.png'}
							width={25}
							height={25}
							alt="logo"
						/>
					</div>
					<Link href="/terminal" passHref>
						<div className={styles.icon}>
							<Image
								src={'/icons/terminal/terminal.png'}
								width={25}
								height={25}
								alt="logo"
							/>
						</div>
					</Link>
				</section>
				<section className={styles.toolbarContainer}>
					<div className={styles.language}>
						<p>ENG</p>
					</div>
					<div className={styles.icon}>
						<AiOutlineWifi />
						<FiVolume2 />
					</div>
					<div className={styles.dateIcons}>
						<p>{hourStr}</p>
						<p>{dateStr}</p>
					</div>
				</section>
			</div>
			<WindowsMenu winMenu={winMenu} handleWinMenu={handleWinMenu} />
		</>
	);
}

export default Footer;
