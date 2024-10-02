import { getIpList } from './getIpList';
import os from 'os';

describe('getIpList', () => {
	const mockNetworkInterfaces = (interfaces: { [key: string]: os.NetworkInterfaceInfo[] }) => {
		jest.spyOn(os, 'networkInterfaces').mockReturnValue(interfaces);
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a list of external IPv4 addresses', () => {
		const interfaces = {
			eth0: [
				{ address: '192.168.1.1', family: 'IPv4', internal: false } as os.NetworkInterfaceInfo,
				{ address: 'fe80::1', family: 'IPv6', internal: false } as os.NetworkInterfaceInfo,
			],
			lo: [
				{ address: '127.0.0.1', family: 'IPv4', internal: true } as os.NetworkInterfaceInfo,
			],
		};
		mockNetworkInterfaces(interfaces);

		const result = getIpList();
		expect(result).toEqual(['192.168.1.1']);
	});

	it('should return a list of internal IPv4 addresses if no external addresses are found', () => {
		const interfaces = {
			eth0: [
				{ address: 'fe80::1', family: 'IPv6', internal: false } as os.NetworkInterfaceInfo,
			],
			lo: [
				{ address: '127.0.0.1', family: 'IPv4', internal: true } as os.NetworkInterfaceInfo,
			],
		};
		mockNetworkInterfaces(interfaces);

		const result = getIpList();
		expect(result).toEqual(['127.0.0.1']);
	});

	it('should return an empty list if no IPv4 addresses are found', () => {
		const interfaces = {
			eth0: [
				{ address: 'fe80::1', family: 'IPv6', internal: false } as os.NetworkInterfaceInfo,
			],
		};
		mockNetworkInterfaces(interfaces);

		const result = getIpList();
		expect(result).toEqual([]);
	});
});
