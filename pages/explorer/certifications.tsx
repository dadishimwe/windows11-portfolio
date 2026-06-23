import Image from 'next/image';
import Link from 'next/link';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import { certifications } from '../../config/certifications';
import styles from '../../styles/utils/List.module.css';

function Certifications() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{certifications.map((cert) => {
				const row = (
					<div className={styles.listItem}>
						<div className={styles.listItemName}>
							<Image
								src="/icons/documents/documents_small.png"
								alt="icon"
								width={16}
								height={16}
							/>
							<p>{cert.name}</p>
						</div>
						<p className={styles.listItemDateModified}>
							{cert.dateModified}
						</p>
						<p className={styles.listItemType}>Certificate</p>
						<p className={styles.listItemSize}>{cert.issuer}</p>
					</div>
				);

				if (!cert.url) {
					return <div key={cert.id}>{row}</div>;
				}

				return (
					<Link key={cert.id} href={cert.url} passHref>
						<a target="_blank" rel="noopener noreferrer">
							{row}
						</a>
					</Link>
				);
			})}
		</div>
	);

	return (
		<ExplorerPage
			path="/explorer/certifications"
			head={{
				title: 'Certifications',
				description:
					'Fortinet, Peplink, and MIT Emerging Talent certifications.',
				path: '/explorer/certifications',
			}}
			content={content}
		/>
	);
}

export default Certifications;
