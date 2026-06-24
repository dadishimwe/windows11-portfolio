import Image from 'next/image';
import {
	FormEvent,
	KeyboardEvent,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import {
	HiArrowLeft,
	HiArrowRight,
	HiRefresh,
} from 'react-icons/hi';
import { FIREFOX_HOME_URL } from '../../../config/taskbar';
import { getBlogHostname } from '../../../config/site';
import { displayUrl, resolveBrowserTarget } from '../../../lib/browserNavigation';
import { Context } from '../../../context/ContextProvider';
import { useWindowManager } from '../../../hooks/useWindowManager';
import {
	createFirefoxTab,
	goBackInTab,
	goForwardInTab,
	navigateFirefoxTab,
} from '../../../lib/firefoxTabs';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Firefox.module.css';

function Firefox() {
	const { firefoxTabsState, activeFirefoxTabIdState } = useContext(Context);
	const [tabs, setTabs] = firefoxTabsState;
	const [activeTabId, setActiveTabId] = activeFirefoxTabIdState;
	const { closeWindow } = useWindowManager();
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
	const [addressInput, setAddressInput] = useState(activeTab?.url ?? '');
	const [isLoading, setIsLoading] = useState(false);
	const [frameBlocked, setFrameBlocked] = useState<Record<string, boolean>>(
		{}
	);

	useEffect(() => {
		if (activeTab) {
			setAddressInput(activeTab.url);
		}
	}, [activeTab]);

	const updateTab = (tabId: string, updater: (tab: typeof activeTab) => typeof activeTab) => {
		setTabs((prev) =>
			prev.map((tab) => (tab.id === tabId ? updater(tab) : tab))
		);
	};

	const navigateActiveTab = (rawInput: string) => {
		const url = resolveBrowserTarget(rawInput);
		setIsLoading(true);
		setFrameBlocked((prev) => ({ ...prev, [activeTabId]: false }));
		updateTab(activeTabId, (tab) => ({
			...navigateFirefoxTab(tab, url),
			title: displayUrl(url),
		}));
		setAddressInput(url);
	};

	const handleNavigate = (event?: FormEvent) => {
		event?.preventDefault();
		navigateActiveTab(addressInput);
	};

	const handleAddressKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleNavigate();
		}
	};

	const handleAddTab = () => {
		const newTab = createFirefoxTab(FIREFOX_HOME_URL, getBlogHostname());
		setTabs((prev) => [...prev, newTab]);
		setActiveTabId(newTab.id);
		setAddressInput(newTab.url);
	};

	const handleCloseTab = (tabId: string) => {
		if (tabs.length === 1) {
			const replacement = createFirefoxTab(FIREFOX_HOME_URL, getBlogHostname());
			setTabs([replacement]);
			setActiveTabId(replacement.id);
			setAddressInput(replacement.url);
			return;
		}

		const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
		const nextTabs = tabs.filter((tab) => tab.id !== tabId);
		setTabs(nextTabs);

		if (tabId === activeTabId) {
			const nextTab = nextTabs[Math.max(0, tabIndex - 1)];
			setActiveTabId(nextTab.id);
			setAddressInput(nextTab.url);
		}
	};

	const handleSelectTab = (tabId: string) => {
		const tab = tabs.find((item) => item.id === tabId);
		if (!tab) return;
		setActiveTabId(tabId);
		setAddressInput(tab.url);
	};

	const handleBack = () => {
		const tab = tabs.find((item) => item.id === activeTabId);
		if (!tab) return;
		const previous = goBackInTab(tab);
		if (!previous) return;
		updateTab(activeTabId, () => ({
			...previous,
			title: displayUrl(previous.url),
		}));
		setAddressInput(previous.url);
		setIsLoading(true);
	};

	const handleForward = () => {
		const tab = tabs.find((item) => item.id === activeTabId);
		if (!tab) return;
		const next = goForwardInTab(tab);
		if (!next) return;
		updateTab(activeTabId, () => ({
			...next,
			title: displayUrl(next.url),
		}));
		setAddressInput(next.url);
		setIsLoading(true);
	};

	const handleReload = () => {
		if (!iframeRef.current) return;
		setIsLoading(true);
		setFrameBlocked((prev) => ({ ...prev, [activeTabId]: false }));
		iframeRef.current.src = activeTab?.url ?? FIREFOX_HOME_URL;
	};

	const canGoBack = (activeTab?.historyIndex ?? 0) > 0;
	const canGoForward =
		(activeTab?.historyIndex ?? 0) < (activeTab?.history.length ?? 1) - 1;
	const isBlocked = frameBlocked[activeTabId];

	return (
		<DraggableWindow
			windowName="firefox"
			topTitle={`Mozilla Firefox — ${displayUrl(activeTab?.url ?? FIREFOX_HOME_URL)}`}
			topIcon={
				<Image
					src="/icons/firefox/firefox.png"
					alt="Firefox"
					width={20}
					height={20}
				/>
			}
			onClose={() => closeWindow('firefox')}
		>
			<div className={`${styles.tabBar} not_draggable`}>
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`${styles.tab} ${
							tab.id === activeTabId ? styles.tabActive : ''
						}`}
						onClick={() => handleSelectTab(tab.id)}
						role="tab"
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleSelectTab(tab.id);
							}
						}}
					>
						<span className={styles.tabTitle}>
							{displayUrl(tab.url)}
						</span>
						<button
							type="button"
							className={styles.tabClose}
							aria-label={`Close ${tab.title}`}
							onClick={(e) => {
								e.stopPropagation();
								handleCloseTab(tab.id);
							}}
						>
							<AiOutlineClose />
						</button>
					</div>
				))}
				<button
					type="button"
					className={styles.newTab}
					aria-label="New tab"
					onClick={handleAddTab}
				>
					<AiOutlinePlus />
				</button>
			</div>
			<form
				className={`${styles.browserToolbar} not_draggable`}
				onSubmit={handleNavigate}
			>
				<div className={styles.navButtons}>
					<button
						type="button"
						className={styles.navButton}
						disabled={!canGoBack}
						aria-label="Back"
						onClick={handleBack}
					>
						<HiArrowLeft />
					</button>
					<button
						type="button"
						className={styles.navButton}
						disabled={!canGoForward}
						aria-label="Forward"
						onClick={handleForward}
					>
						<HiArrowRight />
					</button>
					<button
						type="button"
						className={styles.navButton}
						aria-label="Reload"
						onClick={handleReload}
					>
						<HiRefresh />
					</button>
				</div>
				<input
					className={styles.addressInput}
					type="text"
					value={addressInput}
					onChange={(e) => setAddressInput(e.target.value)}
					onKeyDown={handleAddressKeyDown}
					onFocus={(e) => e.target.select()}
					aria-label="Address bar"
					placeholder="Search or enter address"
				/>
				{isLoading && <span className={styles.loadingIndicator}>Loading…</span>}
			</form>
			{isBlocked ? (
				<div className={styles.fallback}>
					<p>
						This site cannot be embedded in the portfolio browser.
						Open it in your system browser to continue.
					</p>
					<a
						href={activeTab?.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						Open {displayUrl(activeTab?.url ?? '')}
					</a>
				</div>
			) : (
				<iframe
					ref={iframeRef}
					key={`${activeTabId}-${activeTab?.url}`}
					className={styles.browserFrame}
					src={activeTab?.url}
					title={activeTab?.title}
					sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
					referrerPolicy="no-referrer-when-downgrade"
					onLoad={() => setIsLoading(false)}
					onError={() => {
						setIsLoading(false);
						setFrameBlocked((prev) => ({
							...prev,
							[activeTabId]: true,
						}));
					}}
				/>
			)}
		</DraggableWindow>
	);
}

export default Firefox;
