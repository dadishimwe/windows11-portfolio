import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
	ChangeEvent,
	useContext,
	useEffect,
	useState,
	FocusEvent,
} from 'react';
import {
	AiFillCaretRight,
	AiOutlinePlusCircle,
	AiOutlineUndo,
} from 'react-icons/ai';
import { BiRename, BiSelection, BiShowAlt, BiSortAlt2 } from 'react-icons/bi';
import { BsPinAngle, BsScissors, BsTrash } from 'react-icons/bs';
import { FaList, FaRegShareSquare } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
	HiArrowLeft,
	HiArrowRight,
	HiArrowUp,
	HiOutlineDesktopComputer,
	HiOutlineViewList,
} from 'react-icons/hi';
import { IoMdOptions, IoMdRefresh } from 'react-icons/io';
import {
	MdContentCopy,
	MdContentPaste,
	MdOutlineListAlt,
	MdOutlineSelectAll,
	MdOutlineViewCompact,
	MdTabUnselected,
} from 'react-icons/md';
import { RiArrowDropDownLine, RiComputerLine } from 'react-icons/ri';
import { SiMaterialdesignicons } from 'react-icons/si';
import { VscSearch, VscSymbolProperty } from 'react-icons/vsc';
import { Context } from '../../../context/ContextProvider';
import { isActivePath } from '../../../lib/pathUtils';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './FileExplorer.module.css';

type Props = {
	folder: string;
	icon: string;
	topNav: boolean;
	component?: React.ReactNode;
	onClose?: () => void;
	navigationMode?: 'router' | 'context';
	currentPath?: string;
	onNavigate?: (path: string) => void;
};

