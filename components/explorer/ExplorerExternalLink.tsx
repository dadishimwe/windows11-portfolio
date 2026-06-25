import { KeyboardEvent, ReactNode } from 'react';
import { openExternalUrl } from '../../config/taskbar';

type Props = {
	href: string;
	children: ReactNode;
};

function ExplorerExternalLink({ href, children }: Props) {
	const open = () => openExternalUrl(href);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open();
		}
	};

	return (
		<div
			role="link"
			tabIndex={0}
			onClick={open}
			onKeyDown={handleKeyDown}
		>
			{children}
		</div>
	);
}

export default ExplorerExternalLink;
