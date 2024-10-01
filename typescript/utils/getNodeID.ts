/**
* @returns a unique identifier for the current node
*/
export function getNodeID(): string {
	return os.hostname().toLowerCase() + "-" + process.pid;
}

