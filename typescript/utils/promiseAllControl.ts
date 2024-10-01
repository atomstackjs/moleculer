/**
 * Promise control
 * if you'd always like to know the result of each promise
 *
 * @param {Array} promises
 * @param {Boolean} settled set true for result of each promise with reject
 * @param {Object} promise
 * @return {Promise<{[p: string]: PromiseSettledResult<*>}>|Promise<unknown[]>}
 */
export function promiseAllControl<T>(
	promises: Array<Promise<T>>,
	settled: boolean = false,
	promise: typeof Promise = Promise
): Promise<Array<PromiseSettledResult<T>> | Array<T>> {
	return settled ? promise.allSettled(promises) : promise.all(promises);
}
