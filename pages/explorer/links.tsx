import Image from 'next/image';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import ExplorerExternalLink from '../../components/explorer/ExplorerExternalLink';
import { site } from '../../config/site';
import { EXPLORER_ITEM_DATE } from '../../lib/explorerList';
import styles from '../../styles/utils/List.module.css';

type LinkItem = {
	label: string;
	icon: string;
	href: string;
	size: string;
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
		label: 'Email',
		icon: '/svg/email.svg',
		href: `mailto:${site.email}`,
		size: '1 KB',
	},
];

function Links() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{linkItems.map((item) => (
				<ExplorerExternalLink key={item.label} href={item.href}>
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src={item.icon}
								alt=""
								width={18}
								height={18}
							/>
							<p>{item.label}</p>
						</div>
						<p className={styles.listItemDateModified}>
							{EXPLORER_ITEM_DATE}
						</p>
						<p className={styles.listItemType}>Shortcut</p>
						<p className={styles.listItemSize}>{item.size}</p>
					</div>
				</ExplorerExternalLink>
			))}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/links"
			head={{
				title: 'Links',
				description:
					'Portfolio, blog, Credly, LinkedIn, GitHub, Instagram, and email.',
				path: '/explorer/links',
			}}
			content={content}
		/>
	);
}

export default Links;
