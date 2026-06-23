import Head from 'next/head';
import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';

function Podcasts() {
	return (
		<>
			<Head>
				<title>dadishimwe - Podcasts</title>
				<meta
					name="description"
					content="Podcasts and tech audio I enjoy."
				/>
				<meta property="og:title" content="Dadi Ishimwe - Podcasts" />
			</Head>
			<div style={{ height: '100%' }}>
				<FileExplorer
					icon="folder"
					folder="Podcasts I listen to"
					topNav={true}
				/>
				<Icons />
			</div>
		</>
	);
}

export default Podcasts;
