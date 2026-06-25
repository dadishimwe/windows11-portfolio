import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { useOpenFromRoute } from '../hooks/useOpenFromRoute';

function MailPage() {
	useOpenFromRoute('mail');

	return (
		<>
			<PageHead
				title="Mail"
				description="Send a message to Dadi Ishimwe from the portfolio desktop."
				path="/mail"
			/>
			<Icons />
		</>
	);
}

export default MailPage;
