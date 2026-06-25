export const snakeGrid = {
	cols: 22,
	rows: 14,
	cellSize: 20,
} as const;

/** Spawn a cert pickup every N packets eaten. */
export const certPickupInterval = 4;

export type SnakeSpeedId = 'slow' | 'normal' | 'fast' | 'turbo';

export type SnakeSpeedPreset = {
	id: SnakeSpeedId;
	label: string;
	tickMs: number;
};

export const snakeSpeedPresets: SnakeSpeedPreset[] = [
	{ id: 'slow', label: 'Slow', tickMs: 165 },
	{ id: 'normal', label: 'Normal', tickMs: 110 },
	{ id: 'fast', label: 'Fast', tickMs: 75 },
	{ id: 'turbo', label: 'Turbo', tickMs: 50 },
];

export const defaultSnakeSpeedId: SnakeSpeedId = 'normal';

export function getSnakeTickMs(speedId: SnakeSpeedId): number {
	return (
		snakeSpeedPresets.find((preset) => preset.id === speedId)?.tickMs ??
		snakeSpeedPresets[1].tickMs
	);
}

export const snakeAppMeta = {
	title: 'Packet Snake',
	icon: '/svg/snake.svg',
	windowName: 'snake' as const,
};

/** Fixed LAN firewall segments (inner obstacles). */
export const lanFirewallBlocks: { x: number; y: number }[] = [
	{ x: 7, y: 4 },
	{ x: 8, y: 4 },
	{ x: 9, y: 4 },
	{ x: 14, y: 9 },
	{ x: 15, y: 9 },
	{ x: 16, y: 9 },
	{ x: 10, y: 7 },
	{ x: 11, y: 7 },
];
