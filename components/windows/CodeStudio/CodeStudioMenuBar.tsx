import { useEffect, useRef, useState } from 'react';
import Codicon from './Codicon';
import styles from './CodeStudio.module.css';

export type MenuAction = {
	id: string;
	label: string;
	shortcut?: string;
	disabled?: boolean;
	checked?: boolean;
	onSelect: () => void;
};

export type MenuSection = {
	id: string;
	label: string;
	items: MenuAction[];
};

type Props = {
	menus: MenuSection[];
};

function CodeStudioMenuBar({ menus }: Props) {
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onPointerDown = (event: MouseEvent) => {
			if (!barRef.current?.contains(event.target as Node)) {
				setOpenMenuId(null);
			}
		};
		document.addEventListener('mousedown', onPointerDown);
		return () => document.removeEventListener('mousedown', onPointerDown);
	}, []);

	return (
		<div ref={barRef} className={styles.menuBar}>
			{menus.map((menu) => {
				const isOpen = openMenuId === menu.id;
				return (
					<div key={menu.id} className={styles.menuWrap}>
						<button
							type="button"
							className={`${styles.menuTrigger} ${
								isOpen ? styles.menuTriggerOpen : ''
							}`}
							onClick={() =>
								setOpenMenuId((current) =>
									current === menu.id ? null : menu.id
								)
							}
						>
							{menu.label}
						</button>
						{isOpen && (
							<div className={styles.menuDropdown} role="menu">
								{menu.items.map((item) => (
									<button
										key={item.id}
										type="button"
										role="menuitem"
										className={styles.menuDropdownItem}
										disabled={item.disabled}
										onClick={() => {
											item.onSelect();
											setOpenMenuId(null);
										}}
									>
										<span className={styles.menuDropdownLabel}>
											{item.checked !== undefined && (
												<span className={styles.menuCheck}>
													{item.checked ? (
														<Codicon name="check" />
													) : null}
												</span>
											)}
											{item.label}
										</span>
										{item.shortcut && (
											<span className={styles.menuShortcut}>
												{item.shortcut}
											</span>
										)}
									</button>
								))}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default CodeStudioMenuBar;
