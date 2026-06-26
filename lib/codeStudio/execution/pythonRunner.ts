const RUN_TIMEOUT_MS = 5000;

type WorkerSuccess = {
	id: string;
	ok: true;
	stdout: string;
	stderr: string;
};

type WorkerFailure = {
	id: string;
	ok: false;
	error: string;
};

type WorkerResponse = WorkerSuccess | WorkerFailure;

let worker: Worker | null = null;
let nextId = 0;

function getWorker(): Worker {
	if (!worker) {
		worker = new Worker('/workers/pythonRunner.worker.js');
	}
	return worker;
}

export type PythonRunResult = {
	stdout: string;
	stderr: string;
	error?: string;
	timedOut?: boolean;
};

export function runPythonCode(code: string): Promise<PythonRunResult> {
	return new Promise((resolve) => {
		const id = `run-${nextId++}`;
		const pyWorker = getWorker();
		let settled = false;

		const timer = window.setTimeout(() => {
			if (settled) return;
			settled = true;
			pyWorker.onmessage = null;
			resolve({
				stdout: '',
				stderr: '',
				error: 'Execution timed out (5s limit)',
				timedOut: true,
			});
		}, RUN_TIMEOUT_MS);

		const handleMessage = (event: MessageEvent<WorkerResponse>) => {
			if (event.data.id !== id || settled) return;
			settled = true;
			window.clearTimeout(timer);
			pyWorker.onmessage = null;

			if (event.data.ok) {
				resolve({
					stdout: event.data.stdout,
					stderr: event.data.stderr,
				});
				return;
			}

			resolve({
				stdout: '',
				stderr: '',
				error: event.data.error,
			});
		};

		pyWorker.onmessage = handleMessage;
		pyWorker.postMessage({ id, code });
	});
}

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

let statusListeners: Array<(status: PyodideStatus) => void> = [];

export function subscribePyodideStatus(listener: (status: PyodideStatus) => void) {
	statusListeners.push(listener);
	return () => {
		statusListeners = statusListeners.filter((item) => item !== listener);
	};
}

function notifyStatus(status: PyodideStatus) {
	statusListeners.forEach((listener) => listener(status));
}

export function preloadPyodide(): void {
	const pyWorker = getWorker();
	pyWorker.postMessage({ id: 'preload', type: 'preload' });

	const handlePreload = (event: MessageEvent<{ type?: string; status?: string }>) => {
		if (event.data.type === 'preload') {
			if (event.data.status === 'loading') notifyStatus('loading');
			if (event.data.status === 'ready') notifyStatus('ready');
			if (event.data.status === 'error') notifyStatus('error');
			if (event.data.status === 'ready' || event.data.status === 'error') {
				pyWorker.removeEventListener('message', handlePreload);
			}
		}
	};

	pyWorker.addEventListener('message', handlePreload);
}
