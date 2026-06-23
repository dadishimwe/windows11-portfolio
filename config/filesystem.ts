import { certifications, getCertificationHref } from './certifications';
import { site } from './site';

export const HOME_DIR = `/home/${site.username}`;

const directories: Record<string, string[]> = {
	[HOME_DIR]: [
		'Desktop',
		'Documents',
		'about.txt',
		'skills.txt',
		'contact.txt',
	],
	[`${HOME_DIR}/Desktop`]: [
		'About me',
		'Projects',
		'Tools',
		'Links',
		'Pictures',
		'Videos',
		'Certifications',
	],
	[`${HOME_DIR}/Documents`]: ['Certifications'],
	[`${HOME_DIR}/Documents/Certifications`]: certifications.map(
		(cert) => `${cert.id}.txt`
	),
};

const files: Record<string, string> = {
	[`${HOME_DIR}/about.txt`]: `${site.name} — network engineer and data scientist.
Passionate about infrastructure, cybersecurity, and machine learning.
Fortinet NSE certified (FCF, FCA, FortiGate Operator).`,
	[`${HOME_DIR}/skills.txt`]: `Network engineering & cybersecurity
Fortinet NSE / FortiGate
Data science & machine learning
Infrastructure & automation
Python`,
	[`${HOME_DIR}/contact.txt`]: `Email: ${site.email}
GitHub: ${site.github}
LinkedIn: ${site.linkedin}
Instagram: ${site.instagram}`,
};

certifications.forEach((cert) => {
	const href = getCertificationHref(cert);
	files[`${HOME_DIR}/Documents/Certifications/${cert.id}.txt`] =
		`${cert.name}\nIssuer: ${cert.issuer}\n${href ? `Credly: ${href}` : 'Verification link: pending'}`;
});

export function listDirectory(path: string): string[] | null {
	return directories[path] ?? null;
}

export function readFile(path: string): string | null {
	return files[path] ?? null;
}

export function isDirectory(path: string): boolean {
	return path in directories;
}

export function resolvePath(cwd: string, target: string): string | null {
	if (!target) return HOME_DIR;

	const base = target.startsWith('/') ? target : joinPath(cwd, target);
	const normalized = normalizePath(base);

	if (isDirectory(normalized) || readFile(normalized) !== null) {
		return normalized;
	}

	return null;
}

export function resolveDirectory(cwd: string, target: string): string | null {
	if (!target || target === '~') return HOME_DIR;

	const raw = target === '~' ? HOME_DIR : target;
	const base = raw.startsWith('/') ? raw : joinPath(cwd, raw);
	const normalized = normalizePath(base);

	return isDirectory(normalized) ? normalized : null;
}

function joinPath(base: string, segment: string): string {
	if (segment === '.') return base;
	if (segment === '..') {
		const parts = base.split('/').filter(Boolean);
		parts.pop();
		return `/${parts.join('/')}` || '/';
	}
	return `${base.replace(/\/$/, '')}/${segment}`;
}

function normalizePath(path: string): string {
	const parts = path.split('/').filter((part) => part && part !== '.');
	const stack: string[] = [];

	for (const part of parts) {
		if (part === '..') {
			stack.pop();
		} else {
			stack.push(part);
		}
	}

	return `/${stack.join('/')}`;
}
