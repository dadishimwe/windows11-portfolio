import Link from 'next/link';
import { useRouter } from 'next/router';
import { KeyboardEvent, ReactNode } from 'react';
import { OpenWindows } from '../../config/openWindows';
import { postOpenWindowMessage } from '../../lib/embedBridge';

type Props = {
	windowName: keyof OpenWindows;
	href: string;
	explorerPath?: string;
	children: ReactNode;
};

function EmbedAppLink({ windowName, href, explorerPath, children }: Props) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	const open = () => postOpenWindowMessage(windowName, explorerPath);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			open();
		}
	};

	if (isEmbed) {
		return (
			<div role="link" tabIndex={0} onClick={open} onKeyDown={handleKeyDown}>
				{children}
			</div>
		);
	}

	return <Link href={href}>{children}</Link>;
}

export default EmbedAppLink;
