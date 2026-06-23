import Image from 'next/image';
import Link from 'next/link';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { site } from '../../config/site';
import styles from '../../styles/utils/List.module.css';

function Links() {
	const content = () => {
		return (
			<div className={styles.listItemContainer}>
				<Link href={site.linkedin} passHref>
					<a target="_blank" rel="noopener noreferrer">
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/svg/linkedin.svg"
									alt="icon"
									width={18}
									height={18}
								/>
								<p>LinkedIn</p>
							</div>
							<p className={styles.listItemDateModified}>
								23/06/2026 12:00
							</p>
							<p className={styles.listItemType}>Shortcut</p>
							<p className={styles.listItemSize}>2 KB</p>
						</div>
					</a>
				</Link>
				<Link href={site.github} passHref>
					<a target="_blank" rel="noopener noreferrer">
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/svg/github.svg"
									alt="icon"
									width={18}
									height={18}
								/>
								<p>GitHub</p>
							</div>
							<p className={styles.listItemDateModified}>
								23/06/2026 12:00
							</p>
							<p className={styles.listItemType}>Shortcut</p>
							<p className={styles.listItemSize}>2 KB</p>
						</div>
					</a>
				</Link>
				<Link href={site.instagram} passHref>
					<a target="_blank" rel="noopener noreferrer">
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/svg/instagram.svg"
									alt="icon"
									width={18}
									height={18}
								/>
								<p>Instagram</p>
							</div>
							<p className={styles.listItemDateModified}>
								23/06/2026 12:00
							</p>
							<p className={styles.listItemType}>Shortcut</p>
							<p className={styles.listItemSize}>2 KB</p>
						</div>
					</a>
				</Link>
				<Link href={`mailto:${site.email}`} passHref>
					<a rel="noopener noreferrer">
						<div className={styles.listItem}>
							<div className={styles.listItemName}>
								<Image
									src="/svg/email.svg"
									alt="icon"
									width={18}
									height={18}
								/>
								<p>Email</p>
							</div>
							<p className={styles.listItemDateModified}>
								23/06/2026 12:00
							</p>
							<p className={styles.listItemType}>Shortcut</p>
							<p className={styles.listItemSize}>1 KB</p>
						</div>
					</a>
				</Link>
			</div>
		);
	};

	return (
		<ExplorerPage
			path="/explorer/links"
			head={{
				title: 'Links',
				description:
					'LinkedIn, GitHub, Instagram, and email — all in one place.',
				path: '/explorer/links',
			}}
			content={content}
		/>
	);
}

export default Links;
