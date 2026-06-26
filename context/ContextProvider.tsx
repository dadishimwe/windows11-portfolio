import React, { createContext, useState, Dispatch, SetStateAction } from 'react';
import { DEFAULT_EXPLORER_PATH } from '../config/explorerRoutes';
import { initialOpenWindows, OpenWindows } from '../config/openWindows';
import {
	initialMediaPlayerState,
	MediaPlayerState,
} from '../config/mediaPlayer';
import {
	initialPdfViewerState,
	PdfViewerState,
} from '../config/pdfViewer';
import { buildInitialFirefoxTabs, FirefoxTab } from '../lib/firefoxTabs';

type LastPos = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type PositionState = {
	[key: string]: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
};

type WindowPriority = {
	[key: string]: number;
};

type Maximized = {
	[key: string]: boolean | null;
};

type Minimized = {
	[key: string]: boolean;
};

type ContextType = {
	maximizedState: [Maximized, Dispatch<SetStateAction<Maximized>>];
	minimizedState: [Minimized, Dispatch<SetStateAction<Minimized>>];
	openWindowsState: [OpenWindows, Dispatch<SetStateAction<OpenWindows>>];
	explorerPathState: [string, Dispatch<SetStateAction<string>>];
	firefoxTabsState: [FirefoxTab[], Dispatch<SetStateAction<FirefoxTab[]>>];
	activeFirefoxTabIdState: [string, Dispatch<SetStateAction<string>>];
	explorerHistoryState: [string[], Dispatch<SetStateAction<string[]>>];
	indexState: [number, Dispatch<SetStateAction<number>>];
	wasManualState: [boolean, Dispatch<SetStateAction<boolean>>];
	positionState: [PositionState, Dispatch<SetStateAction<PositionState>>];
	windowPriorityState: [
		WindowPriority,
		Dispatch<SetStateAction<WindowPriority>>
	];
	lastPosState: [LastPos, Dispatch<SetStateAction<LastPos>>];
	mediaPlayerState: [
		MediaPlayerState,
		Dispatch<SetStateAction<MediaPlayerState>>,
	];
	pdfViewerState: [PdfViewerState, Dispatch<SetStateAction<PdfViewerState>>];
};

const initialPriority = {
	fileExplorer: 101,
};

const initialMaximized = {
	fileExplorer: null,
	mediaPlayer: null,
	notepad: null,
	terminal: null,
	firefox: null,
	mail: null,
	snake: null,
	pdfViewer: null,
};

const initialPosition = {
	fileExplorer: {
		x: 0,
		y: 0,
		width: 880,
		height: 550,
	},
	mediaPlayer: {
		x: 0,
		y: 0,
		width: 880,
		height: 550,
	},
	notepad: {
		x: 0,
		y: 0,
		width: 880,
		height: 550,
	},
	terminal: {
		x: 0,
		y: 0,
		width: 880,
		height: 550,
	},
	firefox: {
		x: 0,
		y: 0,
		width: 960,
		height: 600,
	},
	mail: {
		x: 0,
		y: 0,
		width: 1000,
		height: 620,
	},
	snake: {
		x: 0,
		y: 0,
		width: 720,
		height: 520,
	},
	pdfViewer: {
		x: 0,
		y: 0,
		width: 880,
		height: 620,
	},
};

const initialLastPos = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
};

const initialMinimized = {
	fileExplorer: false,
	mediaPlayer: false,
	notepad: false,
	terminal: false,
	firefox: false,
	mail: false,
	snake: false,
	pdfViewer: false,
};

const initialFirefoxTabs = buildInitialFirefoxTabs();

const initialState: ContextType = {
	maximizedState: [initialMaximized, () => {}],
	minimizedState: [initialMinimized, () => {}],
	openWindowsState: [initialOpenWindows, () => {}],
	explorerPathState: [DEFAULT_EXPLORER_PATH, () => {}],
	firefoxTabsState: [initialFirefoxTabs, () => {}],
	activeFirefoxTabIdState: [initialFirefoxTabs[0].id, () => {}],
	explorerHistoryState: [[], () => {}],
	indexState: [0, () => {}],
	wasManualState: [false, () => {}],
	positionState: [initialPosition, () => {}],
	windowPriorityState: [initialPriority, () => {}],
	lastPosState: [initialLastPos, () => {}],
	mediaPlayerState: [initialMediaPlayerState, () => {}],
	pdfViewerState: [initialPdfViewerState, () => {}],
};

export const Context = createContext<ContextType>(initialState);

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [maximized, setMaximized] = useState<Maximized>(initialMaximized);
	const [minimized, setMinimized] = useState<Minimized>(initialMinimized);
	const [openWindows, setOpenWindows] =
		useState<OpenWindows>(initialOpenWindows);
	const [explorerPath, setExplorerPath] = useState(DEFAULT_EXPLORER_PATH);
	const [firefoxTabs, setFirefoxTabs] =
		useState<FirefoxTab[]>(initialFirefoxTabs);
	const [activeFirefoxTabId, setActiveFirefoxTabId] = useState(
		initialFirefoxTabs[0].id
	);
	const [explorerHistory, setExplorerHistory] = useState<string[]>([]);
	const [index, setIndex] = useState<number>(0);
	const [position, setPosition] = useState<PositionState>(initialPosition);
	const [wasManual, setWasManual] = useState<boolean>(false);
	const [windowPriority, setWindowPriority] =
		useState<WindowPriority>(initialPriority);
	const [lastPos, setLastPos] = useState<LastPos>(initialLastPos);
	const [mediaPlayer, setMediaPlayer] =
		useState<MediaPlayerState>(initialMediaPlayerState);
	const [pdfViewer, setPdfViewer] =
		useState<PdfViewerState>(initialPdfViewerState);

	const appContext: ContextType = {
		maximizedState: [maximized, setMaximized],
		minimizedState: [minimized, setMinimized],
		openWindowsState: [openWindows, setOpenWindows],
		explorerPathState: [explorerPath, setExplorerPath],
		firefoxTabsState: [firefoxTabs, setFirefoxTabs],
		activeFirefoxTabIdState: [activeFirefoxTabId, setActiveFirefoxTabId],
		explorerHistoryState: [explorerHistory, setExplorerHistory],
		indexState: [index, setIndex],
		wasManualState: [wasManual, setWasManual],
		positionState: [position, setPosition],
		windowPriorityState: [windowPriority, setWindowPriority],
		lastPosState: [lastPos, setLastPos],
		mediaPlayerState: [mediaPlayer, setMediaPlayer],
		pdfViewerState: [pdfViewer, setPdfViewer],
	};

	return <Context.Provider value={appContext}>{children}</Context.Provider>;
};

export default ContextProvider;
