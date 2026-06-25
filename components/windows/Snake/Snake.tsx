import Image from 'next/image';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { certifications } from '../../../config/certifications';
import {
	certPickupInterval,
	lanFirewallBlocks,
	snakeAppMeta,
	snakeGrid,
} from '../../../config/apps/snake';
import {
	getSnakeHighScore,
	getUnlockedCertIds,
	recordSnakeGame,
	unlockCert,
} from '../../../lib/snakeSession';
import DraggableWindow from '../../utils/DraggableWindow/DraggableWindow';
import styles from './Snake.module.css';

type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';
type Food = { x: number; y: number; kind: 'packet' | 'cert'; certId?: string };
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

const TICK_MS = 110;
const OPPOSITE: Record<Direction, Direction> = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
};

function isDmzWall(x: number, y: number): boolean {
	return (
		x <= 0 ||
		y <= 0 ||
		x >= snakeGrid.cols - 1 ||
		y >= snakeGrid.rows - 1
	);
}

function isLanWall(x: number, y: number): boolean {
	return lanFirewallBlocks.some((block) => block.x === x && block.y === y);
}

function isBlocked(x: number, y: number): boolean {
	return isDmzWall(x, y) || isLanWall(x, y);
}

function pointsEqual(a: Point, b: Point) {
	return a.x === b.x && a.y === b.y;
}

function initialSnake(): Point[] {
	const y = Math.floor(snakeGrid.rows / 2);
	const x = Math.floor(snakeGrid.cols / 2);
	return [
		{ x, y },
		{ x: x - 1, y },
		{ x: x - 2, y },
	];
}

