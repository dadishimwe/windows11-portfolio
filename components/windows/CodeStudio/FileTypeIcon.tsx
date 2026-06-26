import {
	VscFile,
	VscMarkdown,
	VscJson,
	VscCode,
	VscSettingsGear,
} from 'react-icons/vsc';
import styles from './CodeStudio.module.css';

type Props = {
	fileName: string;
	size?: number;
};

export default function FileTypeIcon({ fileName, size = 16 }: Props) {
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

	switch (ext) {
		case 'py':
			return (
				<VscCode
					className={styles.fileTypeIcon}
					size={size}
					style={{ color: '#4ec9b0' }}
					aria-hidden
				/>
			);
		case 'c':
		case 'h':
			return (
				<VscCode
					className={styles.fileTypeIcon}
					size={size}
					style={{ color: '#569cd6' }}
					aria-hidden
				/>
			);
		case 'md':
			return (
				<VscMarkdown
					className={styles.fileTypeIcon}
					size={size}
					style={{ color: '#519aba' }}
					aria-hidden
				/>
			);
		case 'json':
		case 'txt':
			return ext === 'json' ? (
				<VscJson
					className={styles.fileTypeIcon}
					size={size}
					style={{ color: '#dcdcaa' }}
					aria-hidden
				/>
			) : (
				<VscSettingsGear
					className={styles.fileTypeIcon}
					size={size}
					style={{ color: '#9cdcfe' }}
					aria-hidden
				/>
			);
		default:
			return (
				<VscFile className={styles.fileTypeIcon} size={size} aria-hidden />
			);
	}
}
