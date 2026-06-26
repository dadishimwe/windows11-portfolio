import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import { postNavigateExplorerMessage } from '../../lib/explorerBridge';
import { useOpenFromRoute } from '../../hooks/useOpenFromRoute';
import Icons from '../modules/Icons/Icons';
import PageHead from '../utils/PageHead/PageHead';
import ExplorerEmbedShell from './ExplorerEmbedShell';

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

	useOpenFromRoute('fileExplorer', {
		explorerPath: path,
		enabled: !isEmbed,
	});

	useEffect(() => {
		if (!isEmbed) return;
		postNavigateExplorerMessage(path);
	}, [isEmbed, path]);

	if (isEmbed) {
		return (
			<ExplorerEmbedShell>{content?.()}</ExplorerEmbedShell>
		);
	}

	return (
		<>
			<PageHead {...head} />
			<Icons />
		</>
	);
}

export default ExplorerPage;
