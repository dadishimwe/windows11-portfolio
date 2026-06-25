import { FormEvent, useState } from 'react';
import { site } from '../../config/site';
import { sendContactEmail } from '../../lib/sendEmail';
import styles from './ContactForm.module.css';

type Props = {
	onSuccess?: () => void;
	compact?: boolean;
};

const initial = {
	name: '',
	email: '',
	subject: '',
	message: '',
	website: '',
};

function ContactForm({ onSuccess, compact = false }: Props) {
	const [fields, setFields] = useState(initial);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const [errorMessage, setErrorMessage] = useState('');

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);
		setStatus('idle');
		setErrorMessage('');

		const result = await sendContactEmail(fields);

		setIsSubmitting(false);

		if (result.ok) {
			setStatus('success');
			setFields(initial);
			onSuccess?.();
			return;
		}

		setStatus('error');
		setErrorMessage(result.error);

		if (result.code === 'NOT_CONFIGURED') {
			const subject = encodeURIComponent(
				fields.subject || 'Portfolio contact'
			);
			const body = encodeURIComponent(
				`Hi Dadi,\n\n${fields.message}\n\n— ${fields.name}`
			);
			window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.honeypot} aria-hidden>
				<label htmlFor="contact-website">Website</label>
				<input
					id="contact-website"
					name="website"
					tabIndex={-1}
					autoComplete="off"
					value={fields.website}
					onChange={(e) =>
						setFields((prev) => ({
							...prev,
							website: e.target.value,
						}))
					}
				/>
			</div>

			<div className={styles.field}>
				<label htmlFor="contact-name">Name</label>
				<input
					id="contact-name"
					required
					value={fields.name}
					onChange={(e) =>
						setFields((prev) => ({ ...prev, name: e.target.value }))
					}
				/>
			</div>

			<div className={styles.field}>
				<label htmlFor="contact-email">Email</label>
				<input
					id="contact-email"
					type="email"
					required
					value={fields.email}
					onChange={(e) =>
						setFields((prev) => ({ ...prev, email: e.target.value }))
					}
				/>
			</div>

			{!compact && (
				<div className={styles.field}>
					<label htmlFor="contact-subject">Subject</label>
					<input
						id="contact-subject"
						value={fields.subject}
						placeholder="Portfolio contact"
						onChange={(e) =>
							setFields((prev) => ({
								...prev,
								subject: e.target.value,
							}))
						}
					/>
				</div>
			)}

			<div className={styles.field}>
				<label htmlFor="contact-message">Message</label>
				<textarea
					id="contact-message"
					required
					value={fields.message}
					onChange={(e) =>
						setFields((prev) => ({
							...prev,
							message: e.target.value,
						}))
					}
				/>
			</div>

			<div className={styles.actions}>
				<button
					type="submit"
					className={styles.submit}
					disabled={isSubmitting}
				>
					{isSubmitting ? 'Sending…' : 'Send message'}
				</button>
			</div>

			{status === 'success' && (
				<p className={styles.success} role="status">
					Message sent — thanks for reaching out!
				</p>
			)}
			{status === 'error' && errorMessage && (
				<p className={styles.error} role="alert">
					{errorMessage}
				</p>
			)}
		</form>
	);
}

export default ContactForm;
