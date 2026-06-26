/* global loadPyodide */
importScripts(
	'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
);

const PYODIDE_INDEX =
	'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

/** @type {Promise<any> | null} */
let pyodideReady = null;

function postStatus(status) {
	self.postMessage({ type: 'preload', status });
}

async function ensurePyodide() {
	if (!pyodideReady) {
		postStatus('loading');
		pyodideReady = loadPyodide({ indexURL: PYODIDE_INDEX });
	}
	try {
		const pyodide = await pyodideReady;
		postStatus('ready');
		return pyodide;
	} catch (error) {
		postStatus('error');
		throw error;
	}
}

async function runUserCode(code) {
	const pyodide = await ensurePyodide();

	await pyodide.runPythonAsync(`
import sys
from io import StringIO

def __portfolio_run_user_code__(source):
    stdout_capture = StringIO()
    stderr_capture = StringIO()
    old_stdout, old_stderr = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = stdout_capture, stderr_capture
    try:
        exec(compile(source, "<stdin>", "exec"), {"__name__": "__main__"})
    except Exception:
        import traceback
        traceback.print_exc(file=stderr_capture)
    finally:
        sys.stdout, sys.stderr = old_stdout, old_stderr
    return stdout_capture.getvalue(), stderr_capture.getvalue()
`);

	const result = pyodide.globals.get('__portfolio_run_user_code__')(code);
	const stdout = result.get(0);
	const stderr = result.get(1);
	result.destroy();

	return { stdout: String(stdout), stderr: String(stderr) };
}

self.onmessage = async (event) => {
	const data = event.data || {};

	if (data.type === 'preload') {
		try {
			await ensurePyodide();
		} catch (error) {
			postStatus('error');
		}
		return;
	}

	const { id, code } = data;
	if (!id || typeof code !== 'string') return;

	try {
		const { stdout, stderr } = await runUserCode(code);
		self.postMessage({ id, ok: true, stdout, stderr });
	} catch (error) {
		self.postMessage({
			id,
			ok: false,
			error: error instanceof Error ? error.message : String(error),
		});
	}
};
