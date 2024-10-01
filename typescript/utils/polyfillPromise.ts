import { isFunction } from "underscore"
import { TimeoutError } from "../errors"

export function polyfillPromise(P: typeof Promise): void {
	if (!isFunction(P.method)) {
		P.method = function (fn: Function) {
			return function (this: unknown, ...args: any[]): Promise<unknown> {
				try {
					const val = fn.apply(this, args);
					return P.resolve(val);
				} catch (err) {
					return P.reject(err);
				}
			};
		};
	}

	if (!isFunction(P.delay)) {
		P.delay = function <T>(ms: number): Promise<T> {
			return new P<T>(resolve => setTimeout(resolve, ms));
		};
		P.prototype.delay = async function <T>(ms: number): Promise<T> {
			const res = await this;
			await P.delay<void>(ms);
			return res as T;
		};
	}

	if (!isFunction(P.prototype.timeout)) {
		P.prototype.timeout = function <T>(ms: number, message?: string): Promise<T> {
			let timer: NodeJS.Timeout;
			const timeout = new P<T>((_resolve, reject) => {
				timer = setTimeout(() => reject(new TimeoutError(message)), ms);
			});

			return P.race([timeout, this])
				.then(value => {
					clearTimeout(timer);
					return value;
				})
				.catch(err => {
					clearTimeout(timer);
					throw err;
				});
		};
	}

	if (!isFunction(P.mapSeries)) {
		P.mapSeries = function (arr: any[], fn: Function) {
			const promFn = Promise.method(fn);
			const res: any[] = [];

			return arr
				.reduce((p, item, i) => {
					return p.then((r: any) => {
						res[i] = r;
						return promFn(item, i);
					});
				}, P.resolve())
				.then((r: any) => {
					res[arr.length] = r;
					return res.slice(1);
				});
		}
	}
}
