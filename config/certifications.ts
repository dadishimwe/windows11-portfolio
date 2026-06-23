export type Certification = {
	id: string;
	name: string;
	issuer: string;
	dateModified: string;
	url?: string;
};

export const certifications: Certification[] = [
	{
		id: 'fortinet',
		name: 'Fortinet Certified',
		issuer: 'Fortinet',
		dateModified: '01/06/2025 10:00',
	},
	{
		id: 'peplink',
		name: 'Peplink Certified',
		issuer: 'Peplink',
		dateModified: '15/03/2025 14:30',
	},
	{
		id: 'mit-emerging-talent',
		name: 'MIT Emerging Talent — Computer and Data Science',
		issuer: 'MIT',
		dateModified: '20/12/2024 09:00',
	},
];
