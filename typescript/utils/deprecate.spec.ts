import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SpyInstance } from 'jest-mock';
import { deprecate } from "./deprecate";

describe('deprecate', () => {
	let consoleWarnSpy: SpyInstance;

	beforeEach(() => {
		consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
		// Clear the deprecateList array before each test
		(deprecate as any).deprecateList = [];
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	it('should log a warning message the first time a property is deprecated', () => {
		deprecate('oldProp', 'oldProp is deprecated, use newProp instead.');

		expect(consoleWarnSpy).toHaveBeenCalledWith('Deprecation warning: oldProp is deprecated, use newProp instead.');
	});

	it('should not log a warning message if the property has already been deprecated', () => {
		deprecate('oldProp2', 'oldProp2 is deprecated, use newProp instead.');
		deprecate('oldProp2', 'oldProp3 is deprecated, use newProp instead.');

		expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
	});

	it('should log a warning message for different properties', () => {
		deprecate('oldProp4', 'oldProp4 is deprecated, use newProp1 instead.');
		deprecate('oldProp5', 'oldProp5 is deprecated, use newProp2 instead.');

		expect(consoleWarnSpy).toHaveBeenCalledWith('Deprecation warning: oldProp4 is deprecated, use newProp1 instead.');
		expect(consoleWarnSpy).toHaveBeenCalledWith('Deprecation warning: oldProp5 is deprecated, use newProp2 instead.');
	});
});
