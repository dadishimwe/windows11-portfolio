import { site } from '../config/site';

export const SMTP_LOG_LINES = [
	'Connecting to mail.dadishimwe.com:587...',
	'Connection established (TLS 1.3)',
	'EHLO dadishimwe.com',
	'AUTH PLAIN ********',
	'235 Authentication successful',
	'MAIL FROM:<visitor@portfolio>',
	`RCPT TO:<${site.email}>`,
	'250 OK',
	'DATA',
	'354 End data with <CR><LF>.<CR><LF>',
	'250 Message accepted for delivery',
	'QUIT',
	'221 mail.dadishimwe.com closing connection',
];

export async function playSmtpLog(
	onLine: (line: string, index: number) => void,
	delayMs = 180
) {
	for (let i = 0; i < SMTP_LOG_LINES.length; i++) {
		onLine(SMTP_LOG_LINES[i], i);
		await new Promise((resolve) => window.setTimeout(resolve, delayMs));
	}
}
