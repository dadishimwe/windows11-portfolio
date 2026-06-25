import { certifications } from '../certifications';
import { site } from '../site';

export type InboxEmail = {
	id: string;
	from: string;
	fromEmail: string;
	subject: string;
	preview: string;
	body: string;
	/** Display order — lower = older, shown higher in inbox */
	sortOrder: number;
	date: string;
	unread?: boolean;
	avatar: string;
	avatarColor: string;
	signature?: string;
	link?: { label: string; href: string };
};

const nse4 = certifications.find((c) => c.id === 'fortinet-nse-4');
const nse1a = certifications.find((c) => c.id === 'fortinet-nse-1a');
const nse1b = certifications.find((c) => c.id === 'fortinet-nse-1b');

/** Career arc inbox — oldest first (top of list). */
export const mailInbox: InboxEmail[] = [
	{
		id: 'mit-emerging-talent',
		from: 'MIT Emerging Talent',
		fromEmail: 'no-reply@emergingtalent.mit.edu',
		subject:
			"You've completed MIT Emerging Talent — Computer and Data Science",
		preview:
			'Congratulations! You have successfully passed the competitive MIT CDS program…',
		sortOrder: 1,
		date: '18 Dec 2025',
		avatar: 'ME',
		avatarColor: '#8b1a1a',
		body: `Dear Emerging Talent Learner,

Congratulations! You have successfully passed the competitive pool of applicants and completed the rigorous MIT Computer and Data Science (CDS) Certificate Program.

Your coursework covered Python for data analysis, statistical inference, and applied machine learning — including a capstone on network telemetry classification.

You are invited to the Online Graduation on Thursday, December 18, 2025, from 12:00–2:00 PM EST.`,
		signature: 'MIT Emerging Talent Program',
	},
	{
		id: 'fortinet-threat-landscape',
		from: 'Fortinet Training',
		fromEmail: 'noreply-training@fortinet.com',
		subject:
			"Dadi, you've earned the Introduction to the Threat Landscape 3.0 badge",
		preview:
			'Congratulations! You have earned the Introduction to the Threat Landscape 3.0 badge…',
		sortOrder: 2,
		date: '1 Jun 2025',
		avatar: 'FT',
		avatarColor: '#d32f2f',
		body: `Hi Dadi,

Congratulations! You've earned the Introduction to the Threat Landscape 3.0 badge!

You can view your new badge and other achievements on the Fortinet Training Institute portal.`,
		signature: 'Fortinet Training Institute',
		link: nse1a?.credlyUrl
			? { label: 'View badge on Credly', href: nse1a.credlyUrl }
			: undefined,
	},
	{
		id: 'fortinet-cybersecurity-start',
		from: 'Fortinet Credly',
		fromEmail: 'fortinet@credly.com',
		subject: 'Dadi! You just earned a badge from Fortinet 🥳',
		preview:
			'Getting Started in Cybersecurity 3.0 — Issuer: Fortinet',
		sortOrder: 3,
		date: '7 Apr 2026',
		avatar: 'FC',
		avatarColor: '#c62828',
		body: `Dadi, you just earned a badge from Fortinet!

Getting Started in Cybersecurity 3.0
Issuer: Fortinet

Accept your badge to share it on LinkedIn and verify your achievement.`,
		link: nse1b?.credlyUrl
			? { label: 'Accept your badge', href: nse1b.credlyUrl }
			: undefined,
	},
	{
		id: 'peplink-pce',
		from: 'Peplink Training',
		fromEmail: 'training@peplink.com',
		subject: 'Peplink Certified Engineer (PCE) — Certificate Awarded',
		preview:
			'Your PCE certification is active. SpeedFusion and SD-WAN modules passed…',
		sortOrder: 4,
		date: '14 Aug 2025',
		avatar: 'PT',
		avatarColor: '#1565c0',
		body: `Hi Dadi,

Congratulations on earning Peplink Certified Engineer (PCE) status.

Exam modules completed:
• SpeedFusion & WAN bonding
• SD-WAN policy design
• InControl 2 deployment

Your certificate is available in the Peplink Learning Center.`,
		signature: 'Peplink Training Team',
		link: {
			label: 'Peplink Learning Center',
			href: 'https://www.peplink.com/support/training/',
		},
	},
	{
		id: 'fortinet-nse4',
		from: 'Fortinet Training',
		fromEmail: 'training@fortinet.com',
		subject: 'NSE 4 — FortiGate Operator Certificate Awarded',
		preview:
			'FortiGate 7.6 Operator exam passed. Credly badge ready to share.',
		sortOrder: 5,
		date: '17 May 2026',
		unread: true,
		avatar: 'FT',
		avatarColor: '#b71c1c',
		body: `Congratulations, Dadi!

You have passed the Fortinet NSE 4 — FortiGate 7.6 Operator examination.

Candidate ID: FGT-2026-${site.username.toUpperCase()}
Exam date: 17 May 2026

Your digital badge is ready on Credly. Share it on LinkedIn to verify your FortiGate operator skills.`,
		signature: 'Fortinet Training Team',
		link: nse4?.credlyUrl
			? { label: 'View badge on Credly', href: nse4.credlyUrl }
			: undefined,
	},
	{
		id: 'norrsken-deployment',
		from: 'Erik Lindqvist',
		fromEmail: 'erik.l@norrsken.example',
		subject: 'Starlink deployment live — board loved the numbers',
		preview:
			'Your SpeedFusion deployment hit 1.5 Gbps sustained. Failover under 90s…',
		sortOrder: 6,
		date: '18 Jun 2026',
		unread: true,
		avatar: 'EL',
		avatarColor: '#2e7d32',
		body: `Dadi,

The 10-Starlink SpeedFusion deployment went live this morning — sustained 1.5 Gbps across bonded links and failover completed in under 90 seconds.

The board was impressed. Please keep the FortiGate policy set documented in the runbook before we open the NOC dashboard to external monitoring.

Great work on this one.`,
		signature: 'Erik Lindqvist\nInfrastructure · Norrsken',
	},
	{
		id: 'recruiter-inreach',
		from: 'Sarah Chen',
		fromEmail: 's.chen@nordicinfra.example',
		subject: 'Network Engineer role — hybrid, EU',
		preview:
			'Your Fortinet certs and portfolio stood out. Are you open to a quick chat?',
		sortOrder: 7,
		date: '22 Jun 2026',
		unread: true,
		avatar: 'SC',
		avatarColor: '#6a1b9a',
		body: `Hi Dadi,

Your Fortinet certifications and the Windows portfolio caught my eye — especially Explorer, terminal sims, and the SMTP log on your Mail app.

We're hiring a Network Engineer for a hybrid role (Stockholm / remote EU). If you're open to a quick chat this month, reply with your availability.

Best,`,
		signature: 'Sarah Chen\nTalent · Nordic Infra Co.',
	},
];

export const mailComposeTo = `dadishimwe@${site.portfolioUrl.replace('https://', '').replace('www.', '')}`;

export const mailAppMeta = {
	title: 'Mail',
	icon: '/svg/email.svg',
	windowName: 'mail' as const,
};

export const mailSidebarFolders = [
	{ id: 'inbox' as const, label: 'Inbox', active: true },
	{ id: 'sent' as const, label: 'Sent', active: true },
	{ id: 'starred' as const, label: 'Starred', active: true },
	{ id: 'drafts' as const, label: 'Drafts', active: false },
	{ id: 'archive' as const, label: 'Archive', active: false },
];

export type MailFolder = 'inbox' | 'sent' | 'starred';
