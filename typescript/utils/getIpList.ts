import { NetworkInterfaceInfo, networkInterfaces } from "os";

/**
* @returns a list of IP addresses for the current node
*/
export function getIpList(): string[] {
	const list: string[] = [];
	const ilist: string[] = [];
	const interfaces = networkInterfaces() as { [key: string]: NetworkInterfaceInfo[] };
	for (const iface in interfaces) {
		for (const i in interfaces[iface]) {
			const f = interfaces[iface]?.[i];
			if (f && f.family === "IPv4") {
				if (f.internal) {
					ilist.push(f.address);
					break;
				} else {
					list.push(f.address);
					break;
				}
			}
		}
	}
	return list.length > 0 ? list : ilist;
}
