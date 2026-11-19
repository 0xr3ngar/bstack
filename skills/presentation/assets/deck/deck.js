// The deck engine. Slide content lives in content.js (SCENES) and index.html.

// Excalidraw colors: a pastel fill under a dark hand-drawn stroke.
const COLORS = {
  blue: "#a5d8ff",
  green: "#b2f2bb",
  violet: "#d0bfff",
  yellow: "#ffec99",
  red: "#ffc9c9",
  gray: "#e9ecef",
};
const INK = "#1e1e1e";
const NOTE_RED = "#e03131";
const SVG_NS = "http://www.w3.org/2000/svg";

// A fixed seed draws the same wobble every time the slide is shown.
function roughOptions(fill, seed) {
  return {
    seed: seed,
    roughness: 1.2,
    bowing: 1,
    stroke: INK,
    strokeWidth: 1.6,
    fill: fill,
    fillStyle: "hachure",
    hachureGap: 7,
    fillWeight: 1.1,
  };
}

function addText(svg, x, y, text, options) {
  const node = document.createElementNS(SVG_NS, "text");
  node.setAttribute("x", String(x));
  node.setAttribute("y", String(y));
  node.setAttribute("text-anchor", options.anchor ?? "middle");
  node.setAttribute("font-size", String(options.size ?? 20));
  if (options.color !== undefined) {
    node.setAttribute("style", `fill: ${options.color}`);
  }
  node.textContent = text;
  svg.appendChild(node);
}

// The title sits above the box's centre and each extra line below it.
function drawBox(svg, rc, shape, seed) {
  const fill = COLORS[shape.fill];
  svg.appendChild(rc.rectangle(shape.x, shape.y, shape.w, shape.h, roughOptions(fill, seed)));
  const lines = shape.lines ?? [];
  const centreX = shape.x + shape.w / 2;
  const lineHeight = 24;
  const blockHeight = 28 + lines.length * lineHeight;
  let y = shape.y + (shape.h - blockHeight) / 2 + 24;
  if (shape.textTop === true) {
    y = shape.y + 44;
  }
  addText(svg, centreX, y, shape.title, { size: 24 });
  for (const line of lines) {
    y += lineHeight;
    addText(svg, centreX, y, line, { size: 17 });
  }
}

function drawFrame(svg, rc, shape, seed) {
  const options = roughOptions(undefined, seed);
  options.strokeLineDash = [10, 8];
  options.strokeWidth = 1.3;
  svg.appendChild(rc.rectangle(shape.x, shape.y, shape.w, shape.h, options));
  addText(svg, shape.x + shape.w / 2, shape.y + 34, shape.title, { size: 22 });
}

function drawChip(svg, rc, shape, seed) {
  const fill = COLORS[shape.fill];
  svg.appendChild(rc.rectangle(shape.x, shape.y, shape.w, shape.h, roughOptions(fill, seed)));
  addText(svg, shape.x + shape.w / 2, shape.y + shape.h / 2 + 7, shape.text, { size: 19 });
}

// A deleted part: a grey box struck through with two red lines.
function drawGone(svg, rc, shape, seed) {
  svg.appendChild(rc.rectangle(shape.x, shape.y, shape.w, shape.h, roughOptions(COLORS.gray, seed)));
  addText(svg, shape.x + shape.w / 2, shape.y + shape.h / 2 + 6, shape.text, { size: 18, color: "#495057" });
  const strike = { seed: seed + 1, roughness: 1.4, stroke: NOTE_RED, strokeWidth: 2.4 };
  svg.appendChild(rc.line(shape.x - 6, shape.y + 6, shape.x + shape.w + 6, shape.y + shape.h - 6, strike));
  svg.appendChild(rc.line(shape.x - 6, shape.y + shape.h - 6, shape.x + shape.w + 6, shape.y + 6, strike));
}

