import Image from 'next/image';
import { FormEvent, KeyboardEvent, useContext, useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import {
	displayUrl,
	FIREFOX_HOME_URL,
	normalizeUrl,
} from '../../../config/taskbar';
import { Context } from '../../../context/ContextProvider';
import { useWindowManager } from '../../../hooks/useWindowManager';
import { createFirefoxTab } from '../../../lib/firefoxTabs';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Firefox.module.css';

function Firefox() {
	const { firefoxTabsState, activeFirefoxTabIdState } = useContext(Context);
	const [tabs, setTabs] = firefoxTabsState;
	const [activeTabId, setActiveTabId] = activeFirefoxTabIdState;
	const { closeWindow } = useWindowManager();

	const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
	const [addressInput, setAddressInput] = useState(activeTab?.url ?? '');
	const [frameBlocked, setFrameBlocked] = useState<Record<string, boolean>>(
		{}
	);

	useEffect(() => {
		if (activeTab) {
			setAddressInput(activeTab.url);
		}
	}, [activeTab?.id, activeTab?.url]);

	const updateActiveTab = (url: string) => {
		setTabs((prev) =>
			prev.map((tab) =>
				tab.id === activeTabId
					? {
							...tab,
							url,
							title: displayUrl(url),
					  }
					: tab
			)
		);
		setFrameBlocked((prev) => ({ ...prev, [activeTabId]: false }));
	};

	const handleNavigate = (event?: FormEvent) => {
		event?.preventDefault();
		const url = normalizeUrl(addressInput);
		updateActiveTab(url);
	};

	const handleAddressKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleNavigate();
		}
	};

	const handleAddTab = () => {
		const newTab = createFirefoxTab(FIREFOX_HOME_URL, 'New Tab');
		setTabs((prev) => [...prev, newTab]);
		setActiveTabId(newTab.id);
		setAddressInput(newTab.url);
	};

	const handleCloseTab = (tabId: string) => {
		if (tabs.length === 1) {
			closeWindow('firefox');
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

	const isBlocked = frameBlocked[activeTabId];

	return (
		<DraggableWindow
			windowName="firefox"
			topTitle={`Mozilla Firefox — ${activeTab?.title ?? 'New Tab'}`}
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
						<span className={styles.tabTitle}>{tab.title}</span>
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
			</form>
			{isBlocked ? (
				<div className={styles.fallback}>
					<p>
						This site cannot be embedded here. Open it in a new tab
						instead.
					</p>
					<a
						href={activeTab?.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						Open {activeTab?.title}
					</a>
				</div>
			) : (
				<iframe
					key={activeTabId + activeTab?.url}
					className={styles.browserFrame}
					src={activeTab?.url}
					title={activeTab?.title}
					onError={() =>
						setFrameBlocked((prev) => ({
							...prev,
							[activeTabId]: true,
						}))
					}
				/>
			)}
		</DraggableWindow>
	);
}

export default Firefox;
