import { CodeLanguage } from './languages';

export type WorkspaceFile = {
	path: string;
	language: CodeLanguage;
	content: string;
};

export type CodeWorkspace = {
	id: string;
	name: string;
	description: string;
	files: WorkspaceFile[];
	defaultFile: string;
};

const networkAutomation: CodeWorkspace = {
	id: 'network-automation',
	name: 'Network Automation',
	description: 'Starlink monitoring and FortiGate health patterns from field work.',
	defaultFile: 'starlink_monitor.py',
	files: [
		{
			path: 'README.md',
			language: 'markdown',
			content: `# Network Automation

Sample scripts inspired by Norrsken-style deployments and Fortinet operations.

- **starlink_monitor.py** — latency percentile analysis from CSV samples
- **fortigate_probe.py** — REST API health-check pattern (mocked endpoints)

Press **F5** or click **Run** to execute the active file.
`,
		},
		{
			path: 'starlink_monitor.py',
			language: 'python',
			content: `#!/usr/bin/env python3
"""Starlink latency monitor — percentile analysis from CSV samples."""

import csv
import statistics
from io import StringIO

# Simulated export from a remote site (ms)
SAMPLE_CSV = """timestamp,latency_ms,packet_loss
2026-06-23T08:00:00Z,42,0
2026-06-23T08:05:00Z,38,0
2026-06-23T08:10:00Z,156,0.2
2026-06-23T08:15:00Z,44,0
2026-06-23T08:20:00Z,41,0
2026-06-23T08:25:00Z,198,0.5
2026-06-23T08:30:00Z,39,0
"""

THRESHOLD_P95_MS = 120
SITE = "norrsken-remote-01"


def load_samples(csv_text: str) -> list[float]:
    reader = csv.DictReader(StringIO(csv_text))
    return [float(row["latency_ms"]) for row in reader]


def summarize(latencies: list[float]) -> dict:
    sorted_vals = sorted(latencies)
    p95_index = max(0, int(len(sorted_vals) * 0.95) - 1)
    return {
        "count": len(latencies),
        "min": min(latencies),
        "max": max(latencies),
        "p50": statistics.median(latencies),
        "p95": sorted_vals[p95_index],
        "mean": round(statistics.mean(latencies), 1),
    }


def main() -> None:
    latencies = load_samples(SAMPLE_CSV)
    stats = summarize(latencies)
    status = "OK" if stats["p95"] <= THRESHOLD_P95_MS else "DEGRADED"

    print(f"Site: {SITE}")
    print(f"Samples: {stats['count']}")
    print(f"Latency ms — min: {stats['min']}, p50: {stats['p50']}, p95: {stats['p95']}, max: {stats['max']}")
    print(f"Mean: {stats['mean']} ms")
    print(f"Threshold p95: {THRESHOLD_P95_MS} ms")
    print(f"Status: {status}")

    if status == "DEGRADED":
        print("Action: open ticket — investigate weather / obstruction / PoP routing")


if __name__ == "__main__":
    main()
`,
		},
		{
			path: 'fortigate_probe.py',
			language: 'python',
			content: `#!/usr/bin/env python3
"""FortiGate health probe — REST pattern (mocked for portfolio demo)."""

from dataclasses import dataclass
from typing import Any

# Production: FORTIGATE_HOST + API token from vault — never commit secrets
FORTIGATE_HOST = "fgt-edge-01.example.com"
API_VERSION = "v2"


@dataclass
class ProbeResult:
    host: str
    serial: str
    version: str
    cpu: float
    memory: float
    sessions: int
    ok: bool


def mock_get_status(host: str) -> dict[str, Any]:
    """Simulates GET /api/v2/monitor/system/status"""
    return {
        "serial": "FGT60FTK22000000",
        "version": "v7.4.5",
        "results": {
            "cpu": 18.2,
            "mem": 41.5,
            "session": 1240,
        },
    }


def evaluate_status(payload: dict[str, Any]) -> ProbeResult:
    results = payload["results"]
    cpu = float(results["cpu"])
    memory = float(results["memory"])
    sessions = int(results["session"])
    ok = cpu < 80 and memory < 85

    return ProbeResult(
        host=FORTIGATE_HOST,
        serial=payload["serial"],
        version=payload["version"],
        cpu=cpu,
        memory=memory,
        sessions=sessions,
        ok=ok,
    )


def main() -> None:
    print(f"Probing https://{FORTIGATE_HOST}/api/{API_VERSION}/monitor/system/status")
    payload = mock_get_status(FORTIGATE_HOST)
    result = evaluate_status(payload)

    print(f"Serial:   {result.serial}")
    print(f"Version:  {result.version}")
    print(f"CPU:      {result.cpu}%")
    print(f"Memory:   {result.memory}%")
    print(f"Sessions: {result.sessions}")
    print(f"Health:   {'PASS' if result.ok else 'FAIL'}")

    if not result.ok:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
`,
		},
	],
};

