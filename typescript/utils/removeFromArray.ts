export function removeFromArray<T>(arr: T[], item: T): T[] {
	if (!arr || arr.length === 0) return arr;
	const idx = arr.indexOf(item);
	if (idx !== -1) arr.splice(idx, 1);

	return arr;
}
