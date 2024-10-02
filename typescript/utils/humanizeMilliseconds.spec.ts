import { humanizeMilliseconds } from './humanizeMilliseconds';

describe('humanizeMilliseconds', () => {
	it('should return "?" for null input', () => {
		expect(humanizeMilliseconds(null)).toBe("?");
	});

	it('should return "?" for undefined input', () => {
		expect(humanizeMilliseconds(undefined)).toBe("?");
	});

	it('should return "now" for 0 milliseconds', () => {
		expect(humanizeMilliseconds(0)).toBe("now");
	});

	it('should return "ms" for values less than 1000 milliseconds', () => {
		expect(humanizeMilliseconds(500)).toBe("500ms");
	});

	it('should return "s" for values between 1000 and 59999 milliseconds', () => {
		expect(humanizeMilliseconds(1500)).toBe("1s");
	});

	it('should return "m" for values between 60000 and 3599999 milliseconds', () => {
		expect(humanizeMilliseconds(120000)).toBe("2m");
	});

	it('should return "h" for values between 3600000 and 86399999 milliseconds', () => {
		expect(humanizeMilliseconds(7200000)).toBe("2h");
	});

	it('should return "d" for values between 86400000 and 604799999 milliseconds', () => {
		expect(humanizeMilliseconds(172800000)).toBe("2d");
	});

	it('should return "w" for values between 604800000 and 2591999999 milliseconds', () => {
		expect(humanizeMilliseconds(1209600000)).toBe("2w");
	});

	it('should return "mo" for values between 2592000000 and 31103999999 milliseconds', () => {
		expect(humanizeMilliseconds(5284000000)).toBe("2mo");
	});

	it('should return "y" for values greater than or equal to 31104000000 milliseconds', () => {
		expect(humanizeMilliseconds(72208000000)).toBe("2y");
	});
});
