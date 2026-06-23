import ExplorerPage from '../../components/explorer/ExplorerPage';

function Downloads() {
	return (
		<ExplorerPage
			path="/explorer/downloads"
			head={{
				title: 'Downloads',
				description: 'Downloads folder on my Windows desktop portfolio.',
				path: '/explorer/downloads',
			}}
		/>
	);
}

export default Downloads;
