import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import PageHead from '../../components/utils/PageHead/PageHead';

function Podcasts() {
	return (
		<>
			<PageHead
				title="Podcasts"
				description="Podcasts and tech audio I enjoy."
				path="/explorer/podcasts"
			/>
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
