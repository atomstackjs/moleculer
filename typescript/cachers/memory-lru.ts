/*
 * moleculer
 * Copyright (c) 2023 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

"use strict";

const _ = require("lodash");
const { isObject } = require("../utils");
const utilsMatch = require("../utils").match;
const BaseCacher = require("./base");
const { LRUCache } = require("lru-cache");
const { METRIC } = require("../metrics");

const Lock = require("../lock");

/**
 * Import types
 *
 * @typedef {import("../service-broker")} ServiceBroker
 * @typedef {import("./memory-lru")} MemoryLRUCacherClass
 * @typedef {import("./memory-lru").MemoryLRUCacherOptions} MemoryLRUCacherOptions
 */

/**
 * Cacher factory for memory cache
 *
 * @implements {MemoryLRUCacherClass}
 * @extends {BaseCacher<MemoryLRUCacherOptions>}
 */
class MemoryLRUCacher extends BaseCacher {
	/**
	 * Creates an instance of MemoryLRUCacher.
	 *
	 * @param {MemoryLRUCacherOptions?} opts
	 *
	 * @memberof MemoryLRUCacher
	 */
	constructor(opts) {
		super(opts);

		// Cache container
		this.cache = new LRUCache({
			max: this.opts.max ? this.opts.max : 1000,
			ttl: this.opts.ttl ? this.opts.ttl * 1000 : undefined,
			updateAgeOnGet: !!this.opts.ttl
		});

		// Async lock
		this._lock = new Lock();
		// Start TTL timer
		this.timer = setInterval(() => {
			/* istanbul ignore next */
			this.checkTTL();
		}, 30 * 1000);
		this.timer.unref();

		// Set cloning
		this.clone = this.opts.clone === true ? _.cloneDeep : this.opts.clone;
	}

	/**
	 * Initialize cacher
	 *
	 * @param {ServiceBroker} broker
	 *
	 * @memberof MemoryLRUCacher
	 */
	init(broker) {
		super.init(broker);

		this.connected = true;

		broker.localBus.on("$transporter.connected", () => {
			// Clear all entries after transporter connected. Maybe we missed some "cache.clear" events.
			return this.clean();
		});

		if (
			isObject(this.opts.lock) &&
			this.opts.lock?.enabled !== false &&
			this.opts.lock.staleTime
		) {
			/* istanbul ignore next */
			this.logger.warn("setting lock.staleTime with MemoryLRUCacher is not supported.");
		}
	}

	/**
	 * Close cacher
	 *
	 * @memberof MemoryLRUCacher
	 */
	close() {
		clearInterval(this.timer);
		return Promise.resolve();
	}

	/**
	 * Get data from cache by key
	 *
	 * @param {any} key
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	get(key) {
		this.logger.debug(`GET ${key}`);
		this.metrics.increment(METRIC.MOLECULER_CACHER_GET_TOTAL);
		const timeEnd = this.metrics.timer(METRIC.MOLECULER_CACHER_GET_TIME);

		if (this.cache.has(key)) {
			this.logger.debug(`FOUND ${key}`);
			this.metrics.increment(METRIC.MOLECULER_CACHER_FOUND_TOTAL);

			let item = this.cache.get(key);
			const res = this.clone ? this.clone(item) : item;
			timeEnd();

			return this.broker.Promise.resolve(res);
		} else {
			timeEnd();
		}
		return this.broker.Promise.resolve(this.opts.missingResponse);
	}

	/**
	 * Save data to cache by key
	 *
	 * @param {String} key
	 * @param {any} data JSON object
	 * @param {Number} ttl Optional Time-to-Live
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	set(key, data, ttl) {
		this.metrics.increment(METRIC.MOLECULER_CACHER_SET_TOTAL);
		const timeEnd = this.metrics.timer(METRIC.MOLECULER_CACHER_SET_TIME);

		if (ttl == null) ttl = this.opts.ttl;

		data = this.clone ? this.clone(data) : data;

		this.cache.set(key, data, { ttl: ttl ? ttl * 1000 : 0 });

		timeEnd();
		this.logger.debug(`SET ${key}`);

		return this.broker.Promise.resolve(data);
	}

	/**
	 * Delete a key from cache
	 *
	 * @param {string|Array<string>} key
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	del(key) {
		this.metrics.increment(METRIC.MOLECULER_CACHER_DEL_TOTAL);
		const timeEnd = this.metrics.timer(METRIC.MOLECULER_CACHER_DEL_TIME);

		const keys = Array.isArray(key) ? key : [key];
		keys.forEach(key => {
			this.cache.delete(key);
			this.logger.debug(`REMOVE ${key}`);
		});
		timeEnd();

		return this.broker.Promise.resolve();
	}

	/**
	 * Clean cache. Remove every key by match
	 * @param {string|Array<string>} match string. Default is "**"
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	clean(match = "**") {
		this.metrics.increment(METRIC.MOLECULER_CACHER_CLEAN_TOTAL);
		const timeEnd = this.metrics.timer(METRIC.MOLECULER_CACHER_CLEAN_TIME);

		const matches = Array.isArray(match) ? match : [match];
		this.logger.debug(`CLEAN ${matches.join(", ")}`);

		const keys = this.cache.keys();
		/** @type {any} */
		let key = keys.next();
		while (!key.done) {
			if (matches.some(m => utilsMatch(key.value, m))) {
				this.logger.debug(`REMOVE ${key.value}`);
				this.cache.delete(key.value);
			}
			key = keys.next();
		}
		timeEnd();

		return this.broker.Promise.resolve();
	}
	/**
	 * Get data and ttl from cache by key.
	 *
	 * @param {string|Array<string>} key
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	getWithTTL(key) {
		// There are no way to get the ttl of LRU cache :(
		return this.get(key).then(data => {
			return { data, ttl: null };
		});
	}

	/**
	 * Acquire a lock
	 *
	 * @param {string|Array<string>} key
	 * @param {Number} ttl Optional Time-to-Live
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */

	lock(key, ttl) {
		return this._lock.acquire(key, ttl).then(() => {
			return () => this._lock.release(key);
		});
	}

	/**
	 * Try to acquire a lock
	 *
	 * @param {string|Array<string>} key
	 * @param {Number} ttl Optional Time-to-Live
	 * @returns {Promise}
	 *
	 * @memberof MemoryLRUCacher
	 */
	tryLock(key, ttl) {
		if (this._lock.isLocked(key)) {
			return this.broker.Promise.reject(new Error("Locked."));
		}
		return this._lock.acquire(key, ttl).then(() => {
			return () => this._lock.release(key);
		});
	}

	/**
	 * Check & remove the expired cache items
	 *
	 * @memberof MemoryLRUCacher
	 */
	checkTTL() {
		this.cache.purgeStale();
	}

	/**
	 * Return all cache keys with available properties (ttl, lastUsed, ...etc).
	 *
	 * @returns Promise<Array<Object>>
	 */
	getCacheKeys() {
		const res = [];

		const keys = this.cache.keys();
		let key = keys.next();
		while (!key.done) {
			res.push({ key: key.value });
			key = keys.next();
		}

		return Promise.resolve(res);
	}
}

module.exports = MemoryLRUCacher;
