const deprecateList: Set<string> = new Set();

export function deprecate(prop: string, msg: string): void {
	if (!deprecateList.has(prop)) {
		console.warn(`Deprecation warning: ${msg}`);
		deprecateList.add(prop);
	}
}
