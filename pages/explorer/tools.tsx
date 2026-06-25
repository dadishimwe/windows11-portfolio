import ExplorerPage from '../../components/explorer/ExplorerPage';
import ExplorerShortcutRow from '../../components/explorer/ExplorerShortcutRow';
import { toolShortcuts } from '../../config/tools';
import styles from '../../styles/utils/List.module.css';

function Tools() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{toolShortcuts.map((item) => (
				<ExplorerShortcutRow key={item.id} item={item} />
			))}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/tools"
			head={{
				title: 'Tools',
				description:
					'The toolbox I use daily — networking, data science, and development tools.',
				path: '/explorer/tools',
			}}
			content={content}
		/>
	);
}

export default Tools;