// The arrow bends through a point pushed sideways from the middle of the line.
function drawArrow(svg, rc, shape, seed) {
  const [x1, y1] = shape.from;
  const [x2, y2] = shape.to;
  const bend = shape.bend ?? 0;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const midX = (x1 + x2) / 2 - (dy / length) * bend;
  const midY = (y1 + y2) / 2 + (dx / length) * bend;
  const options = { seed: seed, roughness: 1, bowing: 0.6, stroke: INK, strokeWidth: 1.8 };
  svg.appendChild(rc.curve([[x1, y1], [midX, midY], [x2, y2]], options));

  const angle = Math.atan2(y2 - midY, x2 - midX);
  const headLength = 16;
  for (const side of [-1, 1]) {
    const headAngle = angle + Math.PI + side * 0.45;
    const hx = x2 + Math.cos(headAngle) * headLength;
    const hy = y2 + Math.sin(headAngle) * headLength;
    svg.appendChild(rc.line(x2, y2, hx, hy, options));
  }

  if (shape.label === undefined) {
    return;
  }
  addText(svg, shape.labelAt[0], shape.labelAt[1], shape.label, { size: 17, color: "#495057" });
}

const DRAWERS = {
  box: drawBox,
  frame: drawFrame,
  chip: drawChip,
  gone: drawGone,
  arrow: drawArrow,
  label: (svg, rc, shape) => addText(svg, shape.x, shape.y, shape.text, { size: shape.size, color: "#495057" }),
  note: (svg, rc, shape) => addText(svg, shape.x, shape.y, shape.text, { size: 21, color: NOTE_RED }),
};

function drawScene(svg, shapes) {
  if (svg.childNodes.length > 0) {
    return;
  }
  const rc = rough.svg(svg);
  let seed = 1;
  for (const shape of shapes) {
    DRAWERS[shape.kind](svg, rc, shape, seed);
    seed += 3;
  }
}

// Each card gets a hand-drawn border sized to the card. data-tone picks the color.
const CARD_TONES = {
  green: { fill: "#ebfbee", stroke: "#2b8a3e" },
  red: { fill: "#fff5f5", stroke: "#c92a2a" },
  blue: { fill: "#e7f5ff", stroke: "#1971c2" },
};

function drawCardFrames(slide) {
  const cards = slide.querySelectorAll(".card");
  let seed = 40;
  for (const card of cards) {
    const frame = card.querySelector(".card-frame");
    frame.replaceChildren();
    const box = frame.getBoundingClientRect();
    const tone = CARD_TONES[card.dataset.tone ?? "green"];
    const rc = rough.svg(frame);
    const options = roughOptions(tone.fill, seed);
    options.fillStyle = "solid";
    options.stroke = tone.stroke;
    frame.appendChild(rc.rectangle(4, 4, box.width - 8, box.height - 8, options));
    seed += 5;
  }
}

const slides = document.querySelectorAll(".slide");
const dots = document.getElementById("dots");
let current = 0;

for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Slide ${i + 1}`);
  dot.addEventListener("click", () => show(i));
  dots.appendChild(dot);
}

function show(index) {
  const last = slides.length - 1;
  current = Math.max(0, Math.min(index, last));
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.toggle("active", i === current);
    dots.children[i].classList.toggle("active", i === current);
  }
  const slide = slides[current];
  const scene = SCENES[slide.dataset.scene];
  if (scene !== undefined) {
    drawScene(slide.querySelector(".scene"), scene);
  }
  drawCardFrames(slide);
  history.replaceState(null, "", `#${current + 1}`);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
    show(current + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    show(current - 1);
  }
});

// Clicking the left third goes back, anywhere else goes forward.
document.getElementById("deck").addEventListener("click", (event) => {
  const goBack = event.clientX < window.innerWidth / 3;
  show(goBack ? current - 1 : current + 1);
});

window.addEventListener("resize", () => {
  drawCardFrames(slides[current]);
});

// ?still turns off the fade between slides, for screenshots.
if (new URLSearchParams(location.search).has("still")) {
  document.body.classList.add("still");
}

// The font must load before the first drawing, or the labels measure in the fallback font.
document.fonts.load('20px "Virgil"').then(() => {
  const fromHash = Number(location.hash.slice(1)) - 1;
  show(Number.isInteger(fromHash) ? fromHash : 0);
});
