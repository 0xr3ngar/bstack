// Pixel-art Clawd, built on the engine from the clawd-animation skill (mmguo.dev/clawd):
// a 14x8 body in #CD6E58, 1x1 eyes, no mouth, props as pixel matrices, particles and eased motion.
// Each slide has one Clawd that walks a tour across the slide (data-tour picks it from TOURS in content.js).
// Clicking Clawd pokes it.

const CLAWD_BODY_COLOR = "#CD6E58";
const CLAWD_EYE_COLOR = "#000000";

const CLAWD_BODY = [
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0],
];
const EYE_LEFT = { x: 4, y: 1 };
const EYE_RIGHT = { x: 9, y: 1 };
const EYE_OFFSETS = {
  forward: { dx: 0, dy: 0 },
  look_right: { dx: 1, dy: 0 },
  look_left: { dx: -1, dy: 0 },
  look_down: { dx: 0, dy: 1 },
};
// Walking lifts one pair of legs, then the other.
const LEGS_A = [3, 8];
const LEGS_B = [5, 10];

// Props: 0 is empty, other numbers index the colors passed to drawSprite.
const CUBE = [
  [1, 1, 1],
  [1, 2, 1],
  [1, 1, 1],
];
const HAMMER_UP = [
  [1, 1, 1, 1],
  [1, 3, 1, 1],
  [0, 2, 0, 0],
  [0, 2, 0, 0],
  [0, 2, 0, 0],
];
const HAMMER_DOWN = [
  [0, 0, 0, 1, 1],
  [2, 2, 2, 1, 3],
  [0, 0, 0, 1, 1],
];
const STAMP = [
  [0, 1, 1, 1, 0],
  [0, 3, 1, 1, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
];
const PARTY_HAT = [
  [0, 0, 3, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 2, 1, 0],
  [1, 2, 1, 2, 1],
];
const NOTE = [
  [0, 1, 1],
  [0, 1, 0],
  [1, 1, 0],
];
const LETTER_Z = [
  [1, 1, 1],
  [0, 0, 1],
  [0, 1, 0],
  [1, 1, 1],
];
const BANG = [[1], [1], [1], [0], [1]];
const QUESTION = [
  [0, 1, 1, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 0, 0],
];
const STAR_COLOR = "#fab005";
const CONFETTI = ["#fa5252", "#40c057", "#228be6", "#fab005", "#be4bdb"];

const GRID_W = 26;
const GRID_H = 18;
const CELL = 6;
const CLAWD_FPS = 30;
// Clawd's feet are on grid row 17 when the body starts on row 9.
const BODY_X = 6;
const BODY_Y = 9;
const FEET_ROW = 17;

const POKE_LINES = ["hey!", "I'm working here", "that tickles", "rude.", "ok ok, I'm going"];
const POKE_MS = 900;

function makeScene(host) {
  const canvas = document.createElement("canvas");
  canvas.width = GRID_W * CELL;
  canvas.height = GRID_H * CELL;
  canvas.className = "clawd-canvas";
  const bubble = document.createElement("span");
  bubble.className = "bubble";
  host.textContent = "";
  host.appendChild(bubble);
  host.appendChild(canvas);
  return { host, canvas, bubble, ctx: canvas.getContext("2d"), particles: [], frame: 0, mode: "ready" };
}

function px(scene, gx, gy, color) {
  scene.ctx.fillStyle = color;
  scene.ctx.fillRect(Math.round(gx) * CELL, Math.round(gy) * CELL, CELL, CELL);
}

function drawSprite(scene, sprite, colors, ox, oy) {
  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const value = sprite[row][col];
      if (value === 0) {
        continue;
      }
      px(scene, ox + col, oy + row, colors[value - 1]);
    }
  }
}

