import Footer from '../../modules/Footer/Footer';
import DesktopWindows from '../../DesktopWindows/DesktopWindows';
import useAutoOpenFirefox from '../../../hooks/useAutoOpenFirefox';
import styles from './Layout.module.css';

function Layout({ children }: { children: React.ReactNode }) {
	useAutoOpenFirefox();

	return (
		<>
			<div className={`${styles.container} layout`}>{children}</div>
			<DesktopWindows />
			<Footer />
		</>
	);
}

export default Layout;
