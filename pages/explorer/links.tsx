import Image from 'next/image';
import EmbedAppLink from '../../components/explorer/EmbedAppLink';
import ExplorerExternalLink from '../../components/explorer/ExplorerExternalLink';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { site } from '../../config/site';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import styles from '../../styles/utils/List.module.css';

type LinkItem = {
	label: string;
	icon: string;
	href: string;
	size: string;
	windowName?: 'mail';
};

const linkItems: LinkItem[] = [
	{
		label: 'Portfolio',
		icon: '/icons/windows/windows.png',
		href: site.portfolioUrl,
		size: '2 KB',
	},
	{
		label: 'Blog',
		icon: '/icons/firefox/firefox.png',
		href: site.blogUrl,
		size: '2 KB',
	},
	{
		label: 'Credly',
		icon: '/icons/documents/documents_small.png',
		href: site.credly,
		size: '2 KB',
	},
	{
		label: 'LinkedIn',
		icon: '/svg/linkedin.svg',
		href: site.linkedin,
		size: '2 KB',
	},
	{
		label: 'GitHub',
		icon: '/svg/github.svg',
		href: site.github,
		size: '2 KB',
	},
	{
		label: 'Instagram',
		icon: '/svg/instagram.svg',
		href: site.instagram,
		size: '2 KB',
	},
	{
		label: 'Mail',
		icon: '/svg/email.svg',
		href: '/mail',
		size: '2 KB',
		windowName: 'mail',
	},
];

function LinkRow({ item }: { item: LinkItem }) {
	const row = (
		<div className={styles.listItem}>
			<div className={styles.listItemName}>
				<Image src={item.icon} alt="" width={18} height={18} />
				<p>{item.label}</p>
			</div>
			<p className={styles.listItemDateModified}>{EXPLORER_ITEM_DATE}</p>
			<p className={styles.listItemType}>Shortcut</p>
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

function Links() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{linkItems.map((item) => (
				<LinkRow key={item.label} item={item} />
			))}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/links"
			head={{
				title: 'Links',
				description:
					'Portfolio, blog, Credly, socials, and Mail to contact Dadi.',
				path: '/explorer/links',
			}}
			content={content}
		/>
	);
}

export default Links;
