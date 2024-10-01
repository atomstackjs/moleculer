/**
 * Get the name of constructor of an object.
 *
 * @param {Object} obj
 * @returns {string | undefined}
 */
export function getConstructorName(obj: object | null | undefined): string | undefined {
	if (obj == null) return undefined;

	let target = (obj as any).prototype;
	if (target && target.constructor && target.constructor.name) {
		return target.constructor.name;
	}
	if (obj.constructor && obj.constructor.name) {
		return obj.constructor.name;
	}
	return undefined;
}
