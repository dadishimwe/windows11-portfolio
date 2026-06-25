import Image from 'next/image';
import { ToolShortcut } from '../../config/tools';
import styles from '../../styles/utils/List.module.css';
import EmbedAppLink from './EmbedAppLink';
import ExplorerExternalLink from './ExplorerExternalLink';

type Props = {
	item: Pick<
		ToolShortcut,
		'name' | 'icon' | 'href' | 'dateModified' | 'type' | 'size' | 'windowName'
	>;
};

function ExplorerShortcutRow({ item }: Props) {
	const row = (
		<div className={styles.listItem}>
			<div className={styles.listItemName}>
				<Image src={item.icon} alt="" width={16} height={16} />
				<p>{item.name}</p>
			</div>
			<p className={styles.listItemDateModified}>{item.dateModified}</p>
			<p className={styles.listItemType}>{item.type}</p>
			<p className={styles.listItemSize}>{item.size}</p>
		</div>
	);

	if (item.windowName) {
		return (
			<EmbedAppLink windowName={item.windowName} href={item.href}>
				{row}
			</EmbedAppLink>
		);
	}

	return <ExplorerExternalLink href={item.href}>{row}</ExplorerExternalLink>;
}

export default ExplorerShortcutRow;
