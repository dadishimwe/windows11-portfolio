import Footer from '../../modules/Footer/Footer';
import DesktopWindows from '../../DesktopWindows/DesktopWindows';
import MobileLayout from '../MobileLayout/MobileLayout';
import useAutoOpenFirefox from '../../../hooks/useAutoOpenFirefox';
import {
	MOBILE_BREAKPOINT,
	useMediaQuery,
} from '../../../hooks/useMediaQuery';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';

function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';
	const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
	useAutoOpenFirefox(isMobile);

	if (isEmbed) {
		return <div className={styles.embedShell}>{children}</div>;
	}

	if (isMobile) {
		return (
			<>
				<div hidden aria-hidden>
					{children}
				</div>
				<MobileLayout />
			</>
		);
	}

	return (
		<>
			<div className={`${styles.container} layout`}>{children}</div>
			<DesktopWindows />
			<Footer />
		</>
	);
}

export default Layout;
