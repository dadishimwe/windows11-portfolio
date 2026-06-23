import Footer from '../../modules/Footer/Footer';
import DesktopWindows from '../../DesktopWindows/DesktopWindows';
import useFirstVisitFirefox from '../../../hooks/useFirstVisitFirefox';
import styles from './Layout.module.css';

function Layout({ children }: { children: React.ReactNode }) {
	useFirstVisitFirefox();

	return (
		<>
			<div className={`${styles.container} layout`}>{children}</div>
			<DesktopWindows />
			<Footer />
		</>
	);
}

export default Layout;
