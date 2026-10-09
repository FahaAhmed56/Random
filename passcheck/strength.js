// Core logic, no DOM: can be tested in Node or reused anywhere.
const COMMON = ["password","123456","12345678","qwerty","abc123","111111","letmein","admin",
  "welcome","iloveyou","monkey","dragon","football","sunshine","princess","pakistan","000000"];

const SETS = [
  { name: "Lowercase letters", re: /[a-z]/, size: 26 },
  { name: "Uppercase letters", re: /[A-Z]/, size: 26 },
  { name: "Numbers",           re: /[0-9]/, size: 10 },
  { name: "Symbols",           re: /[^A-Za-z0-9]/, size: 33 },
];

function analyze(pw) {
  const checks = SETS.map(s => ({ name: s.name, ok: s.re.test(pw) }));
  const pool = SETS.reduce((n, s) => n + (s.re.test(pw) ? s.size : 0), 0);
  let entropy = pw.length ? pw.length * Math.log2(pool) : 0;   // bits = length × log2(pool size)

  const tips = [];
  const lower = pw.toLowerCase();
  if (COMMON.some(c => lower.includes(c))) { entropy = Math.min(entropy, 10); tips.push("Contains a very common password"); }
  if (/(.)\1{2,}/.test(pw)) { entropy *= 0.8; tips.push("Avoid repeating characters (aaa, 111)"); }
  if (/(abc|bcd|cde|123|234|345|456|567|678|789|qwe|wer|asd)/i.test(pw)) { entropy *= 0.85; tips.push("Avoid sequences like abc or 123"); }
  if (/(19|20)\d{2}/.test(pw)) { entropy *= 0.6; tips.push("Avoid years like 2024, they are guessed early"); }
  if (pw.length && pw.length < 12) tips.push("Use at least 12 characters");
  checks.filter(c => !c.ok).forEach(c => tips.push(`Add ${c.name.toLowerCase()}`));

  const seconds = Math.pow(2, entropy) / 2 / 1e10;  // average guesses at 10 billion/sec
  const levels = [[28,"Very weak"],[36,"Weak"],[60,"Fair"],[80,"Strong"],[Infinity,"Very strong"]];
  const level = levels.findIndex(([max]) => entropy < max);
  return { entropy: Math.round(entropy), seconds, score: level, label: pw ? levels[level][1] : "—", checks, tips };
}

function humanTime(s) {
  if (s < 1) return "instantly";
  const units = [["years",31536000],["days",86400],["hours",3600],["minutes",60],["seconds",1]];
  for (const [u, n] of units) if (s >= n) {
    const v = s / n;
    if (u === "years" && v > 1e6) return "millions of years+";
    return `${Math.round(v).toLocaleString()} ${u}`;
  }
}

function generate(len = 16) {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*-_=+?";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);            // cryptographically secure, unlike Math.random
  return Array.from(buf, n => chars[n % chars.length]).join("");
}

if (typeof module !== "undefined") module.exports = { analyze, humanTime, generate };
