import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/layouts/Layout/Layout';
import ContextProvider from '../context/ContextProvider';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();

	useEffect(() => storePathValues, [router.asPath]);

	function storePathValues() {
		const storage = globalThis?.sessionStorage;
		if (!storage) return;
		storage.setItem('prevPath', globalThis.location.pathname);
	}

	useEffect(() => {
		const handleRouteChange = (url: string) => {
			(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
				'config',
				process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
				{
					page_path: url,
				}
			);
		};
		router.events.on('routeChangeComplete', handleRouteChange);
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange);
		};
	}, [router.events]);

	return (
		<ContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ContextProvider>
	);
}

export default MyApp;
