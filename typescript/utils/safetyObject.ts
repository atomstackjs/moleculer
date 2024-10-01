function circularReplacer(options: SafetyObjectOptions = { maxSafeObjectSize: Infinity }): (key: string, value: unknown) => unknown {
	const seen = new WeakSet<object>();
	return function (_key: string, value: unknown): unknown {
		if (typeof value === "object" && value !== null) {
			const objectType = (value.constructor && value.constructor.name) || typeof value;

			if (
				options.maxSafeObjectSize &&
				"length" in value &&
				(value as { length: number }).length > options.maxSafeObjectSize
			) {
				return `[${objectType} ${(value as { length: number }).length}]`;
			}

			if (
				options.maxSafeObjectSize &&
				"size" in value &&
				(value as { size: number }).size > options.maxSafeObjectSize
			) {
				return `[${objectType} ${(value as { size: number }).size}]`;
			}

			if (seen.has(value)) {
				return;
			}
			seen.add(value);
		}
		return value;
	};
}

interface SafetyObjectOptions {
	maxSafeObjectSize?: number;
}

export function safetyObject(obj: object | unknown[], options: SafetyObjectOptions): object | unknown[] {
	return JSON.parse(JSON.stringify(obj, circularReplacer(options)));
}
