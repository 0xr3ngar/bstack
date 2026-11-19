// The content of this deck: the drawings (SCENES) and the Clawd tours (TOURS).
// This example deck is about a made-up bookshop app. Replace all of it.

// Each scene is a list of shapes in a 1200 by 560 drawing.
// A slide shows the scene named by its data-scene attribute.
const SCENES = {
  map: [
    { kind: "chip", x: 265, y: 70, w: 180, h: 48, fill: "yellow", text: "typo search" },
    { kind: "chip", x: 755, y: 70, w: 180, h: 48, fill: "yellow", text: "one-page pay" },

    { kind: "box", x: 20, y: 150, w: 180, h: 84, fill: "gray", title: "Visit", lines: ["home page"] },
    { kind: "box", x: 265, y: 150, w: 180, h: 84, fill: "blue", title: "Search", lines: ["find a book"] },
    { kind: "box", x: 510, y: 150, w: 180, h: 84, fill: "blue", title: "Cart", lines: ["collect books"] },
    { kind: "box", x: 755, y: 150, w: 180, h: 84, fill: "blue", title: "Pay", lines: ["card, wallet"] },
    { kind: "box", x: 1000, y: 150, w: 180, h: 84, fill: "green", title: "Deliver", lines: ["post, pickup"] },
    { kind: "arrow", from: [200, 192], to: [265, 192] },
    { kind: "arrow", from: [445, 192], to: [510, 192] },
    { kind: "arrow", from: [690, 192], to: [755, 192] },
    { kind: "arrow", from: [935, 192], to: [1000, 192] },

    { kind: "box", x: 510, y: 268, w: 670, h: 84, fill: "violet", title: "order tracking", lines: ["one status, from the cart to the door"] },

    { kind: "frame", x: 20, y: 390, w: 1160, h: 150, title: "around the shop" },
    { kind: "chip", x: 60, y: 455, w: 240, h: 52, fill: "green", text: "tests run in 4 minutes" },
    { kind: "chip", x: 330, y: 455, w: 170, h: 52, fill: "red", text: "6 bug fixes" },
    { kind: "chip", x: 530, y: 455, w: 230, h: 52, fill: "blue", text: "new error dashboard" },
  ],

  pay: [
    { kind: "frame", x: 20, y: 10, w: 1160, h: 170, title: "before" },
    { kind: "box", x: 60, y: 76, w: 200, h: 76, fill: "gray", title: "cart" },
    { kind: "box", x: 340, y: 76, w: 200, h: 76, fill: "red", title: "address page" },
    { kind: "box", x: 620, y: 76, w: 200, h: 76, fill: "red", title: "card page" },
    { kind: "box", x: 900, y: 76, w: 240, h: 76, fill: "red", title: "confirm page" },
    { kind: "arrow", from: [260, 114], to: [340, 114] },
    { kind: "arrow", from: [540, 114], to: [620, 114] },
    { kind: "arrow", from: [820, 114], to: [900, 114] },

    { kind: "frame", x: 20, y: 210, w: 1160, h: 335, title: "now" },
    { kind: "box", x: 60, y: 340, w: 200, h: 76, fill: "gray", title: "cart" },
    { kind: "box", x: 400, y: 300, w: 400, h: 156, fill: "green", title: "one pay page", lines: ["address, card and confirm"] },
    { kind: "box", x: 940, y: 340, w: 200, h: 76, fill: "gray", title: "order placed" },
    { kind: "arrow", from: [260, 378], to: [400, 378] },
    { kind: "arrow", from: [800, 378], to: [940, 378] },
    { kind: "gone", x: 330, y: 480, w: 170, h: 46, text: "address page" },
    { kind: "gone", x: 520, y: 480, w: 170, h: 46, text: "card page" },
    { kind: "gone", x: 710, y: 480, w: 170, h: 46, text: "confirm page" },
    { kind: "note", x: 960, y: 510, text: "deleted" },
  ],

  fixes: [
    { kind: "chip", x: 20, y: 40, w: 570, h: 62, fill: "green", text: "the cart keeps its books after a login" },
    { kind: "chip", x: 610, y: 40, w: 570, h: 62, fill: "green", text: "search finds titles with an accent" },
    { kind: "chip", x: 20, y: 124, w: 570, h: 62, fill: "green", text: "a sold-out book shows as sold out" },
    { kind: "chip", x: 610, y: 124, w: 570, h: 62, fill: "green", text: "the receipt email has the right total" },
    { kind: "chip", x: 20, y: 208, w: 570, h: 62, fill: "green", text: "the back button keeps the search text" },
    { kind: "chip", x: 610, y: 208, w: 570, h: 62, fill: "green", text: "a pickup order shows the shop address" },
  ],
};

// The tour of each slide. data-tour on the Clawd element picks it.
// "at" places Clawd when the step starts, "to" walks it there over the step.
// A point is { svg: [x, y] } in the slide's drawing, { card: index } on a slide
// with cards, or { rel: [x, y] } as a share of the slide's width and height.
const TOURS = {
  title: [
    { at: { rel: [-0.08, 0.84] }, ms: 400, mode: "ready" },
    { to: { rel: [0.62, 0.84] }, ms: 2600, mode: "walk" },
    { ms: 2200, mode: "wave", say: "hi, I'm Clawd" },
    { ms: 2000, mode: "wave", say: "two weeks, six slides" },
  ],
  map: [
    { at: { svg: [110, 150] }, ms: 1600, mode: "ready", say: "the helicopter view" },
    { to: { svg: [355, 70] }, ms: 1200, mode: "walk", arc: 40 },
    { to: { svg: [845, 70] }, ms: 1500, mode: "run", arc: 30, say: "a buyer goes this way" },
    { ms: 2600, mode: "dance" },
  ],
  pay: [
    { at: { svg: [440, 76] }, ms: 2200, mode: "tired", say: "page after page…" },
    { to: { svg: [1040, 340] }, ms: 1400, mode: "run", arc: 60, say: "one page!" },
    { ms: 2800, mode: "dance" },
  ],
  text: [
    { at: { card: 0 }, ms: 2400, mode: "tired", say: "so… many… words…" },
    { to: { card: 1 }, ms: 1000, mode: "walk", arc: 80 },
    { ms: 1200, mode: "stamp", stamp: 1, say: "short and clear" },
    { ms: 3000, mode: "dance" },
  ],
  fixes: [
    { at: { svg: [305, 40] }, ms: 1400, mode: "ready", say: "bug hunt" },
    { ms: 1800, mode: "hammer", say: "squash" },
    { to: { svg: [895, 40] }, ms: 1000, mode: "run", arc: 50 },
    { ms: 1800, mode: "hammer", say: "squash" },
    { ms: 3000, mode: "party", say: "6 down" },
  ],
  questions: [
    { at: { rel: [0.5, 0.84] }, ms: 2400, mode: "think", say: "hmm…" },
    { ms: 2000, mode: "think", say: "questions?" },
    { ms: 2000, mode: "wave", say: "ask me anything (I'm a crab)" },
  ],
};