// legsUp names the leg columns lifted this frame, so their bottom row is left out.
function drawClawd(scene, ox, oy, eyes, legsUp) {
  for (let row = 0; row < CLAWD_BODY.length; row++) {
    for (let col = 0; col < CLAWD_BODY[row].length; col++) {
      if (CLAWD_BODY[row][col] !== 1) {
        continue;
      }
      const isLiftedFoot = row === 7 && legsUp !== undefined && legsUp.includes(col);
      if (isLiftedFoot) {
        continue;
      }
      px(scene, ox + col, oy + row, CLAWD_BODY_COLOR);
    }
  }
  if (eyes === "blink") {
    return;
  }
  const look = EYE_OFFSETS[eyes] ?? EYE_OFFSETS.forward;
  px(scene, ox + EYE_LEFT.x + look.dx, oy + EYE_LEFT.y + look.dy, CLAWD_EYE_COLOR);
  px(scene, ox + EYE_RIGHT.x + look.dx, oy + EYE_RIGHT.y + look.dy, CLAWD_EYE_COLOR);
}

function addParticle(scene, particle) {
  scene.particles.push({ vx: 0, vy: 0, gravity: 0.04, life: 1, fade: 0.035, ...particle });
}

function tickParticles(scene) {
  for (let i = scene.particles.length - 1; i >= 0; i--) {
    const particle = scene.particles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.gravity;
    particle.life -= particle.fade;
    if (particle.life <= 0) {
      scene.particles.splice(i, 1);
      continue;
    }
    if (particle.sprite !== undefined) {
      drawSprite(scene, particle.sprite, [particle.color], particle.x, particle.y);
      continue;
    }
    px(scene, particle.x, particle.y, particle.color);
  }
}

