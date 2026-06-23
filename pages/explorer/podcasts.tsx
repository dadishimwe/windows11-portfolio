import ExplorerPage from '../../components/explorer/ExplorerPage';

function Podcasts() {
	return (
		<ExplorerPage
			path="/explorer/podcasts"
			head={{
				title: 'Podcasts',
				description: 'Podcasts and tech audio I enjoy.',
				path: '/explorer/podcasts',
			}}
		/>
	);
}

export default Podcasts;
