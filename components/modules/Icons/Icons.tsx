import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Selecto from 'react-selecto';
import { Context } from '../../../context/ContextProvider';
import { routeToWindow } from '../../../lib/windowUtils';
import styles from './Icons.module.css';

const DELETE_KEYS = ['Delete'];

type DesktopLinkProps = {
	href: string;
	children: React.ReactNode;
};

function DesktopLink({ href, children }: DesktopLinkProps) {
	const { minimizedState } = useContext(Context);
	const [minimized, setMinimized] = minimizedState;

	const handleClick = () => {
		const windowName = routeToWindow(href);
		if (windowName && minimized[windowName]) {
			setMinimized({ ...minimized, [windowName]: false });
		}
	};

	return (
		<Link href={href} passHref>
			<div onClick={handleClick}>{children}</div>
		</Link>
	);
}

function Icons() {
	const [deleted, setDeleted] = useState(false);

	const handleDelete = () => {
		const selected = document.querySelectorAll(`.selected`);
		selected.forEach((element) => {
			if (!element.classList.contains('recycleBin')) {
				element.classList.add(`${styles.deleted}`);
				element.classList.add('deleted');
				setDeleted(true);
			}
		});
	};

	useEffect(() => {
		const eventListener = (e: KeyboardEvent) => {
			if (DELETE_KEYS.includes(e.key)) {
				handleDelete();
			}
		};
		document.addEventListener('keydown', eventListener);
		return () => {
			document.removeEventListener('keydown', eventListener);
		};
	}, []);

	return (
		<>
			<Selecto
				dragContainer={'.elements'}
				selectableTargets={[`.selecto-area .selectoItem`]}
				hitRate={0}
				selectByClick={true}
				selectFromInside={true}
				ratio={0}
				onSelect={(e) => {
					e.added.forEach((el) => {
						el.classList.add(`${styles.selected}`);
						el.classList.add(`selected`);
					});
					e.removed.forEach((el) => {
						el.classList.remove(`${styles.selected}`);
						el.classList.remove(`selected`);
					});
				}}
			/>
			<div className={`elements ${styles.container}`}>
				<div className={`selecto-area ${styles.wrapper}`} id="selecto1">
					<DesktopLink href="/notepad/about">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/notes/notes.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>About me</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/projects">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/folder/folder.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Projects</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/tools">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/folder/folder.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Tools</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/podcasts">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/folder/folder.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Podcasts I listen to</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/links">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/links/links.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Links</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/certifications">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/documents/documents.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Certifications</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/pictures">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/pictures/pictures.png"
								alt="icon"
								width={40}
								height={40}
							/>
							<p>Pictures</p>
						</div>
					</DesktopLink>
					<DesktopLink href="/explorer/videos">
						<div className={`${styles.item} selectoItem`}>
							<Image
								src="/icons/videos/videos.png"
								alt="icon"
								width={40}
								height={40}
								quality={100}
							/>
							<p>Videos</p>
						</div>
					</DesktopLink>

					<div className={`${styles.item} selectoItem recycleBin`}>
						{deleted ? (
							<Image
								src="/icons/trash/trash_full.png"
								alt="icon"
								width={40}
								height={40}
							/>
						) : (
							<Image
								src="/icons/trash/trash_empty.png"
								alt="icon"
								width={40}
								height={40}
							/>
						)}
						<p>Recycle Bin</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default Icons;
