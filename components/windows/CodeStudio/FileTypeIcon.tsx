import Codicon from './Codicon';
import styles from './CodeStudio.module.css';

type Props = {
	fileName: string;
	size?: number;
};

const COLORS: Record<string, string> = {
	py: '#4ec9b0',
	c: '#569cd6',
	h: '#569cd6',
	md: '#519aba',
	json: '#dcdcaa',
	txt: '#9cdcfe',
};

function iconName(fileName: string): string {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
	if (ext === 'md') return 'markdown';
	if (ext === 'json') return 'json';
	if (ext === 'py' || ext === 'c' || ext === 'h') return 'file-code';
	return 'file';
}

export default function FileTypeIcon({ fileName, size = 16 }: Props) {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
	const color = COLORS[ext];

	return (
		<Codicon
			name={iconName(fileName)}
			className={styles.fileTypeIcon}
			style={{
				color,
				fontSize: size,
			}}
		/>
	);
}
