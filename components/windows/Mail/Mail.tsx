import Image from 'next/image';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BiBold, BiItalic, BiLink } from 'react-icons/bi';
import { HiPaperClip } from 'react-icons/hi';
import { VscSearch } from 'react-icons/vsc';
import {
	mailComposeTo,
	mailInbox,
	mailSidebarFolders,
	MailFolder,
} from '../../../config/apps/mail';
import { site } from '../../../config/site';
import { playSmtpSend } from '../../../lib/mailSmtpLog';
import {
	addSentMessage,
	getReadIds,
	getSentMessages,
	getStarredIds,
	markRead,
	SentMessage,
	toggleStarred,
} from '../../../lib/mailSession';
import { sendContactEmail } from '../../../lib/sendEmail';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Mail.module.css';

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

type LogLine = { text: string; kind: 'ok' | 'err' };

function Mail({ onClose }: { onClose?: () => void }) {
	const sortedInbox = useMemo(
		() => [...mailInbox].sort((a, b) => a.sortOrder - b.sortOrder),
		[]
	);

	const [folder, setFolder] = useState<MailFolder>('inbox');
	const [selectedId, setSelectedId] = useState<string | null>(
		sortedInbox[sortedInbox.length - 1]?.id ?? null
	);
	const [composeOpen, setComposeOpen] = useState(false);
	const [compose, setCompose] = useState<ComposeFields>(initialCompose);
	const [isSending, setIsSending] = useState(false);
	const [logLines, setLogLines] = useState<LogLine[]>([]);
	const [showLog, setShowLog] = useState(false);
	const [sendDone, setSendDone] = useState(false);
	const [sendFailed, setSendFailed] = useState(false);
	const [sendError, setSendError] = useState('');
	const [starredIds, setStarredIds] = useState<string[]>([]);
	const [readIds, setReadIds] = useState<string[]>([]);
	const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
	const [showShortcuts, setShowShortcuts] = useState(false);

	useEffect(() => {
		setStarredIds(getStarredIds());
		setReadIds(getReadIds());
		setSentMessages(getSentMessages());
	}, []);

	const selectedEmail =
		mailInbox.find((email) => email.id === selectedId) ?? null;

	const isUnread = (id: string, defaultUnread?: boolean) => {
		if (readIds.includes(id)) return false;
		return defaultUnread ?? false;
	};

	const openCompose = useCallback(
		(preset?: Partial<ComposeFields>) => {
			setCompose({ ...initialCompose, ...preset });
			setComposeOpen(true);
			setLogLines([]);
			setShowLog(false);
			setSendDone(false);
			setSendFailed(false);
			setSendError('');
		},
		[]
	);

	const closeCompose = useCallback(() => {
		if (isSending) return;
		setComposeOpen(false);
	}, [isSending]);

	const openRead = (id: string) => {
		setSelectedId(id);
		setReadIds(markRead(id));
	};

	const openReply = useCallback(() => {
		if (!selectedEmail) return;
		openCompose({
			subject: selectedEmail.subject.startsWith('Re:')
				? selectedEmail.subject
				: `Re: ${selectedEmail.subject}`,
			message: `\n\n---\nOn ${selectedEmail.date}, ${selectedEmail.from} wrote:\n`,
		});
	}, [openCompose, selectedEmail]);

	const handleStar = (
		e: React.MouseEvent,
		id: string
	) => {
		e.stopPropagation();
		setStarredIds(toggleStarred(id));
	};

	const listEmails = useMemo(() => {
		if (folder === 'sent') {
			return sentMessages.map((msg) => ({
				id: msg.id,
				from: 'Me',
				subject: msg.subject,
				preview: msg.preview,
				date: msg.date,
				avatar: 'ME',
				avatarColor: '#4cc2ff',
				isSent: true,
			}));
		}
		if (folder === 'starred') {
			return sortedInbox.filter((e) => starredIds.includes(e.id));
		}
		return sortedInbox;
	}, [folder, sentMessages, sortedInbox, starredIds]);

	const handleSend = async (event?: FormEvent) => {
		event?.preventDefault();
		const name =
			compose.name.trim() ||
			compose.email.split('@')[0]?.replace(/[._]/g, ' ') ||
			'Visitor';

		setIsSending(true);
		setLogLines([]);
		setSendDone(false);
		setSendFailed(false);
		setSendError('');
		setShowLog(true);

		const payload = { ...compose, name };

		await playSmtpSend({
			onLine: (text, kind) => {
				setLogLines((prev) => [...prev, { text, kind }]);
			},
			onComplete: (success) => {
				setIsSending(false);
				if (success) {
					setSendDone(true);
					const sent = addSentMessage({
						to: mailComposeTo,
						subject: payload.subject || 'Portfolio contact',
						preview: payload.message.slice(0, 72),
						body: payload.message,
					});
					setSentMessages((prev) => [sent, ...prev]);
					setCompose(initialCompose);
					setTimeout(() => {
						setComposeOpen(false);
						setFolder('sent');
						setSelectedId(sent.id);
					}, 1200);
				} else {
					setSendFailed(true);
				}
			},
			send: async () => {
				const result = await sendContactEmail(payload);
				if (!result.ok) {
					setSendError(result.error);
					if (result.code === 'NOT_CONFIGURED') {
						const subject = encodeURIComponent(
							payload.subject || 'Portfolio contact'
						);
						const body = encodeURIComponent(
							`Hi Dadi,\n\n${payload.message}\n\n— ${name}`
						);
						window.open(
							`mailto:${site.email}?subject=${subject}&body=${body}`,
							'_blank'
						);
					}
				}
				return { ok: result.ok };
			},
		});
	};

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA'
			) {
				if (e.key === 'Escape') closeCompose();
				return;
			}

			if (e.key === 'c' || e.key === 'C') {
				openCompose();
			}
			if (e.key === 'Escape') {
				if (showShortcuts) setShowShortcuts(false);
				else closeCompose();
			}
			if ((e.key === 'r' || e.key === 'R') && selectedEmail) {
				openReply();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [openCompose, openReply, selectedEmail, showShortcuts, isSending, closeCompose]);

	const inboxUnreadCount = sortedInbox.filter((e) =>
		isUnread(e.id, e.unread)
	).length;

	return (
		<DraggableWindow
			windowName="mail"
			topTitle={`Mail — ${site.email}`}
			topIcon={
				<Image src="/svg/email.svg" alt="" width={20} height={20} />
			}
			onClose={onClose}
		>
			<div className={styles.shell}>
				<div className={styles.toolbar}>
					<span className={styles.toolbarTitle}>
						{site.username}@dadishimwe.com
					</span>
					<button
						type="button"
						className={styles.helpButton}
						onClick={() => setShowShortcuts(true)}
						title="Keyboard shortcuts"
					>
						?
					</button>
				</div>

				<div className={styles.body}>
					<aside className={styles.sidebar}>
						<button
							type="button"
							className={styles.composeButton}
							onClick={() => openCompose()}
							disabled={isSending}
						>
							+ Compose
						</button>
						{mailSidebarFolders.map((item) => (
							<button
								key={item.id}
								type="button"
								className={`${styles.navItem} ${
									folder === item.id ? styles.navItemActive : ''
								} ${!item.active ? styles.navItemDisabled : ''}`}
								onClick={() => {
									if (!item.active) return;
									setFolder(item.id as MailFolder);
								}}
							>
								{item.label}
								{item.id === 'inbox' && inboxUnreadCount > 0
									? ` (${inboxUnreadCount})`
									: item.id === 'inbox'
									  ? ` (${sortedInbox.length})`
									  : item.id === 'sent' && sentMessages.length > 0
										? ` (${sentMessages.length})`
										: ''}
							</button>
						))}
						<div className={styles.sidebarDivider} />
						<span className={`${styles.navItem} ${styles.navItemDisabled}`}>
							Labels
						</span>
					</aside>

					<div className={styles.listPane}>
						<div className={styles.searchBar}>
							<VscSearch />
							<input
								disabled
								placeholder="Search mail"
								title="Search coming soon"
							/>
						</div>
						<div className={styles.listHeader}>
							{folder === 'inbox' && 'Inbox'}
							{folder === 'sent' && 'Sent'}
							{folder === 'starred' && 'Starred'}
						</div>
						<div className={styles.listScroll}>
							{listEmails.length === 0 && (
								<p className={styles.emptyDetail}>
									{folder === 'sent'
										? 'No sent messages yet.'
										: 'No messages.'}
								</p>
							)}
							{folder !== 'sent' &&
								listEmails.map((email) => {
									const inboxEmail = mailInbox.find(
										(e) => e.id === email.id
									);
									const unread = inboxEmail
										? isUnread(email.id, inboxEmail.unread)
										: false;
									const starred = starredIds.includes(
										email.id
									);
									return (
										<button
											key={email.id}
											type="button"
											className={`${styles.emailRow} ${
												selectedId === email.id
													? styles.emailRowActive
													: ''
											} ${unread ? styles.emailRowUnread : ''}`}
											onClick={() => openRead(email.id)}
										>
											<span
												className={`${styles.unreadDot} ${
													unread
														? ''
														: styles.unreadDotRead
												}`}
												aria-hidden
											/>
											<span
												className={styles.avatar}
												style={{
													background:
														inboxEmail?.avatarColor ??
														'#4cc2ff',
													color: '#fff',
												}}
											>
												{inboxEmail?.avatar ?? 'ME'}
											</span>
											<span className={styles.emailFrom}>
												{email.from}
											</span>
											<button
												type="button"
												className={`${styles.starButton} ${
													starred
														? styles.starButtonStarred
														: ''
												}`}
												onClick={(e) =>
													handleStar(e, email.id)
												}
												aria-label={
													starred ? 'Unstar' : 'Star'
												}
											>
												{starred ? '★' : '☆'}
											</button>
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
									);
								})}
							{folder === 'sent' &&
								sentMessages.map((msg) => (
									<button
										key={msg.id}
										type="button"
										className={`${styles.emailRow} ${
											selectedId === msg.id
												? styles.emailRowActive
												: ''
										}`}
										onClick={() => setSelectedId(msg.id)}
									>
										<span
											className={`${styles.unreadDot} ${styles.unreadDotRead}`}
										/>
										<span
											className={styles.avatar}
											style={{
												background: '#4cc2ff',
												color: '#0a1628',
											}}
										>
											ME
										</span>
										<span className={styles.emailFrom}>
											To: {msg.to}
										</span>
										<span className={styles.emailSubject}>
											{msg.subject}
										</span>
										<span className={styles.emailPreview}>
											{msg.preview}
										</span>
										<span className={styles.emailDate}>
											{msg.date}
										</span>
									</button>
								))}
						</div>
					</div>

					<div className={styles.detailPane}>
						{folder === 'sent' && selectedId && (
							<article className={styles.readView}>
								{(() => {
									const msg = sentMessages.find(
										(m) => m.id === selectedId
									);
									if (!msg) return null;
									return (
										<>
											<header className={styles.readHeader}>
												<h2>{msg.subject}</h2>
												<p className={styles.readMeta}>
													To: {msg.to}
													<br />
													{msg.date}
												</p>
											</header>
											<p className={styles.readBody}>
												{msg.body}
											</p>
										</>
									);
								})()}
							</article>
						)}

						{folder !== 'sent' && selectedEmail && (
							<article className={styles.readView}>
								<div className={styles.readActions}>
									<button
										type="button"
										className={styles.replyButton}
										onClick={openReply}
									>
										Reply
									</button>
								</div>
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
								{selectedEmail.link && (
									<a
										className={styles.readLink}
										href={selectedEmail.link.href}
										target="_blank"
										rel="noopener noreferrer"
									>
										{selectedEmail.link.label}
									</a>
								)}
								{selectedEmail.signature && (
									<p className={styles.signature}>
										{selectedEmail.signature}
									</p>
								)}
							</article>
						)}

						{!selectedId && (
							<div className={styles.emptyDetail}>
								Select a message to read
							</div>
						)}
					</div>
				</div>

				{composeOpen && (
					<form
						className={styles.composePopover}
						onSubmit={handleSend}
					>
						<div className={styles.composeTitleBar}>
							<span>New Message</span>
							<button
								type="button"
								className={styles.composeClose}
								onClick={closeCompose}
								aria-label="Close compose"
							>
								×
							</button>
						</div>

						<div className={styles.honeypot} aria-hidden>
							<input
								tabIndex={-1}
								autoComplete="off"
								value={compose.website}
								onChange={(e) =>
									setCompose((p) => ({
										...p,
										website: e.target.value,
									}))
								}
							/>
						</div>

						<div className={styles.composeHeaderFields}>
							<div className={styles.headerLine}>
								<label>To</label>
								<span className={styles.headerLineLocked}>
									{mailComposeTo}
								</span>
							</div>
							<div className={styles.headerLine}>
								<label>From</label>
								<input
									type="email"
									required
									placeholder="your@email.com"
									value={compose.email}
									onChange={(e) =>
										setCompose((p) => ({
											...p,
											email: e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.headerLine}>
								<label>Name</label>
								<input
									placeholder="Your name"
									value={compose.name}
									onChange={(e) =>
										setCompose((p) => ({
											...p,
											name: e.target.value,
										}))
									}
								/>
							</div>
							<div className={styles.headerLine}>
								<label>Subject</label>
								<input
									placeholder="Say hello"
									value={compose.subject}
									onChange={(e) =>
										setCompose((p) => ({
											...p,
											subject: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div className={styles.composeToolbar}>
							<div className={styles.formatIcons}>
								<span title="Bold (cosmetic)">
									<BiBold />
								</span>
								<span title="Italic (cosmetic)">
									<BiItalic />
								</span>
								<span title="Link (cosmetic)">
									<BiLink />
								</span>
								<span title="Attach (cosmetic)">
									<HiPaperClip />
								</span>
							</div>
							<button
								type="submit"
								className={styles.toolbarSend}
								disabled={isSending}
							>
								{isSending ? 'Sending…' : 'Send'}
							</button>
						</div>

						<textarea
							className={styles.composeBody}
							required
							placeholder="Write your message…"
							value={compose.message}
							onChange={(e) =>
								setCompose((p) => ({
									...p,
									message: e.target.value,
								}))
							}
						/>

						<div className={styles.composeFooter}>
							<button
								type="button"
								className={styles.logToggle}
								onClick={() => setShowLog((v) => !v)}
							>
								{showLog ? '▼' : '▶'} Show connection log
							</button>
							{showLog && logLines.length > 0 && (
								<div className={styles.logPanel} aria-live="polite">
									{logLines.map((line, i) => (
										<p
											key={`${line.text}-${i}`}
											className={
												line.kind === 'err'
													? styles.logLineErr
													: styles.logLineOk
											}
										>
											{line.text}
										</p>
									))}
									{sendFailed && (
										<button
											type="button"
											className={styles.retryButton}
											onClick={() => void handleSend()}
										>
											[retry]
										</button>
									)}
								</div>
							)}
							{sendDone && (
								<p className={styles.statusSuccess} role="status">
									250 OK — Message delivered.
								</p>
							)}
							{sendFailed && sendError && (
								<p className={styles.logLineErr} role="alert">
									{sendError}
								</p>
							)}
						</div>
					</form>
				)}

				{showShortcuts && (
					<div
						className={styles.shortcutsOverlay}
						role="presentation"
						onClick={() => setShowShortcuts(false)}
					>
						<div
							className={styles.shortcutsCard}
							role="dialog"
							onClick={(e) => e.stopPropagation()}
						>
							<h3>Keyboard shortcuts</h3>
							<ul>
								<li>
									<span>Compose</span>
									<kbd>C</kbd>
								</li>
								<li>
									<span>Reply</span>
									<kbd>R</kbd>
								</li>
								<li>
									<span>Close compose</span>
									<kbd>Esc</kbd>
								</li>
							</ul>
							<button
								type="button"
								className={styles.shortcutsClose}
								onClick={() => setShowShortcuts(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}
			</div>
		</DraggableWindow>
	);
}

export default Mail;
