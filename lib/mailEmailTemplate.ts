import { site } from '../config/site';

export function buildContactEmailHtml({
	name,
	email,
	subject,
	message,
}: {
	name: string;
	email: string;
	subject: string;
	message: string;
}) {
	const escapedMessage = message
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\n/g, '<br/>');

	return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1a1a2e;padding:20px 24px;">
            <p style="margin:0;color:#55ffff;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">Portfolio Mail</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:18px;font-weight:600;">${subject}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr>
                <td style="color:#6b7280;font-size:12px;width:72px;padding:6px 0;">From</td>
                <td style="color:#111827;font-size:14px;padding:6px 0;"><strong>${name}</strong> &lt;${email}&gt;</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:12px;padding:6px 0;">To</td>
                <td style="color:#111827;font-size:14px;padding:6px 0;">${site.email}</td>
              </tr>
            </table>
            <div style="border-top:1px solid #e5e7eb;padding-top:20px;color:#374151;font-size:15px;line-height:1.7;">
              ${escapedMessage}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:14px 24px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;color:#9ca3af;font-size:11px;">Sent via <a href="${site.portfolioUrl}" style="color:#2563eb;">${site.portfolioUrl}</a> · Reply goes to ${email}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
