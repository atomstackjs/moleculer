import { getConstructorName } from './getConstructorName';

/**
 * Check whether the instance is an instance of the given class.
 *
 * @param {object} instance
 * @param {object} baseClass
 * @returns {boolean}
 */
export function isInheritedClass(instance: object, baseClass: object): boolean {
	const baseClassName = getConstructorName(baseClass);
	let proto = instance;
	while ((proto = Object.getPrototypeOf(proto))) {
		const protoName = getConstructorName(proto);
		if (baseClassName === protoName) return true;
	}

	return false;
}
