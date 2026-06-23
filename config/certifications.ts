export type Certification = {
	id: string;
	name: string;
	issuer: string;
	dateModified: string;
	/**
	 * Public Credly badge URL (Credly → open badge → Share → Copy link).
	 * Prefer this over iframe embed codes — embeds are heavy and awkward
	 * inside File Explorer windows.
	 */
	credlyUrl?: string;
};

export const certifications: Certification[] = [
	{
		id: 'fortinet',
		name: 'Fortinet Certified',
		issuer: 'Fortinet',
		dateModified: '01/06/2025 10:00',
		// credlyUrl: 'https://www.credly.com/badges/your-fortinet-badge-id',
	},
	{
		id: 'peplink',
		name: 'Peplink Certified',
		issuer: 'Peplink',
		dateModified: '15/03/2025 14:30',
		// credlyUrl: 'https://www.credly.com/badges/your-peplink-badge-id',
	},
	{
		id: 'mit-emerging-talent',
		name: 'MIT Emerging Talent — Computer and Data Science',
		issuer: 'MIT',
		dateModified: '20/12/2024 09:00',
		// MIT may not use Credly — add a certificate PDF or program URL when available
	},
];

export function getCertificationHref(cert: Certification): string | undefined {
	return cert.credlyUrl;
}
