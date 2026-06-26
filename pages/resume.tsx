import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { getCloudinaryResume } from '../lib/cloudinary';
import { useOpenResumeOnLoad } from '../hooks/useOpenResumeOnLoad';
import { PdfDocument } from '../typings';

type Props = {
	resume: PdfDocument | null;
};

function ResumePage({ resume }: Props) {
	useOpenResumeOnLoad(resume);

	return (
		<>
			<PageHead
				title="Résumé"
				description="Dadi Ishimwe — network engineer and data scientist résumé."
				path="/resume"
			/>
			<Icons />
		</>
	);
}

export async function getStaticProps() {
	const resume = await getCloudinaryResume();

	return {
		props: { resume },
		revalidate: 60,
	};
}

export default ResumePage;