function Snake({ onClose }: { onClose?: () => void }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const boardRef = useRef<HTMLDivElement>(null);
	const snakeRef = useRef<Point[]>(initialSnake());
	const directionRef = useRef<Direction>('right');
	const queuedDirectionRef = useRef<Direction>('right');
	const foodRef = useRef<Food | null>(null);
	const packetsEatenRef = useRef(0);
	const scoreRef = useRef(0);

	const [status, setStatus] = useState<GameStatus>('idle');
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [unlockedCerts, setUnlockedCerts] = useState<string[]>([]);
	const [gameOverMessage, setGameOverMessage] = useState('');

	const certRewards = useMemo(
		() =>
			certifications.map((cert) => ({
				id: cert.id,
				name: cert.name,
				image: cert.badgeImageUrl,
			})),
		[]
	);

	const refreshMeta = useCallback(() => {
		setHighScore(getSnakeHighScore());
		setUnlockedCerts(getUnlockedCertIds());
	}, []);

	useEffect(() => {
		refreshMeta();
	}, [refreshMeta]);

	const spawnFood = useCallback((snake: Point[], packetsEaten: number) => {
		const lockedCerts = certifications
			.map((c) => c.id)
			.filter((id) => !getUnlockedCertIds().includes(id));

		const wantCert =
			packetsEaten > 0 &&
			packetsEaten % certPickupInterval === 0 &&
			lockedCerts.length > 0;

		const freeCells: Point[] = [];
		for (let y = 1; y < snakeGrid.rows - 1; y += 1) {
			for (let x = 1; x < snakeGrid.cols - 1; x += 1) {
				if (isLanWall(x, y)) continue;
				if (snake.some((segment) => segment.x === x && segment.y === y)) {
					continue;
				}
				freeCells.push({ x, y });
			}
		}

		if (!freeCells.length) return null;

		const cell = freeCells[Math.floor(Math.random() * freeCells.length)];

		if (wantCert) {
			const certId =
				lockedCerts[Math.floor(Math.random() * lockedCerts.length)];
			return { ...cell, kind: 'cert' as const, certId };
		}

		return { ...cell, kind: 'packet' as const };
	}, []);

	const drawBoard = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const { cols, rows, cellSize } = snakeGrid;
		canvas.width = cols * cellSize;
		canvas.height = rows * cellSize;

		ctx.fillStyle = '#0f1410';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		for (let y = 0; y < rows; y += 1) {
			for (let x = 0; x < cols; x += 1) {
				const px = x * cellSize;
				const py = y * cellSize;

				if (isDmzWall(x, y)) {
					ctx.fillStyle = '#3a1515';
					ctx.fillRect(px, py, cellSize, cellSize);
					ctx.strokeStyle = '#ff5555';
					ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
				} else if (isLanWall(x, y)) {
					ctx.fillStyle = '#2a2410';
					ctx.fillRect(px, py, cellSize, cellSize);
					ctx.strokeStyle = '#fbbf24';
					ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
				} else {
					ctx.strokeStyle = 'rgb(85 255 85 / 8%)';
					ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
				}
			}
		}

		ctx.fillStyle = '#ff7777';
		ctx.font = '9px monospace';
		ctx.fillText('DMZ', cellSize + 2, 10);
		ctx.fillStyle = '#fbbf24';
		ctx.fillText('LAN', cellSize * 3, cellSize * 3 + 4);

		const food = foodRef.current;
		if (food) {
			ctx.fillStyle = food.kind === 'cert' ? '#fbbf24' : '#55ff55';
			const pad = food.kind === 'cert' ? 3 : 4;
			ctx.fillRect(
				food.x * cellSize + pad,
				food.y * cellSize + pad,
				cellSize - pad * 2,
				cellSize - pad * 2
			);
			if (food.kind === 'cert') {
				ctx.fillStyle = '#1a1400';
				ctx.font = 'bold 9px monospace';
				ctx.fillText(
					'C',
					food.x * cellSize + cellSize / 2 - 3,
					food.y * cellSize + cellSize / 2 + 3
				);
			}
		}

		snakeRef.current.forEach((segment, index) => {
			const isHead = index === 0;
			ctx.fillStyle = isHead ? '#7dff7d' : '#3ddc3d';
			ctx.fillRect(
				segment.x * cellSize + 1,
				segment.y * cellSize + 1,
				cellSize - 2,
				cellSize - 2
			);
			if (isHead) {
				ctx.fillStyle = '#0d0d0d';
				ctx.fillRect(
					segment.x * cellSize + cellSize - 6,
					segment.y * cellSize + 5,
					3,
					3
				);
			}
		});
	}, []);

	const resetGame = useCallback(() => {
		snakeRef.current = initialSnake();
		directionRef.current = 'right';
		queuedDirectionRef.current = 'right';
		packetsEatenRef.current = 0;
		scoreRef.current = 0;
		setScore(0);
		setGameOverMessage('');
		foodRef.current = spawnFood(snakeRef.current, 0);
		drawBoard();
	}, [drawBoard, spawnFood]);

	const startGame = useCallback(() => {
		resetGame();
		setStatus('playing');
		boardRef.current?.focus();
	}, [resetGame]);

	const endGame = useCallback(() => {
		const result = recordSnakeGame(scoreRef.current);
		setGameOverMessage(
			`Connection timed out. Ping: ${result.pingMs}ms`
		);
		setStatus('gameover');
		refreshMeta();
	}, [refreshMeta]);

	const tick = useCallback(() => {
		const direction = queuedDirectionRef.current;
		directionRef.current = direction;

		const head = snakeRef.current[0];
		const nextHead: Point = { ...head };

		switch (direction) {
			case 'up':
				nextHead.y -= 1;
				break;
			case 'down':
				nextHead.y += 1;
				break;
			case 'left':
				nextHead.x -= 1;
				break;
			case 'right':
				nextHead.x += 1;
				break;
			default:
				break;
		}

		if (isBlocked(nextHead.x, nextHead.y)) {
			endGame();
			return;
		}

		if (snakeRef.current.some((segment) => pointsEqual(segment, nextHead))) {
			endGame();
			return;
		}

		const newSnake = [nextHead, ...snakeRef.current];
		const food = foodRef.current;

		if (food && pointsEqual(nextHead, food)) {
			if (food.kind === 'cert' && food.certId) {
				const unlocked = unlockCert(food.certId);
				setUnlockedCerts(unlocked);
				scoreRef.current += 5;
			} else {
				scoreRef.current += 1;
				packetsEatenRef.current += 1;
			}
			setScore(scoreRef.current);
			foodRef.current = spawnFood(newSnake, packetsEatenRef.current);
		} else {
			newSnake.pop();
		}

		snakeRef.current = newSnake;
		drawBoard();
	}, [drawBoard, endGame, spawnFood]);

	useEffect(() => {
		drawBoard();
	}, [drawBoard]);

	useEffect(() => {
		if (status !== 'playing') return undefined;

		const id = window.setInterval(tick, TICK_MS);
		return () => window.clearInterval(id);
	}, [status, tick]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		const key = event.key.toLowerCase();
		let next: Direction | null = null;

		if (key === 'arrowup' || key === 'w') next = 'up';
		if (key === 'arrowdown' || key === 's') next = 'down';
		if (key === 'arrowleft' || key === 'a') next = 'left';
		if (key === 'arrowright' || key === 'd') next = 'right';

		if (next && next !== OPPOSITE[directionRef.current]) {
			event.preventDefault();
			queuedDirectionRef.current = next;
		}

		if (key === ' ' || key === 'p') {
			event.preventDefault();
			if (status === 'playing') setStatus('paused');
			else if (status === 'paused') setStatus('playing');
		}

		if (key === 'enter' && (status === 'idle' || status === 'gameover')) {
			event.preventDefault();
			startGame();
		}
	};

	const statusLabel =
		status === 'playing'
			? 'Routing packets…'
			: status === 'paused'
			? 'Paused'
			: status === 'gameover'
			? gameOverMessage
			: 'Press Enter or Start to route packets';

	return (
		<DraggableWindow
			windowName="snake"
			topTitle={snakeAppMeta.title}
			topIcon={
				<Image
					src={snakeAppMeta.icon}
					alt=""
					width={20}
					height={20}
				/>
			}
			onClose={onClose}
		>
			<div className={styles.shell}>
				<aside className={styles.sidebar}>
					<h2 className={styles.sidebarTitle}>Cert pickups</h2>
					<p className={styles.sidebarHint}>
						Collect gold cert cells every {certPickupInterval}{' '}
						packets to unlock badges here.
					</p>
					<ul className={styles.certList}>
						{certRewards.map((cert) => {
							const unlocked = unlockedCerts.includes(cert.id);
							return (
								<li
									key={cert.id}
									className={`${styles.certItem} ${
										unlocked ? styles.certUnlocked : ''
									}`}
								>
									{cert.image ? (
										<Image
											src={cert.image}
											alt=""
											width={28}
											height={28}
											className={styles.certBadge}
										/>
									) : (
										<span className={styles.certPlaceholder}>
											🔒
										</span>
									)}
									<span className={styles.certName}>
										{unlocked ? cert.name : 'Locked'}
									</span>
								</li>
							);
						})}
					</ul>
					<p className={styles.terminalHint}>
						High scores →{' '}
						<code>cat /var/games/snake.log</code>
					</p>
				</aside>

				<div className={styles.gamePane}>
					<div className={styles.hud}>
						<div>
							<span className={styles.hudLabel}>Score</span>
							<strong>{score}</strong>
						</div>
						<div>
							<span className={styles.hudLabel}>Best</span>
							<strong>{highScore}</strong>
						</div>
						<p className={styles.statusLine}>{statusLabel}</p>
					</div>

					<div
						ref={boardRef}
						className={styles.board}
						tabIndex={0}
						onKeyDown={handleKeyDown}
						role="application"
						aria-label="Packet Snake game board"
					>
						<canvas ref={canvasRef} className={styles.canvas} />
						{(status === 'idle' || status === 'paused') && (
							<div className={styles.overlay}>
								<p>
									{status === 'paused'
										? 'Paused — press P or Space'
										: 'Route packets through the LAN. Avoid DMZ walls and firewalls.'}
								</p>
							</div>
						)}
					</div>

					<div className={styles.controls}>
						<button
							type="button"
							className={styles.primaryButton}
							onClick={
								status === 'playing' || status === 'paused'
									? () =>
											setStatus((s) =>
												s === 'playing' ? 'paused' : 'playing'
											)
									: startGame
							}
						>
							{status === 'idle' || status === 'gameover'
								? 'Start'
								: status === 'paused'
								? 'Resume'
								: 'Pause'}
						</button>
						<button
							type="button"
							className={styles.secondaryButton}
							onClick={startGame}
						>
							Restart
						</button>
						<span className={styles.keyHint}>
							WASD / arrows · P pause · Enter start
						</span>
					</div>
				</div>
			</div>
		</DraggableWindow>
	);
}

export default Snake;