const mlProjects: CodeWorkspace = {
	id: 'ml-projects',
	name: 'ML Projects',
	description: 'WAN routing classifier concept — pure Python, no heavy deps.',
	defaultFile: 'vigil_classifier.py',
	files: [
		{
			path: 'README.md',
			language: 'markdown',
			content: `# ML Projects

Stripped-down classifier logic for WAN path selection (Vigil / SmartView concept).

- **vigil_classifier.py** — rule + weight-based scoring without sklearn
- Full pipeline uses pandas/sklearn in production notebooks

Run with **F5**.
`,
		},
		{
			path: 'requirements.txt',
			language: 'text',
			content: `# Production dependencies (not available in browser Pyodide)
pandas>=2.0
scikit-learn>=1.4
numpy>=1.26
`,
		},
		{
			path: 'vigil_classifier.py',
			language: 'python',
			content: `#!/usr/bin/env python3
"""Vigil WAN classifier — lightweight scoring demo (no sklearn)."""

from dataclasses import dataclass

# Feature weights learned offline (illustrative)
WEIGHTS = {
    "latency_ms": -0.04,
    "jitter_ms": -0.08,
    "loss_pct": -0.9,
    "throughput_mbps": 0.02,
}

LABELS = ("starlink", "fiber", "lte_backup")


@dataclass
class LinkSample:
    name: str
    latency_ms: float
    jitter_ms: float
    loss_pct: float
    throughput_mbps: float


def score(sample: LinkSample) -> float:
    return (
        WEIGHTS["latency_ms"] * sample.latency_ms
        + WEIGHTS["jitter_ms"] * sample.jitter_ms
        + WEIGHTS["loss_pct"] * sample.loss_pct
        + WEIGHTS["throughput_mbps"] * sample.throughput_mbps
    )


def classify(samples: list[LinkSample]) -> str:
    ranked = sorted(samples, key=score, reverse=True)
    return ranked[0].name


def main() -> None:
    candidates = [
        LinkSample("starlink", 48, 6, 0.1, 180),
        LinkSample("fiber", 12, 1, 0.0, 500),
        LinkSample("lte_backup", 65, 14, 0.4, 40),
    ]

    print("Vigil WAN path scoring")
    print("-" * 40)
    for sample in candidates:
        print(f"{sample.name:12} score={score(sample):6.2f}  latency={sample.latency_ms}ms")

    choice = classify(candidates)
    print("-" * 40)
    print(f"Recommended active path: {choice}")


if __name__ == "__main__":
    main()
`,
		},
	],
};

const smartViewSnippets: CodeWorkspace = {
	id: 'smartview-snippets',
	name: 'SmartView Snippets',
	description: 'Peplink / SD-WAN sketches and embedded C sample.',
	defaultFile: 'peplink_status.py',
	files: [
		{
			path: 'README.md',
			language: 'markdown',
			content: `# SmartView Snippets

Peplink SD-WAN status sketch and embedded C hello (C runs in Phase 3).

- **peplink_status.py** — multi-WAN summary
- **hello_peplink.c** — embedded networking sample (replay until compiler ships)
`,
		},
		{
			path: 'peplink_status.py',
			language: 'python',
			content: `#!/usr/bin/env python3
"""Peplink Balance status summary — mock InControl API response."""

from dataclasses import dataclass


@dataclass
class WanLink:
    name: str
    status: str
    latency_ms: int
    download_mbps: float
    upload_mbps: float


def main() -> None:
    links = [
        WanLink("WAN1-Starlink", "connected", 52, 178.4, 22.1),
        WanLink("WAN2-Fiber", "connected", 11, 492.0, 98.3),
        WanLink("WAN3-LTE", "standby", 0, 0.0, 0.0),
    ]

    print("Peplink Balance — SD-WAN status")
    print("Model: Balance 580 | Firmware: 8.5.0")
    print("-" * 56)
    for link in links:
        print(
            f"{link.name:16} {link.status:10} "
            f"lat={link.latency_ms:3}ms  "
            f"↓{link.download_mbps:6.1f} Mbps  ↑{link.upload_mbps:5.1f} Mbps"
        )

    active = [link for link in links if link.status == "connected"]
    print("-" * 56)
    print(f"Active links: {len(active)} | Load balancing: bandwidth")


if __name__ == "__main__":
    main()
`,
		},
		{
			path: 'hello_peplink.c',
			language: 'c',
			content: `/*
 * hello_peplink.c — embedded networking sample
 * Compile: gcc -Wall -o hello_peplink hello_peplink.c
 * Phase 3: live compile via Piston API
 */
#include <stdio.h>

#define DEVICE "Peplink Balance 580"
#define WAN_COUNT 3

int main(void) {
    printf("Device: %s\\n", DEVICE);
    printf("WAN links configured: %d\\n", WAN_COUNT);
    printf("Status: online — SD-WAN ready\\n");
    return 0;
}
`,
		},
	],
};

export const codeWorkspaces: CodeWorkspace[] = [
	networkAutomation,
	mlProjects,
	smartViewSnippets,
];

export const defaultWorkspaceId = networkAutomation.id;

export function getWorkspaceById(id: string): CodeWorkspace | undefined {
	return codeWorkspaces.find((workspace) => workspace.id === id);
}

export function getDefaultFileContent(
	workspaceId: string,
	filePath: string
): string | undefined {
	const workspace = getWorkspaceById(workspaceId);
	const file = workspace?.files.find((item) => item.path === filePath);
	return file?.content;
}
