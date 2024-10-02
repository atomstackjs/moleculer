/**
 * Converts a given number of milliseconds into a human-readable string.
 *
 * @param {number | null | undefined} milli - The number of milliseconds to convert.
 * @returns {string} A human-readable string representing the time duration.
 *
 * The function handles the following cases:
 * - Returns "?" if the input is null or undefined.
 * - Returns "now" if the input is 0 milliseconds.
 * - Converts milliseconds into appropriate time units (ms, s, m, h, d, w, mo, y).
 *
 * Example usage:
 * humanizeMilliseconds(500); // "500ms"
 * humanizeMilliseconds(1500); // "1s"
 * humanizeMilliseconds(120000); // "2m"
 * humanizeMilliseconds(7200000); // "2h"
 * humanizeMilliseconds(172800000); // "2d"
 * humanizeMilliseconds(1209600000); // "2w"
 * humanizeMilliseconds(5184000000); // "2mo"
 * humanizeMilliseconds(62208000000); // "2y"
 */
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
