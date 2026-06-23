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
		id: 'fortinet-nse-1a',
		name: 'Introduction to the Threat Landscape 3.0',
		issuer: 'Fortinet',
		dateModified: '01/06/2025',
		credlyUrl: 'https://www.credly.com/badges/5bbcf5ba-1d5f-4758-a18b-69c95cb1400b/public_url',
	},
	{
		id: 'fortinet-nse-1b',
		name: 'Getting Started in Cybersecurity 3.0',
		issuer: 'Fortinet',
		dateModified: '4/7/2026',
		credlyUrl: 'https://www.credly.com/badges/129f798c-f2bd-4723-9970-e5410a5ae726/public_url',
	},
	{
		id: 'fortinet-cfc',
		name: 'Fortinet Certified Fundamentals Cybersecurity',
		issuer: 'Fortinet',
		dateModified: '4/18/2026',
		credlyUrl: 'https://www.credly.com/badges/57cbfbec-00b2-4304-ab44-e47210dee7ea/public_url',
	},
	{
		id: 'fortinet-nse-2',
		name: 'Technical Introduction to Cybersecurity 3.0',
		issuer: 'Fortinet',
		dateModified: '4/19/2026',
		credlyUrl: 'https://www.credly.com/badges/61949431-879d-4fe8-b4b6-d5b44c24194f/public_url',
	},
	{
		id: 'fortinet-cac',
		name: 'Fortinet Certified Associate Cybersecurity',
		issuer: 'Fortinet',
		dateModified: '5/17/2026',
		credlyUrl: 'https://www.credly.com/badges/7439fe65-0fa1-4e93-8bff-130ee53fae5d/public_url',
	},
	{
		id: 'fortinet-nse-4',
		name: 'Fortinet FortiGate 7.6 Operator',
		issuer: 'Fortinet',
		dateModified: '5/17/2026',
		credlyUrl: 'https://www.credly.com/badges/d3b2a36f-d54f-42a0-b4db-27dd67d613a3/public_url',
	},
];

export function getCertificationHref(cert: Certification): string | undefined {
	return cert.credlyUrl;
}
