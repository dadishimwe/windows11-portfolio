import Head from 'next/head';
import Icons from '../components/modules/Icons/Icons';
import { default as TerminalComponent } from '../components/windows/Terminal/Terminal';
import { site } from '../config/site';

function Terminal() {
	return (
		<>
			<Head>
				<title>{site.username} - Terminal</title>
				<meta
					name="description"
					content="A place to execute commands and feel like being a hacker."
				/>
				<meta property="og:title" content={`${site.name} - Terminal`} />
				<meta
					property="og:description"
					content="A place to execute commands and feel like being a hacker."
				/>
			</Head>
			<div style={{ height: '100%' }}>
				<TerminalComponent />
				<Icons />
			</div>
		</>
	);
}

export default Terminal;
