import {
	CLOUDINARY_CERT_MIT_ONLINE_PREFIX,
	CLOUDINARY_CERT_MIT_PREFIX,
	CLOUDINARY_CERT_PEPLINK_PREFIX,
} from './cloudinary';

export type CertFolderKind = 'credly' | 'pdf';

export type CertExplorerFolder = {
	id: string;
	name: string;
	description: string;
	explorerPath: string;
	kind: CertFolderKind;
	icon: string;
	/** Cloudinary asset_folder for PDF-backed folders */
	cloudinaryFolder?: string;
};

export const certExplorerFolders: CertExplorerFolder[] = [
	{
		id: 'fortinet',
		name: 'Fortinet',
		description: 'NSE, FCF, FCA, and FortiGate Operator — verified on Credly',
		explorerPath: '/explorer/certifications/fortinet',
		kind: 'credly',
		icon: '/icons/folder/folder.png',
	},
	{
		id: 'peplink',
		name: 'Peplink',
		description: 'Peplink Certified Engineer and training certificates',
		explorerPath: '/explorer/certifications/peplink',
		kind: 'pdf',
		icon: '/icons/folder/folder.png',
		cloudinaryFolder: CLOUDINARY_CERT_PEPLINK_PREFIX,
	},
	{
		id: 'mit',
		name: 'MIT',
		description: 'MIT program certificates',
		explorerPath: '/explorer/certifications/mit',
		kind: 'pdf',
		icon: '/icons/folder/folder.png',
		cloudinaryFolder: CLOUDINARY_CERT_MIT_PREFIX,
	},
	{
		id: 'mit-online',
		name: 'MIT Online & edX',
		description:
			'MIT Emerging Talent, Universal AI, and other MIT Online / edX credentials',
		explorerPath: '/explorer/certifications/mit-online',
		kind: 'pdf',
		icon: '/icons/folder/folder.png',
		cloudinaryFolder: CLOUDINARY_CERT_MIT_ONLINE_PREFIX,
	},
];

export function getCertFolderByPath(
	path: string
): CertExplorerFolder | undefined {
	const normalized = path.split('?')[0];
	return certExplorerFolders.find(
		(folder) => folder.explorerPath === normalized
	);
}