function blinking(frame) {
  return frame % 80 >= 76;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function walkingLegs(frame, speed) {
  return Math.floor(frame / speed) % 2 === 0 ? LEGS_A : LEGS_B;
}

function sweatDrop(scene, ox, oy) {
  addParticle(scene, { x: ox + 13, y: oy, vx: 0.15, vy: -0.25, gravity: 0.05, color: "#74c0fc" });
}

// Three stars circle the head, as in a cartoon after a bonk.
function drawStars(scene, ox, oy, frame) {
  for (let i = 0; i < 3; i++) {
    const angle = frame / 4 + (i * Math.PI * 2) / 3;
    px(scene, ox + 7 + Math.cos(angle) * 6, oy - 2 + Math.sin(angle) * 1.5, STAR_COLOR);
  }
}

function renderJuggle(scene, ox, oy, f) {
  const period = 40;
  const cubes = [
    { phase: 0, colors: ["#e8b923", "#fff3bf"] },
    { phase: 0.5, colors: ["#7950f2", "#e5dbff"] },
  ];
  let leadingX = 0;
  for (const cube of cubes) {
    const t = ((f / period) + cube.phase) % 1;
    const goingRight = t < 0.5;
    const along = goingRight ? t * 2 : (1 - t) * 2;
    const x = ox + 1 + along * 10;
    const height = Math.sin(along * Math.PI) * (goingRight ? 7 : 3);
    drawSprite(scene, CUBE, cube.colors, x, oy - 2 - height);
    if (goingRight) {
      leadingX = x;
    }
  }
  const eyes = blinking(f) ? "blink" : leadingX > ox + 7 ? "look_right" : "look_left";
  drawClawd(scene, ox, oy + (Math.floor(f / 11) % 2), eyes);
  if (f % 40 === 0) {
    sweatDrop(scene, ox, oy);
  }
}

// A cube drops on Clawd's head, bounces off, and leaves it seeing stars.
function renderBonk(scene, ox, oy, f) {
  const fallFrames = 9;
  if (f < fallFrames) {
    drawSprite(scene, CUBE, ["#e8b923", "#fff3bf"], ox + 6, (f / fallFrames) * (oy - 3));
    drawClawd(scene, ox, oy, "look_right");
    return;
  }
  const since = f - fallFrames;
  if (since < 14) {
    drawSprite(scene, CUBE, ["#e8b923", "#fff3bf"], ox + 7 + since * 0.8, oy - 3 - Math.sin((since / 14) * Math.PI) * 4 + since * 0.4);
  }
  const wobble = Math.round(Math.sin(f / 3));
  const eyes = Math.floor(f / 5) % 2 === 0 ? "look_left" : "look_right";
  drawClawd(scene, ox + wobble, oy + 1, eyes);
  drawStars(scene, ox + wobble, oy, f);
}

function renderWalk(scene, ox, oy, f) {
  const legs = walkingLegs(f, 4);
  const bob = legs === LEGS_A ? 0 : 1;
  drawClawd(scene, ox, oy - bob, blinking(f) ? "blink" : "look_right", legs);
}

function renderSweatWalk(scene, ox, oy, f) {
  renderWalk(scene, ox, oy, f);
  if (f % 7 === 0) {
    sweatDrop(scene, ox, oy);
  }
}

// Speed lines trail behind; the canvas is mirrored when Clawd runs left, so behind is always the left.
function renderRun(scene, ox, oy, f) {
  const legs = walkingLegs(f, 2);
  drawClawd(scene, ox, oy - (legs === LEGS_A ? 1 : 0), "look_right", legs);
  for (const row of [2, 4, 6]) {
    const length = 2 + ((f + row) % 3);
    for (let i = 0; i < length; i++) {
      px(scene, ox - 2 - i - (row % 4), oy + row, "#adb5bd");
    }
  }
}

function renderTired(scene, ox, oy, f) {
  drawClawd(scene, ox, oy + 1, f % 60 > 50 ? "blink" : "look_down");
  if (f % 26 === 0) {
    addParticle(scene, { sprite: LETTER_Z, x: ox + 12, y: oy - 2, vx: 0.12, vy: -0.18, gravity: -0.002, fade: 0.02, color: "#868e96" });
  }
  if (f % 33 === 0) {
    sweatDrop(scene, ox, oy);
  }
}

function renderReady(scene, ox, oy, f) {
  const crouch = Math.floor(f / 8) % 2;
  drawClawd(scene, ox, oy + crouch, blinking(f) ? "blink" : "look_right");
}

function renderHammer(scene, ox, oy, f) {
  const cycle = f % 16;
  if (cycle < 9) {
    drawClawd(scene, ox, oy, "look_right");
    drawSprite(scene, HAMMER_UP, ["#868e96", "#8d6e63", "#dee2e6"], ox + 11, oy - 5);
    return;
  }
  drawClawd(scene, ox, oy + 1, "look_down");
  drawSprite(scene, HAMMER_DOWN, ["#868e96", "#8d6e63", "#dee2e6"], ox + 12, oy + 5);
  if (cycle === 9) {
    for (let i = 0; i < 6; i++) {
      addParticle(scene, { x: ox + 17, y: oy + 7, vx: (Math.random() - 0.3) * 1.2, vy: -Math.random() * 0.8 - 0.2, color: i % 2 === 0 ? STAR_COLOR : "#e03131" });
    }
  }
}

function renderDance(scene, ox, oy, f) {
  const hop = Math.round(Math.abs(Math.sin(f / 5)) * 2);
  const sway = Math.floor(f / 8) % 2 === 0 ? -1 : 1;
  const eyes = blinking(f) ? "blink" : sway < 0 ? "look_left" : "look_right";
  drawClawd(scene, ox + sway, oy - hop, eyes, sway < 0 ? LEGS_A : LEGS_B);
  if (f % 14 === 0) {
    const color = f % 28 === 0 ? "#7950f2" : "#228be6";
    addParticle(scene, { sprite: NOTE, x: ox + (f % 28 === 0 ? 1 : 12), y: oy - 3, vx: (Math.random() - 0.5) * 0.3, vy: -0.25, gravity: -0.003, fade: 0.02, color });
  }
}

function renderStamp(scene, ox, oy, f) {
  const pressed = f >= 12 && f < 22;
  const colors = ["#795547", "#2f9e44", "#ffffff"];
  if (!pressed) {
    drawClawd(scene, ox, oy, "look_down");
    drawSprite(scene, STAMP, colors, ox + 13, oy - 4);
    return;
  }
  drawClawd(scene, ox, oy + 1, "look_down");
  drawSprite(scene, STAMP, colors, ox + 14, oy + 4);
  if (f === 12) {
    for (let i = 0; i < 7; i++) {
      addParticle(scene, { x: ox + 16, y: oy + 8, vx: (Math.random() - 0.5) * 1.4, vy: -Math.random() * 0.6, color: "#2f9e44" });
    }
  }
}

function renderParty(scene, ox, oy, f) {
  const hop = Math.round(Math.abs(Math.sin(f / 4)) * 3);
  const eyes = blinking(f) ? "blink" : Math.floor(f / 10) % 2 === 0 ? "look_left" : "look_right";
  drawClawd(scene, ox, oy - hop, eyes, hop > 1 ? LEGS_A : undefined);
  drawSprite(scene, PARTY_HAT, ["#e64980", "#fab005", "#fab005"], ox + 4, oy - hop - 4);
  if (f % 2 === 0) {
    const color = CONFETTI[f % CONFETTI.length];
    addParticle(scene, { x: Math.random() * GRID_W, y: 0, vx: (Math.random() - 0.5) * 0.3, vy: 0.2, gravity: 0.01, fade: 0.02, color });
  }
}

// The right claw lifts off the body and waves up and down.
function renderWave(scene, ox, oy, f) {
  const up = Math.floor(f / 6) % 2 === 0;
  drawClawd(scene, ox, oy, blinking(f) ? "blink" : "forward");
  px(scene, ox + 13, oy + 1, CLAWD_BODY_COLOR);
  px(scene, ox + 14, up ? oy - 1 : oy, CLAWD_BODY_COLOR);
  px(scene, ox + 14, up ? oy - 2 : oy + 1, CLAWD_BODY_COLOR);
}

function renderThink(scene, ox, oy, f) {
  const glance = Math.floor(f / 14) % 4;
  const eyes = blinking(f) ? "blink" : glance === 1 ? "look_right" : glance === 3 ? "look_left" : "forward";
  drawClawd(scene, ox, oy, eyes);
  const bob = Math.floor(f / 10) % 2;
  drawSprite(scene, QUESTION, ["#495057"], ox + 15, oy - 5 - bob);
}

function renderSurprised(scene, ox, oy) {
  drawClawd(scene, ox, oy, "forward");
  drawSprite(scene, BANG, ["#e03131"], ox + 7, oy - 7);
}

const CLAWD_RENDERERS = {
  juggle: renderJuggle,
  bonk: renderBonk,
  walk: renderWalk,
  sweat: renderSweatWalk,
  run: renderRun,
  tired: renderTired,
  ready: renderReady,
  hammer: renderHammer,
  dance: renderDance,
  stamp: renderStamp,
  party: renderParty,
  surprised: renderSurprised,
  wave: renderWave,
  think: renderThink,
};

function renderClawd(scene) {
  scene.ctx.clearRect(0, 0, GRID_W * CELL, GRID_H * CELL);
  const render = CLAWD_RENDERERS[scene.mode] ?? renderReady;
  render(scene, BODY_X, BODY_Y, scene.frame);
  tickParticles(scene);
}

// A tour point in pixels from the slide's top-left corner.
function resolvePoint(slide, point) {
  if (point.rel !== undefined) {
    return [slide.clientWidth * point.rel[0], slide.clientHeight * point.rel[1]];
  }
  const slideBox = slide.getBoundingClientRect();
  if (point.card !== undefined) {
    const card = slide.querySelectorAll(".card")[point.card];
    const cardBox = card.getBoundingClientRect();
    return [cardBox.left - slideBox.left + cardBox.width * 0.72, cardBox.top - slideBox.top + 6];
  }
  const svg = slide.querySelector(".scene");
  const box = svg.getBoundingClientRect();
  const [viewWidth, viewHeight] = [1200, 560];
  const scale = Math.min(box.width / viewWidth, box.height / viewHeight);
  const left = box.left + (box.width - viewWidth * scale) / 2;
  const top = box.top + (box.height - viewHeight * scale) / 2;
  return [left - slideBox.left + point.svg[0] * scale, top - slideBox.top + point.svg[1] * scale];
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeTour(host) {
  const scene = makeScene(host);
  const steps = TOURS[host.dataset.tour];
  const tour = { host, scene, slide: host.closest(".slide"), steps, index: -1, stepStart: 0, from: [0, 0], pos: [0, 0], facing: 1, pokedUntil: 0 };
  host.addEventListener("click", (event) => {
    event.stopPropagation();
    tour.pokedUntil = performance.now() + POKE_MS;
    scene.bubble.textContent = POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)];
  });
  return tour;
}

