import ExplorerPage from '../../components/explorer/ExplorerPage';
import styles from '../../components/explorer/ExplorerEmbedShell.module.css';

function RecycleBin() {
	const content = () => (
		<p className={styles.empty}>
			The Recycle Bin is empty. Items you delete from the desktop are a
			visual easter egg — nothing is stored here.
		</p>
	);

	return (
		<ExplorerPage
			path="/explorer/recycle-bin"
			head={{
				title: 'Recycle Bin',
				description: 'Recycle Bin on my Windows desktop portfolio.',
				path: '/explorer/recycle-bin',
			}}
			content={content}
		/>
	);
}

export default RecycleBin;
