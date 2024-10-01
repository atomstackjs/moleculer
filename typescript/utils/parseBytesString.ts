const byteMultipliers: Record<string, number> = {
	b: 1,
	kb: 1 << 10,
	mb: 1 << 20,
	gb: 1 << 30,
	tb: Math.pow(1024, 4),
	pb: Math.pow(1024, 5)
};

const parseByteStringRe = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Parse a byte string to number of bytes. E.g "1kb" -> 1024
 * Credits: https://github.com/visionmedia/bytes.js
 *
 * @param {string | number} v
 * @returns {number | null}
 */
export function parseByteString(v: string | number): number | null {
	if (typeof v === "number" && !isNaN(v)) {
		return v;
	}

	if (typeof v !== "string") {
		return null;
	}

	// Test if the string passed is valid
	let results = parseByteStringRe.exec(v);
	let floatValue: number;
	let unit: string = "b";

	if (!results) {
		// Nothing could be extracted from the given string
		floatValue = parseInt(v, 10);
		if (Number.isNaN(floatValue)) return null;

		unit = "b";
	} else {
		// Retrieve the value and the unit
		floatValue = parseFloat(results[1]);
		unit = results[4].toLowerCase();
	}

	return Math.floor(byteMultipliers[unit] * floatValue);
}
