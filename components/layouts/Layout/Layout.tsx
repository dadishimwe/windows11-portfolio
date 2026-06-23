import Footer from '../../modules/Footer/Footer';
import Firefox from '../../windows/Firefox/Firefox';
import useFirstVisitFirefox from '../../../hooks/useFirstVisitFirefox';
import styles from './Layout.module.css';

function Layout({ children }: { children: React.ReactNode }) {
	useFirstVisitFirefox();

	return (
		<>
			<div className={`${styles.container} layout`}>{children}</div>
			<Firefox />
			<Footer />
		</>
	);
}

export default Layout;
