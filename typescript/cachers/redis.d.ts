import BaseCacher = require("./base");
import type { CacherOptions } from "./base";

declare namespace RedisCacher {
	export interface RedisCacherOptions extends CacherOptions {
		prefix?: string;
		redis?: Record<string, any>;
		redlock?: Record<string, any>;
		monitor?: boolean;
		pingInterval?: number;
	}
}

declare class RedisCacher<TClient = any> extends BaseCacher<RedisCacher.RedisCacherOptions> {
	client: TClient;

	close(): Promise<void>;
	get(key: string): Promise<Record<string, unknown> | null>;
	getWithTTL(key: string): Promise<Record<string, unknown> | null>;
	set(key: string, data: any, ttl?: number): Promise<void>;
	del(key: string | string[]): Promise<void>;
	clean(match?: string | string[]): Promise<void>;
	tryLock(key: string | string[], ttl?: number): Promise<() => Promise<void>>;
	lock(key: string | string[], ttl?: number): Promise<() => Promise<void>>;
}

export = RedisCacher;
