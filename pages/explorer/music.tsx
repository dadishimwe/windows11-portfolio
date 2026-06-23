import ExplorerPage from '../../components/explorer/ExplorerPage';

function Music() {
	return (
		<ExplorerPage
			path="/explorer/music"
			head={{
				title: 'Music',
				description: 'Music folder on my Windows desktop portfolio.',
				path: '/explorer/music',
			}}
		/>
	);
}

export default Music;
