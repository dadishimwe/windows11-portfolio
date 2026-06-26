import type { CSSProperties } from 'react';
import '@vscode/codicons/dist/codicon.css';
import styles from './CodeStudio.module.css';

type Props = {
	name: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	style?: CSSProperties;
};

export default function Codicon({ name, className, size = 'sm', style }: Props) {
	const sizeClass =
		size === 'lg' ? styles.codiconLg : size === 'md' ? styles.codiconMd : '';

	return (
		<span
			className={`codicon codicon-${name} ${sizeClass} ${className ?? ''}`}
			style={style}
			aria-hidden
		/>
	);
}
