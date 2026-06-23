import Image from 'next/image';
import Link from 'next/link';
import styles from './TaskbarButton.module.css';

type Props = {
	label: string;
	icon: string;
	isActive?: boolean;
	isMinimized?: boolean;
	onClick?: () => void;
	href?: string;
	external?: boolean;
};

function TaskbarButton({
	label,
	icon,
	isActive = false,
	isMinimized = false,
	onClick,
	href,
	external = false,
}: Props) {
	const className = [
		styles.button,
		isActive ? styles.active : '',
		isMinimized ? styles.minimized : '',
	]
		.filter(Boolean)
		.join(' ');

	const content = (
		<>
			<span className={styles.tooltip}>{label}</span>
			<Image src={icon} width={25} height={25} alt={label} />
		</>
	);

	if (href && !external) {
		return (
			<Link href={href} passHref>
				<div className={className} onClick={onClick}>
					{content}
				</div>
			</Link>
		);
	}

	return (
		<div
			className={className}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick?.();
				}
			}}
		>
			{content}
		</div>
	);
}

export default TaskbarButton;
