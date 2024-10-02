export function humanizeMilliseconds(milli: number | null | undefined): string {
	if (milli == null) return "?";
	if (milli === 0) return "now";

	const divisors = [1000, 60, 60, 24, 7, 4.34524, 12];
	const units = ["ms", "s", "m", "h", "d", "w", "mo", "y"];
	let value = milli;

	for (let i = 0; i < divisors.length; i++) {
		if (value < divisors[i]) {
			return "" + Math.floor(value) + units[i];
		}
		value /= divisors[i];
	}

	return "" + Math.floor(value) + units[units.length - 1];
}
