/**
 * Sets a variable on an object based on its dot path.
 *
 * @param {Record<string, any>} obj
 * @param {string} path
 * @param {*} value
 * @returns {Record<string, any>}
 */
export function setWith(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
	const parts = path.split(".");
	const part = parts.shift();
	if (part && parts.length > 0) {
		if (!Object.prototype.hasOwnProperty.call(obj, part)) {
			obj[part] = {};
		} else if (obj[part] == null) {
			obj[part] = {};
		} else {
			if (typeof obj[part] !== "object") {
				throw new Error("Value already set and it's not an object");
			}
		}
		obj[part] = utils.dotSet(obj[part], parts.join("."), value);
		return obj;
	}
	obj[path] = value;
	return obj;
}
