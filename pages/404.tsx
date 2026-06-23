import Bluescreen from '../components/modules/Bluescreen/Bluescreen';
import PageHead from '../components/utils/PageHead/PageHead';

function Custom404() {
	return (
		<>
			<PageHead title="404" description="Page not found." path="/404" />
			<Bluescreen errorCode="404_NOT_FOUND" />
		</>
	);
}

export default Custom404;
