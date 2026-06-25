import { useEffect, useRef, useState } from 'react';
import { AiOutlineWifi } from 'react-icons/ai';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { MdWifiOff } from 'react-icons/md';
import { openExternalUrl } from '../../../config/taskbar';
import { site } from '../../../config/site';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useVolume } from '../../../hooks/useVolume';
import { WIFI_SSID } from '../../../lib/systemTray';
import styles from './SystemTray.module.css';

type Panel = 'wifi' | 'volume' | null;

function SystemTray() {
	const [openPanel, setOpenPanel] = useState<Panel>(null);
	const trayRef = useRef<HTMLDivElement>(null);
	const isOnline = useOnlineStatus();
	const { volume, muted, setVolume, toggleMute, effectiveVolume } =
		useVolume();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				trayRef.current &&
				!trayRef.current.contains(event.target as Node)
			) {
				setOpenPanel(null);
			}
		};

		if (openPanel) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openPanel]);

	const togglePanel = (panel: Panel) => {
		setOpenPanel((current) => (current === panel ? null : panel));
	};

	const signalStrength = isOnline ? 4 : 0;

	return (
		<div className={styles.tray} ref={trayRef}>
			<button
				type="button"
				className={`${styles.trayButton} ${
					openPanel === 'wifi' ? styles.trayButtonActive : ''
				} ${!isOnline ? styles.trayButtonOffline : ''}`}
				aria-label={
					isOnline
						? `Wi-Fi connected to ${WIFI_SSID}`
						: 'Wi-Fi offline'
				}
				aria-expanded={openPanel === 'wifi'}
				onClick={() => togglePanel('wifi')}
			>
				{isOnline ? <AiOutlineWifi /> : <MdWifiOff />}
			</button>

			{openPanel === 'wifi' && (
				<div className={styles.flyout} role="dialog" aria-label="Wi-Fi">
					<p className={styles.flyoutTitle}>Wi-Fi</p>
					<div className={styles.wifiHeader}>
						<div
							className={`${styles.wifiIcon} ${
								!isOnline ? styles.wifiIconOffline : ''
							}`}
						>
							{isOnline ? <AiOutlineWifi /> : <MdWifiOff />}
						</div>
						<div>
							<p className={styles.wifiSsid}>{WIFI_SSID}</p>
							<p className={styles.wifiStatus}>
								{isOnline
									? 'Connected, secured'
									: 'No internet connection'}
							</p>
							<div className={styles.signalBars} aria-hidden>
								{[1, 2, 3, 4].map((bar) => (
									<div
										key={bar}
										className={`${styles.signalBar} ${
											bar <= signalStrength
												? styles.signalBarActive
												: ''
										}`}
									/>
								))}
							</div>
						</div>
					</div>
					<button
						type="button"
						className={styles.wifiLink}
						onClick={() => openExternalUrl(site.portfolioUrl)}
					>
						Open portfolio site
					</button>
				</div>
			)}

			<button
				type="button"
				className={`${styles.trayButton} ${
					openPanel === 'volume' ? styles.trayButtonActive : ''
				} ${muted ? styles.trayButtonMuted : ''}`}
				aria-label={
					muted ? 'Volume muted' : `Volume ${effectiveVolume} percent`
				}
				aria-expanded={openPanel === 'volume'}
				onClick={() => togglePanel('volume')}
			>
				{muted || effectiveVolume === 0 ? (
					<FiVolumeX />
				) : (
					<FiVolume2 />
				)}
			</button>

			{openPanel === 'volume' && (
				<div
					className={styles.flyout}
					role="dialog"
					aria-label="Volume"
				>
					<p className={styles.flyoutTitle}>Volume</p>
					<div className={styles.volumeRow}>
						<span className={styles.volumeIcon} aria-hidden>
							{muted || effectiveVolume === 0 ? (
								<FiVolumeX />
							) : (
								<FiVolume2 />
							)}
						</span>
						<input
							type="range"
							min={0}
							max={100}
							value={muted ? 0 : volume}
							className={styles.volumeSlider}
							aria-label="Volume level"
							onChange={(e) =>
								setVolume(Number(e.target.value))
							}
						/>
						<span className={styles.volumeValue}>
							{muted ? 0 : volume}%
						</span>
					</div>
					<div className={styles.muteRow}>
						<span className={styles.muteLabel}>Mute</span>
						<button
							type="button"
							className={styles.muteToggle}
							onClick={toggleMute}
						>
							{muted ? 'Unmute' : 'Mute'}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default SystemTray;