function startStep(tour, index, now) {
  tour.index = index;
  tour.stepStart = now;
  const step = tour.steps[index];
  if (index === 0) {
    for (const card of tour.slide.querySelectorAll(".card.stamped")) {
      card.classList.remove("stamped");
    }
    tour.facing = 1;
  }
  if (step.at !== undefined) {
    tour.pos = resolvePoint(tour.slide, step.at);
  }
  tour.from = [tour.pos[0], tour.pos[1]];
  tour.stamped = false;
  tour.scene.mode = step.mode;
  tour.scene.frame = 0;
  tour.scene.bubble.textContent = step.say ?? "";
}

function placeHost(tour, x, y) {
  const width = tour.host.offsetWidth;
  const height = (width * GRID_H) / GRID_W;
  tour.host.style.left = `${x - width / 2}px`;
  tour.host.style.top = `${y - (height * FEET_ROW) / GRID_H}px`;
  tour.scene.canvas.style.transform = tour.facing < 0 ? "scaleX(-1)" : "";
  const nearRightEdge = x > tour.slide.clientWidth * 0.8;
  tour.scene.bubble.classList.toggle("left", nearRightEdge);
  tour.scene.bubble.classList.toggle("empty", tour.scene.bubble.textContent === "");
}

// ?at=<ms> starts the first tour that far in, for screenshots of a later moment.
let startOffset = Number(new URLSearchParams(location.search).get("at")) || 0;

