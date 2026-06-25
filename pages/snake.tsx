import Icons from '../components/modules/Icons/Icons';
import PageHead from '../components/utils/PageHead/PageHead';
import { useOpenFromRoute } from '../hooks/useOpenFromRoute';

function SnakePage() {
	useOpenFromRoute('snake');

	return (
		<>
			<PageHead
				title="Packet Snake"
				description="Route packets through the LAN — avoid DMZ walls in Dadi's portfolio easter egg game."
				path="/snake"
			/>
			<Icons />
		</>
	);
}

export default SnakePage;
