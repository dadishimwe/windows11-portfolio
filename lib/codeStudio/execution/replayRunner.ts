import { ReplayScript } from '../../../config/codeStudio/replays';

export type ReplayCallbacks = {
	onUpdate: (text: string) => void;
	onComplete: () => void;
};

export function runReplay(
	script: ReplayScript,
	callbacks: ReplayCallbacks
): () => void {
	let cancelled = false;
	const charDelay = script.charDelayMs ?? 6;
	const lineDelay = script.lineDelayMs ?? 120;
	const completedLines: string[] = [];

	const cancel = () => {
		cancelled = true;
	};

	async function play() {
		for (const fullLine of script.lines) {
			if (cancelled) return;

			let partial = '';
			for (let i = 0; i < fullLine.length; i += 1) {
				if (cancelled) return;
				partial += fullLine[i];
				callbacks.onUpdate([...completedLines, partial].join('\n'));
				await sleep(charDelay);
			}

			completedLines.push(fullLine);
			callbacks.onUpdate(completedLines.join('\n'));
			await sleep(lineDelay);
		}

		if (!cancelled) callbacks.onComplete();
	}

	void play();
	return cancel;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}
