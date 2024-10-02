import { getNodeID } from './getNodeID';
import os from 'os';

describe('getNodeID', () => {
	const mockHostname = (hostname: string) => {
		jest.spyOn(os, 'hostname').mockReturnValue(hostname);
	};

	const mockProcessPid = (pid: number) => {
		Object.defineProperty(process, 'pid', {
			value: pid,
			writable: true,
		});
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a unique identifier for the current node', () => {
		const hostname = 'TestHost';
		const pid = 12345;

		mockHostname(hostname);
		mockProcessPid(pid);

		const result = getNodeID();
		expect(result).toBe('testhost-12345');
	});

	it('should handle different hostnames and PIDs', () => {
		const hostname = 'AnotherHost';
		const pid = 67890;

		mockHostname(hostname);
		mockProcessPid(pid);

		const result = getNodeID();
		expect(result).toBe('anotherhost-67890');
	});
});
