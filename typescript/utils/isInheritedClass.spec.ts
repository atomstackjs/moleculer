import { isInheritedClass } from './isInheritedClass';
import { getConstructorName } from './getConstructorName';

describe('isInheritedClass', () => {
	class BaseClass { }
	class DerivedClass extends BaseClass { }
	class UnrelatedClass { }

	it('should return true if the instance is an instance of the given base class', () => {
		const instance = new DerivedClass();
		expect(isInheritedClass(instance, BaseClass)).toBe(true);
	});

	it('should return false if the instance is not an instance of the given base class', () => {
		const instance = new UnrelatedClass();
		expect(isInheritedClass(instance, BaseClass)).toBe(false);
	});

	it('should return false if the instance is null or undefined', () => {
		expect(isInheritedClass(null as any, BaseClass)).toBe(false);
		expect(isInheritedClass(undefined as any, BaseClass)).toBe(false);
	});

	it('should return false if the base class is null or undefined', () => {
		const instance = new DerivedClass();
		expect(isInheritedClass(instance, null as any)).toBe(false);
		expect(isInheritedClass(instance, undefined as any)).toBe(false);
	});
});
