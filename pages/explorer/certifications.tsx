import Image from 'next/image';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import {
	certifications,
	getCertificationHref,
} from '../../config/certifications';
import styles from '../../styles/utils/Certifications.module.css';
import { FiExternalLink } from 'react-icons/fi';

function Certifications() {
	const content = () => (
		<div className={styles.badgeGrid}>
			{certifications.map((cert) => {
				const href = getCertificationHref(cert);
				const card = (
					<div className={styles.badgeCard}>
						<div className={styles.badgeImageWrap}>
							{cert.badgeImageUrl ? (
								<Image
									src={cert.badgeImageUrl}
									alt={`${cert.name} badge`}
									width={96}
									height={96}
									className={styles.badgeImage}
								/>
							) : (
								<Image
									src="/icons/documents/documents.png"
									alt=""
									width={64}
									height={64}
								/>
							)}
						</div>
						<div className={styles.badgeInfo}>
							<p className={styles.badgeName}>{cert.name}</p>
							<p className={styles.badgeMeta}>
								{cert.issuer} · {cert.dateModified}
							</p>
							{href && (
								<span className={styles.badgeLinkHint}>
									View on Credly{' '}
									<FiExternalLink aria-hidden />
								</span>
							)}
						</div>
					</div>
				);

				if (!href) {
					return (
						<div key={cert.id} className={styles.badgeItem}>
							{card}
						</div>
					);
				}

				return (
					<a
						key={cert.id}
						className={styles.badgeItem}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
					>
						{card}
					</a>
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
					'Fortinet NSE, FCF, FCA, and FortiGate Operator certifications on Credly.',
				path: '/explorer/certifications',
			}}
			content={content}
		/>
	);
}

export default Certifications;
