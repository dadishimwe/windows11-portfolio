import { useEffect, useState } from 'react';
import { AiOutlineWifi } from 'react-icons/ai';
import { FiVolume2 } from 'react-icons/fi';
import FooterTaskbar from './FooterTaskbar';
import styles from './Footer.module.css';

function Footer() {
	const [winMenu, setWinMenu] = useState(false);
	const [hourStr, setHourStr] = useState('00:00 PM');
	const [dateStr, setDateStr] = useState('1/1/1970');

	const handleWinMenu = () => {
		setWinMenu(!winMenu);
	};

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

	return (
		<div className={styles.footerWrapper}>
			<FooterTaskbar winMenu={winMenu} handleWinMenu={handleWinMenu} />
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
	);
}

export default Footer;
