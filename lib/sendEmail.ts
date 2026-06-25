export type ContactPayload = {
	name: string;
	email: string;
	subject: string;
	message: string;
	/** Honeypot — must be empty */
	website?: string;
};

export type SendEmailResult =
	| { ok: true }
	| { ok: false; error: string; code?: string };

export async function sendContactEmail(
	payload: ContactPayload
): Promise<SendEmailResult> {
	const response = await fetch('/api/send-email', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});

	const data = (await response.json().catch(() => ({}))) as {
		error?: string;
		code?: string;
		ok?: boolean;
	};

	if (!response.ok) {
		return {
			ok: false,
			error: data.error || 'Could not send message.',
			code: data.code,
		};
	}

	return { ok: true };
}
