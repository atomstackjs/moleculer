import { getConstructorName } from "./getConstructorName";

describe("getConstructorName", () => {
	it("should return undefined for null input", () => {
		expect(getConstructorName(null)).toBeUndefined();
	});

	it("should return undefined for undefined input", () => {
		expect(getConstructorName(undefined)).toBeUndefined();
	});

	it('should return "Object" for a plain object', () => {
		expect(getConstructorName({})).toBe("Object");
	});

	it("should return the constructor name for a built-in object", () => {
		expect(getConstructorName(new Date())).toBe("Date");
		expect(getConstructorName([])).toBe("Array");
		expect(getConstructorName(new Map())).toBe("Map");
	});

	it("should return the constructor name for a custom class", () => {
		class TestClass { }
		expect(getConstructorName(new TestClass())).toBe("TestClass");
	});

	it("should return undefined for an object without a constructor", () => {
		const obj = Object.create(null);
		expect(getConstructorName(obj)).toBeUndefined();
	});

	it("should handle objects with prototype chain", () => {
		class ParentClass { }
		class ChildClass extends ParentClass { }
		expect(getConstructorName(new ChildClass())).toBe("ChildClass");
	});

	it("should handle functions", () => {
		function testFunction() { }
		expect(getConstructorName(testFunction)).toBe("testFunction");
	});

	it("should handle arrow functions", () => {
		const arrowFunction = () => { };
		expect(getConstructorName(arrowFunction)).toBe("Function");
	});
});
