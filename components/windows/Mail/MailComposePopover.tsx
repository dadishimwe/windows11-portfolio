import { FormEvent, useEffect, useRef, useState } from 'react';
import { BiBold, BiItalic, BiLink } from 'react-icons/bi';
import { HiPaperClip } from 'react-icons/hi';
import { Rnd } from 'react-rnd';
import { mailComposeTo } from '../../../config/apps/mail';
import { LogLine } from './mailTypes';
import styles from './Mail.module.css';

type ComposeFields = {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string;
};

type Props = {
	compose: ComposeFields;
	isSending: boolean;
	showLog: boolean;
	logLines: LogLine[];
	sendDone: boolean;
	sendFailed: boolean;
	sendError: string;
	onChange: (fields: ComposeFields) => void;
	onClose: () => void;
	onSend: (event?: FormEvent) => void;
	onToggleLog: () => void;
};

const DEFAULT_SIZE = { width: 460, height: 400 };

function MailComposePopover({
	compose,
	isSending,
	showLog,
	logLines,
	sendDone,
	sendFailed,
	sendError,
	onChange,
	onClose,
	onSend,
	onToggleLog,
}: Props) {
	const shellRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState({ x: 16, y: 16 });
	const [size, setSize] = useState(DEFAULT_SIZE);

	useEffect(() => {
		const shell = shellRef.current;
		if (!shell) return;
		const { width, height } = shell.getBoundingClientRect();
		setPosition({
			x: Math.max(12, width - DEFAULT_SIZE.width - 16),
			y: Math.max(12, height - DEFAULT_SIZE.height - 16),
		});
	}, []);

	return (
		<div ref={shellRef} className={styles.composeLayer}>
			<Rnd
				bounds="parent"
				dragHandleClassName={styles.composeDragHandle}
				cancel=".not_draggable"
				size={size}
				position={position}
				minWidth={340}
				minHeight={280}
				maxWidth="100%"
				maxHeight="100%"
				onDragStop={(_e, d) => setPosition({ x: d.x, y: d.y })}
				onResizeStop={(_e, _dir, ref, _delta, pos) => {
					setSize({
						width: ref.offsetWidth,
						height: ref.offsetHeight,
					});
					setPosition(pos);
				}}
				className={styles.composeRnd}
			>
				<form
					className={styles.composePopover}
					onSubmit={onSend}
				>
					<div
						className={`${styles.composeTitleBar} ${styles.composeDragHandle}`}
					>
						<span>New Message</span>
						<button
							type="button"
							className={`${styles.composeClose} not_draggable`}
							onClick={onClose}
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
								onChange({
									...compose,
									website: e.target.value,
								})
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
								className="not_draggable"
								type="email"
								required
								placeholder="your@email.com"
								value={compose.email}
								onChange={(e) =>
									onChange({
										...compose,
										email: e.target.value,
									})
								}
							/>
						</div>
						<div className={styles.headerLine}>
							<label>Name</label>
							<input
								className="not_draggable"
								placeholder="Your name"
								value={compose.name}
								onChange={(e) =>
									onChange({
										...compose,
										name: e.target.value,
									})
								}
							/>
						</div>
						<div className={styles.headerLine}>
							<label>Subject</label>
							<input
								className="not_draggable"
								placeholder="Say hello"
								value={compose.subject}
								onChange={(e) =>
									onChange({
										...compose,
										subject: e.target.value,
									})
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
							className={`${styles.toolbarSend} not_draggable`}
							disabled={isSending}
						>
							{isSending ? 'Sending…' : 'Send'}
						</button>
					</div>

					<textarea
						className={`${styles.composeBody} not_draggable`}
						required
						placeholder="Write your message…"
						value={compose.message}
						onChange={(e) =>
							onChange({
								...compose,
								message: e.target.value,
							})
						}
					/>

					<div className={styles.composeFooter}>
						<button
							type="button"
							className={`${styles.logToggle} not_draggable`}
							onClick={onToggleLog}
						>
							{showLog ? '▼' : '▶'} Show connection log
						</button>
						{showLog && logLines.length > 0 && (
							<div
								className={styles.logPanel}
								aria-live="polite"
							>
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
										className={`${styles.retryButton} not_draggable`}
										onClick={() => void onSend()}
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
			</Rnd>
		</div>
	);
}

export default MailComposePopover;
