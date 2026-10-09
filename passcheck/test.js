// Run with: node test.js
const assert = require("assert");
global.crypto = require("crypto").webcrypto;
const { analyze, humanTime, generate } = require("./strength.js");

assert.strictEqual(analyze("password").label, "Very weak");
assert.strictEqual(analyze("123456").label, "Very weak");
assert.ok(analyze("Tr0ub4dor&3xQ!zP9").score >= 3, "long mixed password should be strong");
assert.ok(analyze("aaa").tips.some(t => t.includes("repeating")));
assert.strictEqual(analyze("").label, "—");
assert.ok(analyze("Summer2024").score <= 1, "word+year should be weak");
assert.strictEqual(humanTime(0.5), "instantly");
assert.strictEqual(humanTime(120), "2 minutes");
const g = generate(20);
assert.strictEqual(g.length, 20);
assert.ok(analyze(g).score >= 3, "generated password should be strong");
console.log("All 10 tests passed ✓");
