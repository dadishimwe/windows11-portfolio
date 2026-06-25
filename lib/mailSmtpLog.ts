import { site } from '../config/site';

export const SMTP_SUCCESS_LINES = [
	'Connecting to mail.dadishimwe.com:587...',
	'220 mail.dadishimwe.com ESMTP ready',
	'EHLO dadishimwe.com',
	'250-STARTTLS',
	'250-AUTH PLAIN LOGIN',
	'STARTTLS',
	'220 Ready to start TLS',
	'Connection established (TLS 1.3)',
	'EHLO dadishimwe.com',
	'AUTH PLAIN ********',
	'235 Authentication successful',
	'MAIL FROM:<visitor@portfolio>',
	`RCPT TO:<${site.email}>`,
	'250 OK',
	'DATA',
	'354 End data with <CR><LF>.<CR><LF>',
];

export const SMTP_TAIL_SUCCESS = [
	'250 Message accepted for delivery',
	'QUIT',
	'221 Bye',
];

export const SMTP_FAILURE_LINE =
	'550 5.7.1 Message rejected — delivery failed';

function randomDelay() {
	return 150 + Math.floor(Math.random() * 150);
}

export async function playSmtpSend({
	onLine,
	onComplete,
	send,
}: {
	onLine: (line: string, kind: 'ok' | 'err') => void;
	onComplete: (success: boolean) => void;
	send: () => Promise<{ ok: boolean }>;
}) {
	for (const line of SMTP_SUCCESS_LINES) {
		onLine(line, 'ok');
		await new Promise((r) => window.setTimeout(r, randomDelay()));
	}

	const result = await send();

	if (result.ok) {
		for (const line of SMTP_TAIL_SUCCESS) {
			onLine(line, 'ok');
			await new Promise((r) => window.setTimeout(r, randomDelay()));
		}
		onComplete(true);
		return;
	}

	onLine(SMTP_FAILURE_LINE, 'err');
	onComplete(false);
}
