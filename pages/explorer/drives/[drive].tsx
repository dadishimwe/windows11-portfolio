import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import ExplorerPage from '../../../components/explorer/ExplorerPage';
import { DriveConfig, DriveKey, drives, isDriveKey } from '../../../config/drives';
import styles from '../../../styles/utils/GridList.module.css';

type Props = {
	drive: DriveConfig;
};

function DrivePage({ drive }: Props) {
	const content = () => (
		<>
			<div className={styles.dropdownNav}>
				<h2>{drive.freeSpace}</h2>
			</div>
			<p className={styles.driveDescription}>{drive.description}</p>
			{drive.letter === 'D' && (
				<div className={styles.wrapper}>
					<Link href="/explorer/documents" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/documents/documents.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Documents</p>
								<p>{drive.folderTitle}</p>
							</div>
						</div>
					</Link>
					<Link href="/explorer/certifications" passHref>
						<div className={styles.item}>
							<div>
								<Image
									src="/icons/documents/documents.png"
									alt="icon"
									width={50}
									height={50}
								/>
							</div>
							<div>
								<p>Certifications</p>
								<p>{drive.folderTitle}</p>
							</div>
						</div>
					</Link>
				</div>
			)}
		</>
	);

	return (
		<ExplorerPage
			path={`/explorer/drives/${drive.letter}`}
			head={{
				title: drive.folderTitle,
				description: drive.description,
				path: `/explorer/drives/${drive.letter}`,
			}}
			content={content}
		/>
	);
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: [{ params: { drive: 'C' } }, { params: { drive: 'D' } }],
	fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const driveParam = params?.drive;

	if (typeof driveParam !== 'string' || !isDriveKey(driveParam)) {
		return { notFound: true };
	}

	return {
		props: { drive: drives[driveParam] },
	};
};

export default DrivePage;
