import { ReactNode } from 'react';
import styles from './ExplorerEmbedShell.module.css';

type Props = {
	children?: ReactNode;
};

function ExplorerEmbedShell({ children }: Props) {
	return (
		<div className={styles.shell}>
			{children ?? (
				<p className={styles.empty}>This folder is empty.</p>
			)}
		</div>
	);
}

export default ExplorerEmbedShell;
