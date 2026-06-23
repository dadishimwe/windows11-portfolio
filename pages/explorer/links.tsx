import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Icons from '../../components/modules/Icons/Icons';
import FileExplorer from '../../components/windows/FileExplorer/FileExplorer';
import styles from '../../styles/utils/List.module.css';

function Links() {
	const content = () => {
		return (
			<div className={styles.listItemContainer}>
				<Link
					href="https://www.linkedin.com/in/dadi-ishimwe-473a50275"
					passHref
				>
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
				<Link href="https://github.com/dadishimwe" passHref>
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
				<Link
					href="https://www.instagram.com/dadishimwe?igsh=dWpnMHN1b2VxcW9n"
					passHref
				>
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
				<Link href="mailto:dadi29skl@gmail.com" passHref>
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
		<>
			<Head>
				<title>dadishimwe - Links</title>
				<meta
					name="description"
					content="LinkedIn, GitHub, Instagram, and email — all in one place."
				/>
				<meta property="og:title" content="Dadi Ishimwe - Links" />
				<meta
					property="og:description"
					content="LinkedIn, GitHub, Instagram, and email — all in one place."
				/>
			</Head>
			<div style={{ height: '100%' }}>
				<FileExplorer
					icon="folder"
					folder="Links"
					topNav={true}
					component={content()}
				/>
				<Icons />
			</div>
		</>
	);
}

export default Links;
