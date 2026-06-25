import { site } from '../site';

export type InboxEmail = {
	id: string;
	from: string;
	fromEmail: string;
	subject: string;
	preview: string;
	body: string;
	date: string;
	unread?: boolean;
};

/** Read-only story inbox — recruiter praise, deployment notes, etc. */
export const mailInbox: InboxEmail[] = [
	{
		id: 'recruiter-inreach',
		from: 'Sarah Chen',
		fromEmail: 's.chen@techrecruit.example',
		subject: 'Network Engineer role — hybrid, EU',
		preview:
			'Hi Dadi — your Fortinet certs and portfolio stood out. Are you open to…',
		date: '22 Jun 2026',
		unread: true,
		body: `Hi Dadi,

Your Fortinet certifications and the Windows portfolio caught my eye — especially the way you've wired Explorer, terminal sims, and real project artifacts together. We're hiring a Network Engineer for a hybrid role (Stockholm / remote EU).

If you're open to a quick chat this month, reply with your availability.

Best,
Sarah Chen
Talent · Nordic Infra Co.`,
	},
	{
		id: 'norrsken-deployment',
		from: 'Ops Team',
		fromEmail: 'ops@norrsken.example',
		subject: 'Re: Starlink failover test — looks good',
		preview:
			'Failover completed in under 90s. Document the FortiGate policy set…',
		date: '18 Jun 2026',
		unread: true,
		body: `Dadi,

Starlink failover test completed in under 90 seconds — nice work on the policy routing and monitoring hooks.

Please document the FortiGate policy set in the runbook before Friday. The NOC dashboard will pull from the same JSON topology when we ship the public demo.

— Ops`,
	},
	{
		id: 'fortinet-training',
		from: 'Fortinet Training',
		fromEmail: 'noreply@fortinet.com',
		subject: 'NSE 4 — FortiGate Operator completed',
		preview: 'Congratulations on completing FortiGate Operator…',
		date: '01 Jun 2025',
		body: `Congratulations, Dadi!

You have completed FortiGate Operator (NSE 4). Your Credly badge is ready to share.

Keep building — the threat landscape does not wait.

Fortinet Training Team`,
	},
	{
		id: 'oss-maintainer',
		from: 'Alex Rivera',
		fromEmail: 'alex@opensource.example',
		subject: 'PR merged — thanks for the Wireshark notes',
		preview:
			'Your PCAP annotation PR is in main. Want to co-author a short write-up?',
		date: '12 May 2026',
		body: `Hey Dadi,

Merged your PR — the annotated PCAP walkthrough is exactly what newcomers need.

If you're up for it, let's co-author a short blog post for the repo wiki.

Cheers,
Alex`,
	},
	{
		id: 'portfolio-welcome',
		from: 'Future You',
		fromEmail: 'mail@dadishimwe.com',
		subject: 'Welcome to Mail on dadishimwe.com',
		preview:
			'This inbox is story mode. Hit Compose to send a real message to Dadi.',
		date: '23 Jun 2026',
		body: `Welcome to Mail on ${site.portfolioUrl.replace('https://', '')}.

This inbox is story mode — curated notes from recruiters, deployments, and training milestones.

Want to reach the real Dadi? Click Compose. You'll see a simulated SMTP log (because network engineers appreciate logs), then your message is delivered via Resend when the API is configured.

— Portfolio Mail`,
	},
];

export const mailAppMeta = {
	title: 'Mail',
	icon: '/svg/email.svg',
	windowName: 'mail' as const,
};
