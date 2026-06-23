import Head from 'next/head';
import Icons from '../components/modules/Icons/Icons';

export default function Home() {
	return (
		<>
			<Head>
				<title>dadishimwe</title>
				<meta
					name="description"
					content="Dadi Ishimwe — network engineer and data scientist. Infrastructure, ML, and a Windows 11 desktop portfolio."
				/>
				<meta property="og:title" content="Dadi Ishimwe" />
				<meta
					property="og:description"
					content="Network engineer and data scientist passionate about infrastructure and machine learning."
				/>
			</Head>
			<div style={{ height: '100%' }}>
				<Icons />
			</div>
		</>
	);
}
