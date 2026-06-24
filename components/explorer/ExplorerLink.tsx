import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type Props = Omit<LinkProps, 'href'> & {
	href: string;
	children: ReactNode;
};

function ExplorerLink({ href, children, ...rest }: Props) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';
	const basePath = href.split('?')[0];
	const resolvedHref = isEmbed ? `${basePath}?embed=true` : href;

	return (
		<Link href={resolvedHref} {...rest}>
			{children}
		</Link>
	);
}

export default ExplorerLink;
