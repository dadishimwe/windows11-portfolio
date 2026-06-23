export function normalizePath(path: string) {
	return path.split('?')[0];
}

export function isActivePath(currentPath: string, targetPath: string) {
	return normalizePath(currentPath) === targetPath;
}

export function isActivePathPrefix(currentPath: string, targetPrefix: string) {
	return normalizePath(currentPath).startsWith(targetPrefix);
}