function FileExplorer(props: Props) {
	const router = useRouter();
	const { asPath } = router;

	const { explorerHistoryState, indexState, wasManualState } =
		useContext(Context);
	const [history, setHistory] = explorerHistoryState;
	const [index, setIndex] = indexState;
	const [wasManual, setWasManual] = wasManualState;

	const navigationMode = props.navigationMode ?? 'router';
	const activePath =
		navigationMode === 'context'
			? props.currentPath ?? ''
			: router.asPath;

	const NavLink = ({
		href,
		children,
	}: {
		href: string;
		children: React.ReactNode;
	}) => {
		const basePath = href.split('?')[0];
		if (navigationMode === 'context' && props.onNavigate) {
			return (
				<div
					role="link"
					tabIndex={0}
					onClick={() => props.onNavigate?.(basePath)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							props.onNavigate?.(basePath);
						}
					}}
				>
					{children}
				</div>
			);
		}
		return <Link href={href}>{children}</Link>;
	};

	const [path, setPath] = useState(props.folder);
	const [quickaccess, setQuickaccess] = useState(true);
	const [thisPC, setThisPC] = useState(true);

	useEffect(() => {
		setPath(props.folder);
	}, [props.folder]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPath(e.target.value);
	};

	const handleFocus = (e: FocusEvent<HTMLInputElement>) => e.target.select();

	const handleBlur = () => setPath(props.folder);

	useEffect(() => {
		const pathToTrack =
			navigationMode === 'context' ? props.currentPath : asPath;

		if (pathToTrack?.includes('/explorer/') && !wasManual) {
			const newHistory = history.slice(0, index + 1);
			newHistory.push(pathToTrack);
			setHistory(newHistory);
			setIndex(newHistory.length - 1);
		}
		setWasManual(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigationMode === 'context' ? props.currentPath : asPath]);

	const navigateTo = (path: string) => {
		if (navigationMode === 'context' && props.onNavigate) {
			props.onNavigate(path.split('?')[0]);
			return;
		}
		router.push(path);
	};

	const handleBack = () => {
		if (index > 0 && history.length > 0) {
			setWasManual(true);
			const i = index - 1;
			setIndex(i);
			navigateTo(history[i]);
		}
	};
	const handleNext = () => {
		if (index < history.length - 1) {
			setWasManual(true);
			const i = index + 1;
			setIndex(i);
			navigateTo(history[i]);
		}
	};

	return (
		<DraggableWindow
			windowName={'fileExplorer'}
			topTitle={props.folder}
			topIcon={
				<Image
					src={`/icons/${props.icon}/${props.icon}.png`}
					alt="ico"
					width={20}
					height={20}
				/>
			}
			onClose={props.onClose}
		>
			<div className={styles.top}>
				<section className={styles.manage}>
					<div className={styles.manageNew}>
						<div className={styles.icon}>
							<AiOutlinePlusCircle />
							<p>New</p>
							<RiArrowDropDownLine />
							<div className={styles.manageDropdown}>
								<div>
									<Image
										src="/icons/folder/folder.png"
										height={20}
										width={20}
										alt="ico"
									/>
									<p>Folder</p>
								</div>
								<div>
									<Image
										src="/icons/shortcut/shortcut.png"
										height={20}
										width={20}
										alt="ico"
									/>
									<p>Shortcut</p>
								</div>
								<div>
									<Image
										src="/icons/notes/notes.png"
										height={20}
										width={20}
										alt="ico"
									/>
									<p>Text Document</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.manageActions}>
						<div className={styles.icon}>
							<BsScissors />
						</div>
						<div className={styles.icon}>
							<MdContentCopy />
						</div>
						<div className={styles.icon}>
							<MdContentPaste />
						</div>
						<div className={styles.icon}>
							<BiRename />
						</div>
						<div className={styles.icon}>
							<FaRegShareSquare />
						</div>
						<div className={styles.icon}>
							<BsTrash />
						</div>
					</div>
					<div className={styles.manageSort}>
						<div className={styles.icon}>
							{' '}
							<BiSortAlt2 />
							<p>Sort</p>
							<RiArrowDropDownLine />
							<div className={styles.manageDropdown}>
								<div>
									<p>Name</p>
								</div>
								<div>
									<p>Status</p>
								</div>
								<div>
									<p>Date modified</p>
								</div>
								<div>
									<p>More</p>
								</div>
								<div>
									<p>Ascending</p>
								</div>
								<div>
									<p>Descending</p>
								</div>
								<div>
									<p>Group by</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.manageView}>
						<div className={styles.icon}>
							{' '}
							<GiHamburgerMenu />
							<p>View</p>
							<RiArrowDropDownLine />
							<div className={styles.manageDropdown}>
								<div>
									<RiComputerLine />
									<p>Extra large icons</p>
								</div>
								<div>
									<HiOutlineDesktopComputer />
									<p>Large icons</p>
								</div>
								<div>
									<HiOutlineDesktopComputer />
									<p>Medium icons</p>
								</div>
								<div>
									<SiMaterialdesignicons />
									<p>Small icons</p>
								</div>
								<div>
									<FaList />
									<p>List</p>
								</div>
								<div>
									<HiOutlineViewList />
									<p>Details</p>
								</div>
								<div>
									<MdOutlineListAlt />
									<p>Tiles</p>
								</div>
								<div>
									<MdOutlineListAlt />
									<p>Content</p>
								</div>
								<div>
									<MdOutlineViewCompact />
									<p>Compact view</p>
								</div>
								<div>
									<BiShowAlt />
									<p>Show</p>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.manageMore}>
						<div className={styles.icon}>
							<FiMoreHorizontal />
							<div className={styles.manageDropdown}>
								<div>
									<AiOutlineUndo />
									<p>Undo</p>
								</div>
								<div>
									<BsPinAngle />
									<p>Pin to Quick access</p>
								</div>
								<div>
									<MdOutlineSelectAll />
									<p>Select all</p>
								</div>
								<div>
									<MdTabUnselected />
									<p>Select none</p>
								</div>
								<div>
									<BiSelection />
									<p>Invert selection</p>
								</div>
								<div>
									<VscSymbolProperty />
									<p>Properties</p>
								</div>
								<div>
									<IoMdOptions />
									<p>Options</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			<section className={styles.navigate}>
				<div className={styles.arrows}>
					<HiArrowLeft
						onClick={handleBack}
						style={
							typeof history[index - 1] === 'undefined'
								? {}
								: { color: 'white' }
						}
					/>
					<HiArrowRight
						onClick={handleNext}
						style={
							typeof history[index + 1] === 'undefined'
								? {}
								: { color: 'white' }
						}
					/>
					<RiArrowDropDownLine />
					<HiArrowUp />
				</div>
				<div className={styles.navigatePath}>
					<div className={styles.left}>
						<Image
							src={`/icons/${props.icon}/${props.icon}.png`}
							alt="ico"
							width={20}
							height={20}
						/>
						<AiFillCaretRight />
						<input
							value={`${path}`}
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
						></input>
					</div>
					<div className={styles.right}>
						<div>
							<RiArrowDropDownLine />
						</div>
						<div>
							<IoMdRefresh />
						</div>
					</div>
				</div>
				<div className={styles.navigateSearch}>
					<VscSearch />
					<input placeholder={`Search: ${props.folder}`} />
				</div>
			</section>
			<section className={styles.contentArea}>
				<div className={styles.sidebar}>
					<div
						className={styles.navigationDropdown}
						style={
							router.pathname == '/explorer/quick-access'
								? {
										backgroundColor: '#2e2e2e',
								  }
								: {}
						}
					>
						<RiArrowDropDownLine
							onClick={() => setQuickaccess(!quickaccess)}
							style={
								quickaccess
									? {}
									: {
											transform: 'rotate(-90deg)',
									  }
							}
						/>
						<NavLink href="/explorer/quick-access">
							<div>
								<Image
									src="/icons/quickaccess/quickaccess.png"
									alt="ico"
									width={16}
									height={16}
								/>
								<p>Quick access</p>
							</div>
						</NavLink>
					</div>
					{quickaccess && (
						<>
							<NavLink href="/explorer/desktop?top=true">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/desktop'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/desktop/desktop.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Desktop</p>
								</div>
							</NavLink>
							<NavLink href="/explorer/downloads?top=true">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/downloads'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/downloads/downloads_small.png"
										alt="ico"
										width={16}
										height={16}
										unoptimized
									/>
									<p>Downloads</p>
								</div>
							</NavLink>
							<NavLink href="/explorer/documents?top=true">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/documents'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/documents/documents_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Documents</p>
								</div>
							</NavLink>
							<NavLink href="/explorer/pictures?top=true">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/pictures'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/pictures/pictures_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Pictures</p>
								</div>
							</NavLink>
						</>
					)}
					<div
						className={styles.navigationDropdown}
						style={
							activePath.split('?')[0] == '/explorer/this-pc'
								? {
										backgroundColor: '#2e2e2e',
								  }
								: {}
						}
					>
						<RiArrowDropDownLine
							onClick={() => setThisPC(!thisPC)}
							style={
								thisPC
									? {}
									: {
											transform: 'rotate(-90deg)',
									  }
							}
						/>
						<NavLink href="/explorer/this-pc">
							<div>
								<Image
									src="/icons/this-pc/this-pc.png"
									alt="ico"
									width={16}
									height={16}
								/>
								<p>This PC</p>
							</div>
						</NavLink>
					</div>
					{thisPC && (
						<>
							<NavLink href="/explorer/desktop">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/desktop'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/desktop/desktop.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Desktop</p>
								</div>
							</NavLink>
							<NavLink href="/explorer/downloads">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/downloads'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/downloads/downloads_small.png"
										alt="ico"
										width={16}
										height={16}
										unoptimized
									/>
									<p>Downloads</p>
								</div>
							</NavLink>
							<NavLink href="/explorer/documents">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/documents'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/documents/documents_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Documents</p>
								</div>
							</NavLink>

							<NavLink href="/explorer/pictures">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/pictures'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/pictures/pictures_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Pictures</p>
								</div>
							</NavLink>

							<NavLink href="/explorer/videos">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/videos'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/videos/videos_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Videos</p>
								</div>
							</NavLink>

							<NavLink href="/explorer/music">
								<div
									className={styles.navigationItem}
									style={
										activePath.split('?')[0] ==
										'/explorer/music'
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/music/music_small.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>Music</p>
								</div>
							</NavLink>

							<NavLink href="/explorer/drives/C">
								<div
									className={styles.navigationItem}
									style={
										isActivePath(
											activePath,
											'/explorer/drives/C'
										)
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/drives/c.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>250GB SSD</p>
								</div>
							</NavLink>

							<NavLink href="/explorer/drives/D">
								<div
									className={styles.navigationItem}
									style={
										isActivePath(
											activePath,
											'/explorer/drives/D'
										)
											? {
													backgroundColor: '#2e2e2e',
											  }
											: {}
									}
								>
									<Image
										src="/icons/drives/d.png"
										alt="ico"
										width={16}
										height={16}
									/>
									<p>1TB SSD</p>
								</div>
							</NavLink>
						</>
					)}
				</div>

				<div className={styles.content}>
					{props.topNav && (
						<>
							<div className={styles.topNav}>
								<div className={styles.name}>
									<p>Name</p>
								</div>

								<div className={styles.dateModified}>
									<p>Date modified</p>
								</div>
								<div className={styles.type}>
									<p>Type</p>
								</div>
								<div className={styles.size}>
									<p>Size</p>
								</div>
							</div>
						</>
					)}

					<div className={`${styles.child} not_clickable`}>
						{props.component || (
							<>
								<p className={styles.emptyFolder}>
									This folder is empty.
								</p>
							</>
						)}
					</div>
				</div>
			</section>
		</DraggableWindow>
	);
}

export default FileExplorer;
