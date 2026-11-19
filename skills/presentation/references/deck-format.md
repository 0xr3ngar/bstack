# Deck format

The deck is a folder with `index.html`, `content.js`, `style.css`, `deck.js`, `clawd.js` and `vendor/`. Edit `index.html` and `content.js`. Add CSS to `style.css` only for a layout that this page does not cover.

Arrow keys or a click move forward. A click on the left third goes back. `#4` in the URL opens slide 4.

## Slide layouts

Every slide is a `<section class="slide" data-scene="NAME">` with one Clawd element as its first child:

```html
<span class="clawd" data-clawd data-tour="NAME" role="img" aria-label="What Clawd does"></span>
```

| Layout | Markup |
| --- | --- |
| Title or closing | `class="slide center"`, then `.eyebrow`, `h1.title`, `.byline` |
| Drawing | `.eyebrow`, `h1`, optional `p.lede`, then `<svg class="scene" viewBox="0 0 1200 560">`. The scene comes from `SCENES[NAME]`. |
| Drawing with numbers | The drawing layout, then `div.stats` with three `<div><b>number</b><span>what it counts</span></div>`. Add `class="add"` or `class="del"` to the `b` for green or red. |
| Before and now text | `div.compare` with two `div.card`, `data-tone="red"` and `data-tone="green"` |
| Cards | `div.verdict` (two by two) or `div.verdict row` (three in a row) with `div.card` |

A card is:

```html
<div class="card" data-tone="green">
  <svg class="card-frame" aria-hidden="true"></svg>
  <span class="stamp" aria-hidden="true">approved</span>
  <h2>Heading</h2>
  <p>One or two sentences.</p>
</div>
```

`data-tone` is `green`, `red` or `blue`. The `stamp` is optional. It appears when a tour step names the card in `stamp`.

The space between the heading and the drawing is where Clawd walks. Keep the `h1` on one line and use at most one `p.lede`.

## Scenes

A scene is a list of shapes in a drawing of 1200 by 560 units. Keep every shape inside that area. Later shapes draw on top of earlier ones.

| Kind | Fields | Use |
| --- | --- | --- |
| `box` | `x, y, w, h, fill, title`, optional `lines` (small text under the title), `textTop` | A step or a part |
| `chip` | `x, y, w, h, fill, text` | A short label, or one line of a list |
| `frame` | `x, y, w, h, title` | A dashed group, such as "before" and "now" |
| `gone` | `x, y, w, h, text` | A deleted part, struck through in red |
| `arrow` | `from: [x, y], to: [x, y]`, optional `bend`, `label` with `labelAt: [x, y]` | A flow |
| `label` | `x, y, text, size` | Gray handwriting, centred on `x` |
| `note` | `x, y, text` | Red handwriting for a problem, centred on `x` |

`fill` is `blue`, `green`, `violet`, `yellow`, `red` or `gray`. Use gray for inputs and outputs, blue for steps, green for results, red for problems, yellow for settings or highlights, and violet for a part that spans steps.

Text does not wrap. A box title has about 12 units for each character and a small line or a chip has about 10, so a 200-unit box holds a title of about 15 characters. Widen the box or shorten the text.

## Tours

A tour is a list of steps. The last step holds until the slide is shown again.

| Field | Meaning |
| --- | --- |
| `ms` | How long the step lasts |
| `mode` | What Clawd does |
| `at` | A point where Clawd appears when the step starts. The first step needs it. |
| `to` | A point Clawd moves to during the step |
| `arc` | The height of the hop on the way |
| `say` | The text of the speech bubble |
| `stamp` | The index of a card to stamp |

A point is `{ svg: [x, y] }` in the drawing, `{ card: index }` on top of a card, or `{ rel: [x, y] }` as a share of the slide's width and height. Clawd's feet stand on the point, so use the top edge of a box.

Modes: `ready`, `walk`, `run`, `sweat`, `tired`, `juggle`, `bonk`, `think`, `wave`, `hammer`, `stamp`, `dance`, `party`.

Clawd is about 100 units tall in a drawing and the bubble sits above it. In the last step, put Clawd where it and its bubble cover no text, or leave `say` out of the last step.
