import Image from 'next/image';
import { FormEvent, useState } from 'react';
import { mailInbox } from '../../../config/apps/mail';
import { site } from '../../../config/site';
import { playSmtpLog } from '../../../lib/mailSmtpLog';
import { sendContactEmail } from '../../../lib/sendEmail';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Mail.module.css';

type View = 'inbox' | 'read' | 'compose';

type ComposeFields = {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
};

const initialCompose: ComposeFields = {
	name: '',
	email: '',
	subject: '',
	message: '',
	website: '',
};

function Mail({ onClose }: { onClose?: () => void }) {
	const [view, setView] = useState<View>('read');
	const [selectedId, setSelectedId] = useState<string | null>(
		mailInbox[0]?.id ?? null
	);
	const [compose, setCompose] = useState<ComposeFields>(initialCompose);
	const [isSending, setIsSending] = useState(false);
	const [logLines, setLogLines] = useState<string[]>([]);
	const [sendStatus, setSendStatus] = useState<
		'idle' | 'success' | 'error'
	>('idle');
	const [sendError, setSendError] = useState('');

	const selectedEmail =
		mailInbox.find((email) => email.id === selectedId) ?? null;

	const openInbox = () => {
		setView('inbox');
		setSendStatus('idle');
		setLogLines([]);
	};

	const openRead = (id: string) => {
		setSelectedId(id);
		setView('read');
	};

	const openCompose = () => {
		setView('compose');
		setSendStatus('idle');
		setSendError('');
		setLogLines([]);
	};

	const handleSend = async (event: FormEvent) => {
		event.preventDefault();
		setIsSending(true);
		setSendStatus('idle');
		setSendError('');
		setLogLines([]);

		const logPromise = playSmtpLog((line) => {
			setLogLines((prev) => [...prev, line]);
		});

		const sendPromise = sendContactEmail(compose);

		const [, result] = await Promise.all([logPromise, sendPromise]);

		setIsSending(false);

		if (result.ok) {
			setSendStatus('success');
			setCompose(initialCompose);
			return;
		}

		setSendStatus('error');
		setSendError(result.error);

		if (result.code === 'NOT_CONFIGURED') {
			const subject = encodeURIComponent(
				compose.subject || 'Portfolio contact'
			);
			const body = encodeURIComponent(
				`Hi Dadi,\n\n${compose.message}\n\n— ${compose.name}`
			);
			window.open(
				`mailto:${site.email}?subject=${subject}&body=${body}`,
				'_blank'
			);
		}
	};

	return (
		<DraggableWindow
			windowName="mail"
			topTitle={`Mail — ${site.email}`}
			topIcon={
				<Image
					src="/svg/email.svg"
					alt=""
					width={20}
					height={20}
				/>
			}
			onClose={onClose}
		>
			<div className={styles.shell}>
				<div className={styles.toolbar}>
					<span className={styles.toolbarTitle}>
						{site.username}@dadishimwe.com
					</span>
				</div>

				<div className={styles.body}>
					<aside className={styles.sidebar}>
						<button
							type="button"
							className={styles.composeButton}
							onClick={openCompose}
							disabled={isSending}
						>
							+ Compose
						</button>
						<button
							type="button"
							className={`${styles.navItem} ${
								view !== 'compose' ? styles.navItemActive : ''
							}`}
							onClick={openInbox}
						>
							Inbox ({mailInbox.length})
						</button>
					</aside>

					{view !== 'compose' && (
						<div className={styles.listPane}>
							<div className={styles.listHeader}>Inbox</div>
							{mailInbox.map((email) => (
								<button
									key={email.id}
									type="button"
									className={`${styles.emailRow} ${
										selectedId === email.id &&
										view === 'read'
											? styles.emailRowActive
											: ''
									} ${email.unread ? styles.emailRowUnread : ''}`}
									onClick={() => openRead(email.id)}
								>
									<span className={styles.emailFrom}>
										{email.from}
									</span>
									<span className={styles.emailSubject}>
										{email.subject}
									</span>
									<span className={styles.emailPreview}>
										{email.preview}
									</span>
									<span className={styles.emailDate}>
										{email.date}
									</span>
								</button>
							))}
						</div>
					)}

					<div className={styles.detailPane}>
						{view === 'read' && selectedEmail && (
							<article className={styles.readView}>
								<header className={styles.readHeader}>
									<h2>{selectedEmail.subject}</h2>
									<p className={styles.readMeta}>
										From: {selectedEmail.from} &lt;
										{selectedEmail.fromEmail}&gt;
										<br />
										{selectedEmail.date}
									</p>
								</header>
								<p className={styles.readBody}>
									{selectedEmail.body}
								</p>
							</article>
						)}

						{view === 'inbox' && (
							<div className={styles.emptyDetail}>
								Select a message to read, or compose a new
								email to Dadi.
							</div>
						)}

						{view === 'read' && !selectedEmail && (
							<div className={styles.emptyDetail}>
								Select a message to read
							</div>
						)}

						{view === 'compose' && (
							<form
								className={styles.composeView}
								onSubmit={handleSend}
							>
								<div className={styles.composeFields}>
									<div className={styles.honeypot} aria-hidden>
										<label htmlFor="mail-website">
											Website
										</label>
										<input
											id="mail-website"
											tabIndex={-1}
											autoComplete="off"
											value={compose.website}
											onChange={(e) =>
												setCompose((prev) => ({
													...prev,
													website: e.target.value,
												}))
											}
										/>
									</div>
									<div className={styles.fieldRow}>
										<label htmlFor="mail-name">Name</label>
										<input
											id="mail-name"
											required
											value={compose.name}
											onChange={(e) =>
												setCompose((prev) => ({
													...prev,
													name: e.target.value,
												}))
											}
										/>
									</div>
									<div className={styles.fieldRow}>
										<label htmlFor="mail-email">Email</label>
										<input
											id="mail-email"
											type="email"
											required
											value={compose.email}
											onChange={(e) =>
												setCompose((prev) => ({
													...prev,
													email: e.target.value,
												}))
											}
										/>
									</div>
									<div className={styles.fieldRow}>
										<label htmlFor="mail-subject">
											Subject
										</label>
										<input
											id="mail-subject"
											value={compose.subject}
											placeholder="Portfolio contact"
											onChange={(e) =>
												setCompose((prev) => ({
													...prev,
													subject: e.target.value,
												}))
											}
										/>
									</div>
									<div className={styles.fieldRow}>
										<label htmlFor="mail-message">
											Message
										</label>
										<textarea
											id="mail-message"
											required
											value={compose.message}
											onChange={(e) =>
												setCompose((prev) => ({
													...prev,
													message: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<div className={styles.actions}>
									<button
										type="submit"
										className={styles.sendButton}
										disabled={isSending}
									>
										{isSending ? 'Sending…' : 'Send'}
									</button>
									<button
										type="button"
										className={styles.secondaryButton}
										onClick={openInbox}
										disabled={isSending}
									>
										Cancel
									</button>
								</div>

								{logLines.length > 0 && (
									<div className={styles.logPanel} aria-live="polite">
										{logLines.map((line) => (
											<p
												key={line}
												className={styles.logLine}
											>
												{line}
											</p>
										))}
									</div>
								)}

								{sendStatus === 'success' && (
									<p className={styles.statusSuccess} role="status">
										250 OK — Message delivered. Thanks for
										reaching out!
									</p>
								)}
								{sendStatus === 'error' && sendError && (
									<p className={styles.statusError} role="alert">
										{sendError}
									</p>
								)}
							</form>
						)}
					</div>
				</div>
			</div>
		</DraggableWindow>
	);
}

export default Mail;
