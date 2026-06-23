import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Icons from '../modules/Icons/Icons';
import PageHead from '../utils/PageHead/PageHead';
import { useOpenFromRoute } from '../../hooks/useOpenFromRoute';

type HeadProps = {
	title: string;
	description: string;
	path: string;
};

type Props = {
	path: string;
	head: HeadProps;
	content?: () => ReactNode;
};

function ExplorerPage({ path, head, content }: Props) {
	const router = useRouter();
	const isEmbed = router.query.embed === 'true';

	useOpenFromRoute('fileExplorer', { explorerPath: path });

	if (isEmbed) {
		return <>{content?.()}</>;
	}

	return (
		<>
			<PageHead {...head} />
			<Icons />
		</>
	);
}

export default ExplorerPage;
