const deprecateList: string[] = [];

function deprecate(prop: string, msg: string): void {
	if (!deprecateList.includes(prop)) {
		console.warn(`Deprecation warning: ${msg}`);
		deprecateList.push(prop);
	}
}
