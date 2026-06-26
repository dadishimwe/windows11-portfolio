import Codicon from './Codicon';
import FileTypeIcon from './FileTypeIcon';
import { CodeWorkspace } from '../../../config/codeStudio/workspaces';
import { SearchMatch } from '../../../lib/codeStudio/search';
import { OpenFile } from '../../../lib/codeStudio/workspace';
import styles from './CodeStudio.module.css';

export type SidebarView = 'explorer' | 'search' | 'settings';

type Props = {
	view: SidebarView;
	workspace: CodeWorkspace;
	workspaceId: string;
	workspaceOptions: Array<{ id: string; name: string }>;
	explorerOpen: boolean;
	openFiles: OpenFile[];
	activeFile: string;
	searchQuery: string;
	searchResults: SearchMatch[];
	onSwitchWorkspace: (id: string) => void;
	onToggleExplorer: () => void;
	onSearchQueryChange: (value: string) => void;
	onOpenFile: (path: string) => void;
	onGoToSearchResult: (result: SearchMatch) => void;
};

function CodeStudioSidebar({
	view,
	workspace,
	workspaceId,
	workspaceOptions,
	explorerOpen,
	openFiles,
	activeFile,
	searchQuery,
	searchResults,
	onSwitchWorkspace,
	onToggleExplorer,
	onSearchQueryChange,
	onOpenFile,
	onGoToSearchResult,
}: Props) {
	if (view === 'settings') return null;

	if (view === 'search') {
		return (
			<aside className={styles.sidebar}>
				<div className={styles.sidebarHeader}>
					<span>Search</span>
				</div>
				<div className={styles.searchBox}>
					<Codicon name="search" className={styles.searchBoxIcon} />
					<input
						className={styles.searchInput}
						value={searchQuery}
						onChange={(event) =>
							onSearchQueryChange(event.target.value)
						}
						placeholder="Search workspace files"
						autoFocus
					/>
				</div>
				<div className={styles.searchSummary}>
					{searchQuery.trim()
						? `${searchResults.length} result${
								searchResults.length === 1 ? '' : 's'
							}`
						: 'Type to search file contents'}
				</div>
				<ul className={styles.searchResults}>
					{searchResults.map((result) => (
						<li key={`${result.file}-${result.line}-${result.column}`}>
							<button
								type="button"
								className={styles.searchResultItem}
								onClick={() => onGoToSearchResult(result)}
							>
								<div className={styles.searchResultTitle}>
									<FileTypeIcon
										fileName={result.file}
										size={14}
									/>
									<span>
										{result.file}:{result.line}:{result.column}
									</span>
								</div>
								<div className={styles.searchResultPreview}>
									{result.preview}
								</div>
							</button>
						</li>
					))}
				</ul>
			</aside>
		);
	}

	return (
		<aside className={styles.sidebar}>
			<div className={styles.sidebarHeader}>
				<span>Workspaces</span>
			</div>
			<div className={styles.workspaceBlock}>
				<select
					className={styles.workspaceSelect}
					value={workspaceId}
					onChange={(event) => onSwitchWorkspace(event.target.value)}
				>
					{workspaceOptions.map((item) => (
						<option key={item.id} value={item.id}>
							{item.name}
						</option>
					))}
				</select>
				<p className={styles.workspaceHint}>{workspace.description}</p>
			</div>
			<div className={styles.sidebarHeader}>
				<span>Explorer</span>
				<button
					type="button"
					className={styles.sidebarHeaderButton}
					title={explorerOpen ? 'Collapse folder' : 'Expand folder'}
					onClick={onToggleExplorer}
				>
					<Codicon
						name={explorerOpen ? 'chevron-down' : 'chevron-right'}
					/>
				</button>
			</div>
			{explorerOpen && (
				<>
					<div className={styles.explorerRoot}>
						<Codicon name="chevron-down" />
						<span>{workspace.name}</span>
					</div>
					<ul className={styles.fileList}>
						{workspace.files.map((file) => {
							const open = openFiles.find(
								(item) => item.path === file.path
							);
							const isActive = activeFile === file.path;
							return (
								<li key={file.path}>
									<button
										type="button"
										className={`${styles.fileItem} ${
											isActive ? styles.fileItemActive : ''
										} ${open?.isDirty ? styles.fileItemDirty : ''}`}
										onClick={() => onOpenFile(file.path)}
									>
										<FileTypeIcon fileName={file.path} />
										<span className={styles.fileItemLabel}>
											{file.path}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				</>
			)}
		</aside>
	);
}

export default CodeStudioSidebar;
