const GRID_W = 120;
const GRID_H = 120;
const PIXEL = 5;

const canvas = document.getElementById("gridCanvas");
canvas.width = GRID_W * PIXEL;
canvas.height = GRID_H * PIXEL;
const ctx = canvas.getContext("2d");

let currentAlgorithm = "LCG";

const algorithms = {
  "LCG": {
    desc: "Classic PRNG",
    color: "#00d4ff",
    func: s => [(s * 9301 + 49297) % 233280, 233280]
  },
  "Park-Miller": {
    desc: "Minimal standard",
    color: "#00ff88",
    func: s => [(s * 16807) % 2147483647, 2147483647]
  },
  "Xorshift": {
    desc: "Fast bitwise",
    color: "#ffaa00",
    func: s => {
      s ^= (s << 13);
      s ^= (s >> 17);
      s ^= (s << 5);
      return [s >>> 0, 0xffffffff];
    }
  },
  "MWC": {
    desc: "Multiply-with-carry",
    color: "#ff4466",
    func: s => {
      const a = 4294957665n;
      const result = (a * BigInt(s)) & ((1n << 64n) - 1n);
      return [Number(result & 0xffffffffn), 0xffffffff];
    }
  }
};

// Algorithm UI
const algoList = document.getElementById("algorithm-list");
Object.keys(algorithms).forEach(name => {
  const div = document.createElement("div");
  div.className = "algorithm";
  div.innerHTML = `<b>${name}</b><br><small>${algorithms[name].desc}</small>`;
  div.onclick = () => {
    document.querySelectorAll(".algorithm").forEach(a => a.classList.remove("active"));
    div.classList.add("active");
    currentAlgorithm = name;
  };
  algoList.appendChild(div);
});
algoList.firstChild.classList.add("active");

// Color mapping
function valueToColor(v, mod, hex) {
  const ratio = v / mod;
  const base = Math.floor(ratio * 200 + 20);
  const r = Math.min(255, base * 0.9 + parseInt(hex.slice(1, 3), 16) * 0.1);
  const g = Math.min(255, base * 0.9 + parseInt(hex.slice(3, 5), 16) * 0.1);
  const b = Math.min(255, base * 0.9 + parseInt(hex.slice(5, 7), 16) * 0.1);
  return `rgb(${r},${g},${b})`;
}

// Generate
document.getElementById("generateBtn").onclick = () => {
  let seed = parseInt(document.getElementById("seedInput").value);
  if (isNaN(seed)) seed = Math.floor(Math.random() * 999999);

  const algo = algorithms[currentAlgorithm];
  let s = seed;
  let min = Infinity, max = 0;

  const start = performance.now();

  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      let mod;
      [s, mod] = algo.func(s);
      min = Math.min(min, s);
      max = Math.max(max, s);
      ctx.fillStyle = valueToColor(s, mod, algo.color);
      ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL);
    }
  }

  const time = (performance.now() - start).toFixed(2);

  document.getElementById("finalValue").textContent = s.toLocaleString();
  document.getElementById("iterations").textContent = (GRID_W * GRID_H).toLocaleString();
  document.getElementById("minValue").textContent = min.toLocaleString();
  document.getElementById("maxValue").textContent = max.toLocaleString();
  document.getElementById("genTime").textContent = `${time} ms`;

  document.getElementById("status").textContent =
    `Generated ${GRID_W * GRID_H} values using ${currentAlgorithm}`;
};

// Quick actions
document.getElementById("randomSeed").onclick = () => {
  document.getElementById("seedInput").value =
    Math.floor(Math.random() * 999999);
};

document.getElementById("clearGrid").onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