function advanceTour(tour, now) {
  if (tour.index === -1) {
    startStep(tour, 0, now - startOffset);
    startOffset = 0;
  }
  let step = tour.steps[tour.index];
  let duration = reduceMotion ? Infinity : step.ms;
  // Each step starts when the one before it was due to end, so a late frame catches up.
  // The last step never ends: Clawd keeps its final pose until the slide is shown again.
  const lastIndex = tour.steps.length - 1;
  while (tour.index < lastIndex && now - tour.stepStart >= duration) {
    if (step.to !== undefined) {
      tour.pos = resolvePoint(tour.slide, step.to);
    }
    if (step.stamp !== undefined) {
      tour.slide.querySelectorAll(".card")[step.stamp].classList.add("stamped");
    }
    startStep(tour, tour.index + 1, tour.stepStart + duration);
    step = tour.steps[tour.index];
    duration = step.ms;
  }
  const t = Math.min(1, (now - tour.stepStart) / duration);

  let [x, y] = tour.pos;
  if (step.to !== undefined) {
    const target = resolvePoint(tour.slide, step.to);
    const eased = easeInOut(t);
    x = tour.from[0] + (target[0] - tour.from[0]) * eased;
    y = tour.from[1] + (target[1] - tour.from[1]) * eased - (step.arc ?? 0) * Math.sin(Math.PI * t);
    if (target[0] !== tour.from[0]) {
      tour.facing = target[0] > tour.from[0] ? 1 : -1;
    }
  }
  if (step.stamp !== undefined && t >= 0.4 && !tour.stamped) {
    tour.stamped = true;
    tour.slide.querySelectorAll(".card")[step.stamp].classList.add("stamped");
  }

  const isPoked = now < tour.pokedUntil;
  if (isPoked) {
    const left = (tour.pokedUntil - now) / POKE_MS;
    y -= Math.sin(Math.PI * left) * 30;
    tour.scene.mode = "surprised";
  } else if (tour.scene.mode === "surprised") {
    tour.scene.mode = step.mode;
    tour.scene.bubble.textContent = step.say ?? "";
  }
  placeHost(tour, x, y);
}

const tours = [];
for (const host of document.querySelectorAll("[data-clawd]")) {
  tours.push(makeTour(host));
}

// One loop moves and draws every Clawd, but only the one on the visible slide.
let lastClawdTick = 0;
function clawdLoop(now) {
  const isDue = now - lastClawdTick >= 1000 / CLAWD_FPS;
  for (const tour of tours) {
    const isOnScreen = tour.slide.classList.contains("active");
    if (!isOnScreen) {
      tour.index = -1;
      continue;
    }
    advanceTour(tour, now);
    if (isDue) {
      renderClawd(tour.scene);
      tour.scene.frame += 1;
    }
  }
  if (isDue) {
    lastClawdTick = now;
  }
  requestAnimationFrame(clawdLoop);
}
requestAnimationFrame(clawdLoop);
