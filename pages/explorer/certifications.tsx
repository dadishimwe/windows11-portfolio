import Image from 'next/image';
import ExplorerPage from '../../components/explorer/ExplorerPage';
import {
	certifications,
	getCertificationHref,
} from '../../config/certifications';
import styles from '../../styles/utils/List.module.css';
import certStyles from '../../styles/utils/Certifications.module.css';
import { FiExternalLink } from 'react-icons/fi';

function Certifications() {
	const content = () => (
		<div className={styles.listItemContainer}>
			{certifications.map((cert) => {
				const href = getCertificationHref(cert);
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
							{href && (
								<FiExternalLink
									className={certStyles.externalIcon}
									aria-hidden
								/>
							)}
						</div>
						<p className={styles.listItemDateModified}>
							{cert.dateModified}
						</p>
						<p className={styles.listItemType}>
							{href ? 'Credly badge' : 'Certificate'}
						</p>
						<p className={styles.listItemSize}>{cert.issuer}</p>
					</div>
				);

				if (!href) {
					return <div key={cert.id}>{row}</div>;
				}

				return (
					<a
						key={cert.id}
						className={certStyles.certLinkRow}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
					>
						{row}
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
