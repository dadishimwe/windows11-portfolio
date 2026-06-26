export type ReplayScript = {
	lines: string[];
	charDelayMs?: number;
	lineDelayMs?: number;
	problems?: Array<{
		file: string;
		line: number;
		column: number;
		message: string;
		severity?: 'error' | 'warning';
	}>;
};

function key(workspaceId: string, fileName: string): string {
	return `${workspaceId}::${fileName}`;
}

const replays: Record<string, ReplayScript> = {
	[key('network-automation', 'starlink_monitor.py')]: {
		lines: [
			'$ python starlink_monitor.py',
			'Site: norrsken-remote-01',
			'Samples: 7',
			'Latency ms — min: 38, p50: 42, p95: 198, max: 198',
			'Mean: 79.7 ms',
			'Threshold p95: 120 ms',
			'Status: DEGRADED',
			'Action: open ticket — investigate weather / obstruction / PoP routing',
		],
		charDelayMs: 8,
	},
	[key('network-automation', 'fortigate_probe.py')]: {
		lines: [
			'$ python fortigate_probe.py',
			'Probing https://fgt-edge-01.example.com/api/v2/monitor/system/status',
			'Serial:   FGT60FTK22000000',
			'Version:  v7.4.5',
			'CPU:      18.2%',
			'Memory:   41.5%',
			'Sessions: 1240',
			'Health:   PASS',
		],
		charDelayMs: 8,
	},
	[key('ml-projects', 'vigil_classifier.py')]: {
		lines: [
			'$ python vigil_classifier.py',
			'Vigil WAN path scoring',
			'----------------------------------------',
			'starlink     score= -3.42  latency=48ms',
			'fiber        score=  3.52  latency=12ms',
			'lte_backup   score= -8.96  latency=65ms',
			'----------------------------------------',
			'Recommended active path: fiber',
		],
		charDelayMs: 6,
	},
	[key('smartview-snippets', 'peplink_status.py')]: {
		lines: [
			'$ python peplink_status.py',
			'Peplink Balance — SD-WAN status',
			'Model: Balance 580 | Firmware: 8.5.0',
			'--------------------------------------------------------',
			'WAN1-Starlink    connected  lat= 52ms  ↓ 178.4 Mbps  ↑  22.1 Mbps',
			'WAN2-Fiber       connected  lat= 11ms  ↓ 492.0 Mbps  ↑  98.3 Mbps',
			'WAN3-LTE         standby    lat=  0ms  ↓   0.0 Mbps  ↑   0.0 Mbps',
			'--------------------------------------------------------',
			'Active links: 2 | Load balancing: bandwidth',
		],
		charDelayMs: 6,
	},
	[key('smartview-snippets', 'hello_peplink.c')]: {
		lines: [
			'$ gcc -Wall -o hello_peplink hello_peplink.c',
			'$ ./hello_peplink',
			'Device: Peplink Balance 580',
			'WAN links configured: 3',
			'Status: online — SD-WAN ready',
		],
		charDelayMs: 8,
	},
};

export function getReplayScript(
	workspaceId: string,
	fileName: string
): ReplayScript | undefined {
	return replays[key(workspaceId, fileName)];
}

export function hasReplay(workspaceId: string, fileName: string): boolean {
	return Boolean(replays[key(workspaceId, fileName)]);
}
