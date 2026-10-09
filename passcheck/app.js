const $ = id => document.getElementById(id);
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

function render() {
  const pw = $("pw").value;
  const r = analyze(pw);
  $("bar").style.width = pw ? `${(r.score + 1) * 20}%` : "0";
  $("bar").style.background = COLORS[r.score];
  $("label").textContent = r.label;
  $("label").style.color = pw ? COLORS[r.score] : "";
  $("entropy").textContent = `${r.entropy} bits`;
  $("crack").textContent = pw ? humanTime(r.seconds) : "—";
  $("len").textContent = pw.length;
  $("checks").innerHTML = r.checks.map(c => `<li class="${c.ok ? "ok" : ""}">${c.ok ? "✓" : "○"} ${c.name}</li>`).join("");
  $("tips").innerHTML = pw ? r.tips.map(t => `<li>⚠ ${t}</li>`).join("") : "";
}

$("pw").addEventListener("input", render);
$("toggle").addEventListener("click", () => { $("pw").type = $("pw").type === "password" ? "text" : "password"; });
$("generate").addEventListener("click", () => {
  const len = Math.min(64, Math.max(8, Number($("genLen").value) || 16));
  $("pw").value = generate(len);
  $("pw").type = "text";
  render();
});
render();
