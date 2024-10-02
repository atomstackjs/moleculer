import { match } from "./match";

describe("Match", () => {
	it("should match", () => {
		expect(match("1.2.3", "1.2.3")).toBe(true);
		expect(match("a.b.c.d", "a.b.c.d")).toBe(true);
		expect(match("aa.bb.cc", "aa.bb.cc")).toBe(true);

		expect(match("a1c", "a?c")).toBe(true);
		expect(match("a2c", "a?c")).toBe(true);
		expect(match("a3c", "a?c")).toBe(true);
		expect(match("ac", "a?c")).toBe(false);

		expect(match("aa.1b.c", "aa.?b.*")).toBe(true);
		expect(match("aa.2b.cc", "aa.?b.*")).toBe(true);
		expect(match("aa.3b.ccc", "aa.?b.*")).toBe(true);
		expect(match("aa.4b.cccc", "aa.?b.*")).toBe(true);
		expect(match("aa.5b.ccccc", "aa.?b.*")).toBe(true);
		expect(match("aa.5b.ccccc.d", "aa.?b.*")).toBe(false);

		expect(match("aa.bb.cc", "aa.bb.*")).toBe(true);
		expect(match("aa.bb.cc", "*.bb.*")).toBe(true);
		expect(match("bb.cc", "bb.*")).toBe(true);
		expect(match("dd", "*")).toBe(true);

		expect(match("abcd", "*d")).toBe(true);
		expect(match("abcd", "*d*")).toBe(true);
		expect(match("abcd", "*a*")).toBe(true);
		expect(match("abcd", "a*")).toBe(true);

		// --- DOUBLE STARS CASES ---

		expect(match("aa.bb.cc", "aa.*")).toBe(false);
		expect(match("aa.bb.cc", "a*")).toBe(false);
		expect(match("bb.cc", "*")).toBe(false);

		expect(match("aa.bb.cc.dd", "*.bb.*")).toBe(false);
		expect(match("aa.bb.cc.dd", "*.cc.*")).toBe(false);

		expect(match("aa.bb.cc.dd", "*bb*")).toBe(false);
		expect(match("aa.bb.cc.dd", "*cc*")).toBe(false);

		expect(match("aa.bb.cc.dd", "*b*")).toBe(false);
		expect(match("aa.bb.cc.dd", "*c*")).toBe(false);

		expect(match("aa.bb.cc.dd", "**.bb.**")).toBe(true);
		expect(match("aa.bb.cc.dd", "**.cc.**")).toBe(true);

		expect(match("aa.bb.cc.dd", "**aa**")).toBe(true);
		expect(match("aa.bb.cc.dd", "**bb**")).toBe(true);
		expect(match("aa.bb.cc.dd", "**cc**")).toBe(true);
		expect(match("aa.bb.cc.dd", "**dd**")).toBe(true);

		expect(match("aa.bb.cc.dd", "**b**")).toBe(true);
		expect(match("aa.bb.cc.dd", "**c**")).toBe(true);

		expect(match("aa.bb.cc", "aa.**")).toBe(true);
		expect(match("aa.bb.cc", "**.cc")).toBe(true);

		expect(match("bb.cc", "**")).toBe(true);
		expect(match("b", "**")).toBe(true);

		expect(match("$node.connected", "$node.*")).toBe(true);
		expect(match("$node.connected", "$node.**")).toBe(true);
		expect(match("$aa.bb.cc", "$aa.*.cc")).toBe(true);

		// ---
		expect(match("$aa.bb.cc", "$aa.*.cc")).toBe(true);
		expect(match("$aa.bb.cc", "$aa.**")).toBe(true);
		expect(match("$aa.bb.cc", "$aa.**.cc")).toBe(true);
		expect(match("$aa.bb.cc", "$aa.??.cc")).toBe(true);
		expect(match("$aa.bb.cc", "?aa.bb.cc")).toBe(true);
		expect(match("$aa.bb.cc", "aa.bb.cc")).toBe(false);
		expect(match("$aa.bb.cc", "**.bb.cc")).toBe(true);
		expect(match("$aa.bb.cc", "**.cc")).toBe(true);
		expect(match("$aa.bb.cc", "**")).toBe(true);
		expect(match("$aa.bb.cc", "*")).toBe(false);
	})
})
