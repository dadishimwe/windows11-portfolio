import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import PageHead from '../../components/utils/PageHead/PageHead';

function Documents() {
	return (
		<>
			<PageHead
				title="Documents"
				description="Documents folder on my Windows desktop portfolio."
				path="/explorer/documents"
			/>
			<div style={{ height: '100%' }}>
				<FileExplorer folder="Documents" topNav={true} icon="documents" />
				<Icons />
			</div>
		</>
	);
}

export default Documents;
