import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import PageHead from '../../components/utils/PageHead/PageHead';

function Downloads() {
	return (
		<>
			<PageHead
				title="Downloads"
				description="Downloads folder on my Windows desktop portfolio."
				path="/explorer/downloads"
			/>
			<div style={{ height: '100%' }}>
				<FileExplorer folder="Downloads" topNav={true} icon="downloads" />
				<Icons />
			</div>
		</>
	);
}

export default Downloads;
