import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
	certifications,
	getCertificationHref,
} from '../../../config/certifications';
import { getAboutNotepadText } from '../../../config/notepadContent';
import { site } from '../../../config/site';
import { startMenuSocialApps, openExternalUrl } from '../../../config/taskbar';
import ContactForm from '../../../components/contact/ContactForm';
import { FiExternalLink } from 'react-icons/fi';
import styles from './MobileLayout.module.css';

type Panel = 'about' | 'certifications' | 'links' | 'contact' | null;

const PATH_PANEL: Record<string, Panel> = {
	'/notepad/about': 'about',
	'/explorer/certifications': 'certifications',
	'/explorer/links': 'links',
};

function MobileLayout() {
	const router = useRouter();
	const [panel, setPanel] = useState<Panel>(null);
	const [clock, setClock] = useState('');

	useEffect(() => {
		const panelFromPath = PATH_PANEL[router.pathname];
		if (panelFromPath) setPanel(panelFromPath);
	}, [router.pathname]);

	useEffect(() => {
		const tick = () => {
			setClock(
				new Date().toLocaleTimeString(navigator.language, {
					hour: '2-digit',
					minute: '2-digit',
				})
			);
		};
		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, []);

	const closePanel = () => {
		setPanel(null);
		if (router.pathname !== '/') {
			void router.replace('/');
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.overlay}>
				<p className={styles.desktopHint}>
					For the full Windows 11 desktop experience, visit on a
					larger screen.
				</p>

				<header className={styles.header}>
					<Image
						className={styles.avatar}
						src="/images/programmer.png"
						alt={site.name}
						width={72}
						height={72}
					/>
					<h1>{site.name}</h1>
					<p>{site.description}</p>
				</header>

				<div className={styles.grid}>
					<button
						type="button"
						className={styles.tile}
						onClick={() => setPanel('about')}
					>
						<Image
							src="/icons/notes/notes.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>About me</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() => setPanel('certifications')}
					>
						<Image
							src="/icons/documents/documents.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Certifications</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() =>
							openExternalUrl(
								'https://github.com/dadishimwe?tab=repositories'
							)
						}
					>
						<Image
							src="/icons/folder/folder.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Projects</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() => setPanel('contact')}
					>
						<Image
							src="/svg/email.svg"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Mail</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() => setPanel('links')}
					>
						<Image
							src="/icons/links/links.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Links</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() => openExternalUrl(site.blogUrl)}
					>
						<Image
							src="/icons/firefox/firefox.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Blog</span>
					</button>
					<button
						type="button"
						className={styles.tile}
						onClick={() => openExternalUrl(site.githubRepo)}
					>
						<Image
							src="/icons/vscode/vscode.png"
							alt=""
							width={32}
							height={32}
						/>
						<span className={styles.tileLabel}>Source code</span>
					</button>
				</div>

				<nav className={styles.social} aria-label="Social links">
					{startMenuSocialApps.map((app) => (
						<a
							key={app.id}
							href={app.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={app.label}
						>
							<Image
								src={app.icon}
								alt={app.label}
								width={22}
								height={22}
							/>
						</a>
					))}
					<Link href="/mail" aria-label="Mail app" passHref>
						<a>
							<Image
								src="/svg/email.svg"
								alt="Mail"
								width={22}
								height={22}
							/>
						</a>
					</Link>
					<a
						href={`mailto:${site.email}`}
						aria-label="Email"
					>
						<Image
							src="/svg/email.svg"
							alt="Email"
							width={22}
							height={22}
						/>
					</a>
				</nav>

				<footer className={styles.footer}>
					<span>{site.username}</span>
					<span>{clock}</span>
				</footer>
			</div>

			{panel && (
				<div
					className={styles.panelBackdrop}
					role="presentation"
					onClick={closePanel}
				>
					<div
						className={styles.panel}
						role="dialog"
						aria-modal="true"
						onClick={(e) => e.stopPropagation()}
					>
						<div className={styles.panelHeader}>
							<h2>
								{panel === 'about' && 'About me'}
								{panel === 'certifications' && 'Certifications'}
								{panel === 'links' && 'Links'}
								{panel === 'contact' && 'Mail'}
							</h2>
							<button
								type="button"
								className={styles.panelClose}
								onClick={closePanel}
							>
								Close
							</button>
						</div>

						{panel === 'about' && (
							<div className={styles.panelBody}>
								{getAboutNotepadText()}
							</div>
						)}

						{panel === 'certifications' && (
							<div className={styles.certList}>
								{certifications.map((cert) => {
									const href = getCertificationHref(cert);
									return (
										<div
											key={cert.id}
											className={styles.certItem}
										>
											{cert.badgeImageUrl && (
												<Image
													src={cert.badgeImageUrl}
													alt={`${cert.name} badge`}
													width={72}
													height={72}
													className={
														styles.certBadge
													}
												/>
											)}
											<div>
												<h3>{cert.name}</h3>
												<p className={styles.certMeta}>
													{cert.issuer} ·{' '}
													{cert.dateModified}
												</p>
												{href ? (
													<a
														className={
															styles.certLink
														}
														href={href}
														target="_blank"
														rel="noopener noreferrer"
													>
														View on Credly{' '}
														<FiExternalLink />
													</a>
												) : (
													<span
														className={
															styles.certPending
														}
													>
														Credly link coming soon
													</span>
												)}
											</div>
										</div>
									);
								})}
							</div>
						)}

						{panel === 'contact' && (
							<div className={styles.panelBody}>
								<p className={styles.contactIntro}>
									Send a message to {site.name}. On desktop,
									open Mail from the Start menu for the full
									inbox experience.
								</p>
								<ContactForm compact />
							</div>
						)}

						{panel === 'links' && (
							<div className={styles.linkList}>
								<a
									className={styles.linkRow}
									href={site.linkedin}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src="/svg/linkedin.svg"
										alt=""
										width={20}
										height={20}
									/>
									LinkedIn
								</a>
								<a
									className={styles.linkRow}
									href={site.github}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src="/svg/github.svg"
										alt=""
										width={20}
										height={20}
									/>
									GitHub
								</a>
								<a
									className={styles.linkRow}
									href={site.instagram}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src="/svg/instagram.svg"
										alt=""
										width={20}
										height={20}
									/>
									Instagram
								</a>
								<Link href="/mail" passHref>
									<a className={styles.linkRow}>
										<Image
											src="/svg/email.svg"
											alt=""
											width={20}
											height={20}
										/>
										Mail
									</a>
								</Link>
								<a
									className={styles.linkRow}
									href={`mailto:${site.email}`}
								>
									<Image
										src="/svg/email.svg"
										alt=""
										width={20}
										height={20}
									/>
									Email (mailto)
								</a>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default MobileLayout;
