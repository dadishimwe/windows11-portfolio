import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import PageHead from '../../components/utils/PageHead/PageHead';

function Music() {
	return (
		<>
			<PageHead
				title="Music"
				description="Music folder on my Windows desktop portfolio."
				path="/explorer/music"
			/>
			<div style={{ height: '100%' }}>
				<FileExplorer folder="Music" topNav={true} icon="music" />
				<Icons />
			</div>
		</>
	);
}

export default Music;
