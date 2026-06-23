import Image from 'next/image';
import { useContext, useState } from 'react';
import { FIREFOX_HOME_URL } from '../../../config/taskbar';
import { Context } from '../../../context/ContextProvider';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Firefox.module.css';

const DISPLAY_URL = 'www.dadishimwe.com';

function Firefox() {
	const { firefoxOpenState } = useContext(Context);
	const [firefoxOpen, setFirefoxOpen] = firefoxOpenState;
	const [frameBlocked, setFrameBlocked] = useState(false);

	if (!firefoxOpen) return null;

	return (
		<DraggableWindow
			windowName="firefox"
			topTitle={`Mozilla Firefox — ${DISPLAY_URL}`}
			topIcon={
				<Image
					src="/icons/firefox/firefox.png"
					alt="Firefox"
					width={20}
					height={20}
				/>
			}
			onClose={() => setFirefoxOpen(false)}
		>
			<div className={`${styles.browserToolbar} not_draggable`}>
				<span className={styles.addressBar}>{DISPLAY_URL}</span>
			</div>
			{frameBlocked ? (
				<div className={styles.fallback}>
					<p>
						dadishimwe.com cannot be embedded here. Open it in a
						new tab instead.
					</p>
					<a
						href={FIREFOX_HOME_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						Open dadishimwe.com
					</a>
				</div>
			) : (
				<iframe
					className={styles.browserFrame}
					src={FIREFOX_HOME_URL}
					title="dadishimwe.com"
					onError={() => setFrameBlocked(true)}
				/>
			)}
		</DraggableWindow>
	);
}

export default Firefox;
