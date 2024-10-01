import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { fn } from "jest-mock";
import lolex, { InstalledClock } from "lolex";
import { protectReject } from "../test/util/protectReject"
import { polyfillPromise } from "./polyfillPromise";
import { TimeoutError } from "../errors";

describe("polyfillPromises", () => {
	beforeAll(() => {
		polyfillPromise(global.Promise);
	})

	it("should exists polyfilled methods", () => {
		expect(Promise.method).toBeDefined();
		expect(Promise.delay).toBeDefined();
		expect(Promise.prototype.delay).toBeDefined();
		expect(Promise.prototype.timeout).toBeDefined();
		expect(Promise.mapSeries).toBeDefined();
	});

	describe("Promise.method", () => {
		it("should wrap a static value with Promise", () => {
			const origFn = (name: string) => `Hello ${name}`;
			const pFn = Promise.method(origFn);

			return pFn("Promise")
				.catch(protectReject)
				.then((res: string) => {
					expect(res).toBe("Hello Promise");
				});
		});

		it("should wrap a resolved with value", () => {
			const origFn = (name: string): Promise<string> => Promise.resolve(`Hello ${name}`);
			const pFn = Promise.method(origFn);

			return pFn("Promise")
				.catch(protectReject)
				.then((res: string) => {
					expect(res).toBe("Hello Promise");
				});
		});

		it("should wrap an Error with Promise", () => {
			const err = new Error("Something happened");
			const origFn = (): never => {
				throw err;
			};
			const pFn = Promise.method(origFn);

			return pFn("Promise")
				.then(protectReject)
				.catch((res: Error) => {
					expect(res).toBe(err);
				});
		});

		it("should wrap a rejected Error", () => {
			const err = new Error("Something happened");
			const origFn = (): Promise<never> => Promise.reject(err);
			const pFn = Promise.method(origFn);

			return pFn("Promise")
				.then(protectReject)
				.catch((res: Error) => {
					expect(res).toBe(err);
				});
		});
	});


	describe.skip("Promise.delay", () => {
		let clock: InstalledClock;

		beforeAll(() => {
			clock = lolex.install()
		});

		afterAll(() => clock.uninstall());

		it("should wait the given time", () => {
			let done = false;
			return new Promise<void>(resolve => {
				const p = Promise.delay(2500).then(() => (done = true));
				expect(done).toBe(false);
				clock.tick(1000);
				expect(done).toBe(false);
				clock.tick(1000);
				expect(done).toBe(false);
				clock.tick(1000);
				expect(done).toBe(true);

				p.then(() => resolve());
			});
		});
	});

	describe("Promise.timeout", () => {
		/*let clock;

		beforeAll(() => clock = lolex.install());
		afterAll(() => clock.uninstall());
		*/

		it("should be resolved", async () => {
			const p: Promise<string> = Promise.delay(200)
				.then(() => "OK")
				.timeout(250);

			//clock.tick(2200);
			//clock.tick(3000);

			let res: string;
			try {
				res = await p;
			} catch (err) {
				protectReject(err)
				res = "NOT OK"
			}
			expect(res).toBe("OK");
			return res;
		});

		it("should be resolved", async () => {
			const p: Promise<string> = Promise.resolve()
				.delay(200)
				.then(() => "OK")
				.timeout(250);

			//clock.tick(2200);
			//clock.tick(3000);

			let res: string;
			try {
				res = await p;
			} catch (err) {
				protectReject(err);
				res = "NOT OK"
			}
			expect(res).toBe("OK");
		});

		it("should be timed out", async () => {
			const p: Promise<string> = Promise.resolve()
				.delay(200)
				.then(() => "OK")
				.timeout(150);

			//clock.tick(1700);

			try {
				const err = await p;
				return protectReject(err);
			} catch (err_1) {
				expect(err_1).toBeInstanceOf(TimeoutError);
			}
		});

		it("should be timed out", async () => {
			const p: Promise<string> = Promise.resolve()
				.delay(200)
				.then(() => "OK")
				.timeout(150);

			//clock.tick(2500);

			try {
				const err = await p;
				return protectReject(err);
			} catch (err_1) {
				expect(err_1).toBeInstanceOf(TimeoutError);
			}
		});
	});


	describe("Test Promise.mapSeries", () => {
		it("should be resolved", async () => {
			let res: void;
			try {
				res = await Promise.mapSeries(
					[
						"First",
						Promise.resolve("Second"),
						"Third",
						new Promise(resolve => resolve("Fourth"))
					],
					(p: unknown) => p
				);
			} catch (err) {
				res = protectReject(err);
			}
			expect(res).toEqual(["First", "Second", "Third", "Fourth"]);
		});

		it("should be resolved the empty array", async () => {
			let res: void;
			try {
				res = await Promise.mapSeries([], (p: unknown) => p);
			} catch (err) {
				res = protectReject(err);
			}
			expect(res).toEqual([]);
		});

		it("should be rejected", async () => {
			try {
				const err = await Promise.mapSeries(
					[
						"First",
						Promise.resolve("Second"),
						"Third",
						new Promise((resolve, reject) => reject("Error"))
					],
					(p: unknown) => p
				);
				return protectReject(err);
			} catch (res) {
				expect(res).toEqual("Error");
			}
		});

		it("should be rejected", () => {
			const cb = fn((item, i) => {
				if (i == 2) throw new Error("Wrong");
				return item;
			});

			return Promise.mapSeries(
				[
					"First",
					Promise.resolve("Second"),
					"Third",
					new Promise(resolve => resolve("Fourth"))
				],
				cb
			)
				.then(protectReject)
				.catch(res => {
					expect(res).toBeInstanceOf(Error);
					expect(res.message).toBe("Wrong");
					expect(cb).toBeCalledTimes(3);
				});
		});
	});
})

