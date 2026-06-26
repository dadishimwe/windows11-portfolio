export type CodeStudioOpenDetail = {
	workspaceId?: string;
	fileName?: string;
	run?: boolean;
};

export const CODE_STUDIO_OPEN_EVENT = 'codeStudio:open';

export function dispatchCodeStudioOpen(detail?: CodeStudioOpenDetail) {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(
		new CustomEvent<CodeStudioOpenDetail>(CODE_STUDIO_OPEN_EVENT, {
			detail: detail ?? {},
		})
	);
}

export function parseCodeStudioOpenDetail(
	detail: unknown
): CodeStudioOpenDetail {
	if (!detail || typeof detail !== 'object') return {};
	const value = detail as CodeStudioOpenDetail;
	return {
		workspaceId:
			typeof value.workspaceId === 'string' ? value.workspaceId : undefined,
		fileName: typeof value.fileName === 'string' ? value.fileName : undefined,
		run: value.run === true,
	};
}
