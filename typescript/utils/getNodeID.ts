import { hostname } from "os";

/**
* @returns a unique identifier for the current node
*/
export function getNodeID(): string {
	return hostname().toLowerCase() + "-" + process.pid;
}

