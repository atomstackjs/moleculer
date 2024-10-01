export function humanizeMilliseconds(milli: number | null | undefined): string {
	if (milli == null) return "?";

	const divisors = [1000, 60, 60, 24, 7, 4.34524, 12];
	const units = ["ms", "s", "m", "h", "d", "w", "mo", "y"];

	for (let i = 0; i < divisors.length; i++) {
		const val = milli / divisors[i];
		if (val >= 1.0) return "" + Math.floor(val) + units[i];
	}

	return "now";
}
