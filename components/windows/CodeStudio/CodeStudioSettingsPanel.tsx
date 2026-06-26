import type { ReactNode } from 'react';
import Codicon from './Codicon';
import {
	CodeStudioFontFamily,
	CodeStudioSettings,
	CodeStudioTheme,
} from '../../../lib/codeStudio/settings';
import styles from './CodeStudio.module.css';

type Props = {
	settings: CodeStudioSettings;
	onChange: (patch: Partial<CodeStudioSettings>) => void;
	onReset: () => void;
};

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<div className={styles.settingRow}>
			<div className={styles.settingLabelBlock}>
				<div className={styles.settingLabel}>{label}</div>
				{description && (
					<div className={styles.settingDescription}>{description}</div>
				)}
			</div>
			<div className={styles.settingControl}>{children}</div>
		</div>
	);
}

function CodeStudioSettingsPanel({ settings, onChange, onReset }: Props) {
	return (
		<aside className={styles.sidebar}>
			<div className={styles.sidebarHeader}>
				<span>Settings</span>
				<button
					type="button"
					className={styles.sidebarHeaderButton}
					title="Reset settings"
					onClick={onReset}
				>
					<Codicon name="discard" />
				</button>
			</div>

			<div className={styles.settingsBody}>
				<section className={styles.settingsSection}>
					<h3 className={styles.settingsSectionTitle}>Text Editor</h3>
					<SettingRow
						label="Font size"
						description="Controls the font size in pixels."
					>
						<input
							type="range"
							min={11}
							max={20}
							step={1}
							value={settings.fontSize}
							onChange={(event) =>
								onChange({ fontSize: Number(event.target.value) })
							}
						/>
						<span className={styles.settingValue}>{settings.fontSize}px</span>
					</SettingRow>
					<SettingRow label="Font family">
						<select
							className={styles.settingSelect}
							value={settings.fontFamily}
							onChange={(event) =>
								onChange({
									fontFamily: event.target
										.value as CodeStudioFontFamily,
								})
							}
						>
							<option value="cascadia">Cascadia Code</option>
							<option value="fira">Fira Code</option>
							<option value="consolas">Consolas</option>
						</select>
					</SettingRow>
					<SettingRow label="Tab size">
						<select
							className={styles.settingSelect}
							value={settings.tabSize}
							onChange={(event) =>
								onChange({
									tabSize: Number(event.target.value) as 2 | 4,
								})
							}
						>
							<option value={2}>2</option>
							<option value={4}>4</option>
						</select>
					</SettingRow>
					<SettingRow label="Word wrap">
						<label className={styles.settingToggle}>
							<input
								type="checkbox"
								checked={settings.wordWrap === 'on'}
								onChange={(event) =>
									onChange({
										wordWrap: event.target.checked ? 'on' : 'off',
									})
								}
							/>
							<span>Enable</span>
						</label>
					</SettingRow>
					<SettingRow label="Font ligatures">
						<label className={styles.settingToggle}>
							<input
								type="checkbox"
								checked={settings.fontLigatures}
								onChange={(event) =>
									onChange({ fontLigatures: event.target.checked })
								}
							/>
							<span>Enable</span>
						</label>
					</SettingRow>
				</section>

				<section className={styles.settingsSection}>
					<h3 className={styles.settingsSectionTitle}>Workbench</h3>
					<SettingRow label="Color theme">
						<select
							className={styles.settingSelect}
							value={settings.theme}
							onChange={(event) =>
								onChange({
									theme: event.target.value as CodeStudioTheme,
								})
							}
						>
							<option value="vs-dark">Dark+</option>
							<option value="hc-black">High Contrast</option>
						</select>
					</SettingRow>
					<SettingRow label="Minimap">
						<label className={styles.settingToggle}>
							<input
								type="checkbox"
								checked={settings.showMinimap}
								onChange={(event) =>
									onChange({ showMinimap: event.target.checked })
								}
							/>
							<span>Show minimap</span>
						</label>
					</SettingRow>
					<SettingRow label="Panel">
						<label className={styles.settingToggle}>
							<input
								type="checkbox"
								checked={settings.panelVisible}
								onChange={(event) =>
									onChange({ panelVisible: event.target.checked })
								}
							/>
							<span>Show panel</span>
						</label>
					</SettingRow>
				</section>

				<section className={styles.settingsSection}>
					<h3 className={styles.settingsSectionTitle}>Runtime</h3>
					<p className={styles.settingsNote}>
						Python runs in-browser via Pyodide. C compiles through the
						portfolio API (Piston). Sample files use replay mode when
						unmodified.
					</p>
				</section>
			</div>
		</aside>
	);
}

export default CodeStudioSettingsPanel;
