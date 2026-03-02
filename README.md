# Timer App — HTML · CSS · JavaScript

> A clean, responsive timing utility built with vanilla HTML, CSS, and JavaScript — no external libraries or frameworks.

**Live Demo:** https://mesmatmm.github.io/Timer/

---

## Features

- ⏱ **Stopwatch** — start, pause, resume, and clear with millisecond precision
- ⏳ **Countdown** — enter time via a numeric keypad, then start/pause/reset
- 🎂 **Age Calculator** — enter any birthday and see your exact elapsed age update live
- 📅 **Next Birthday Countdown** — see exactly how long until someone's next birthday
- 🕐 **Analog + Digital Clock** — live current time shown in both formats
- 🖥 **Full Screen Mode** — dedicated page for Stopwatch/Countdown without distractions
- 📱 **Responsive Design** — adapts cleanly from mobile to desktop

---

## Project Structure

```
timer-app/
├── index.html                  # Main page
├── stopwatch_fullscreen.html   # Full-screen Stopwatch / Countdown
├── assets/
│   └── bg.jpg                  # Background image
├── css/
│   ├── style.css               # Main stylesheet
│   └── fullscreen.css          # Full-screen page stylesheet
└── js/
    ├── stopwatch.js            # Stopwatch logic
    ├── countdown.js            # Countdown logic
    ├── tabs.js                 # Tab-switching logic
    ├── age.js                  # Age calculator & next-birthday countdown
    └── clock.js                # Analog clock (Canvas API)
```

---

## Bug Fixes & Improvements (v2)

### 🐛 Bugs Fixed

| # | Issue | Fix |
|---|-------|-----|
| 1 | Typo `"Puase"` used as state comparison | Renamed to `"Pause"` throughout |
| 2 | `formatMs()` declared twice in one file | Removed duplicate declaration |
| 3 | `myVar` scoping bug — `clearInterval` called on `undefined` | Moved `ageIntervalId` to module scope |
| 4 | Timer drift — `setInterval(fn, 111)` accumulated error over time | All timers now use `Date.now()` for wall-clock accuracy |
| 5 | State tracked via `innerHTML` comparisons | Replaced with proper boolean state variables (`isRunning`, `isPaused`) |
| 6 | Hardcoded personal dates in `script.js` | Replaced with user-configurable `<input type="date">` fields |

### ✨ Improvements

- **Separated concerns** — original monolithic `stopwatch_countdown.js` (and `script.js`) split into `stopwatch.js`, `countdown.js`, `tabs.js`, `age.js`, `clock.js`
- **CSS Variables** — colours and radii now use `--css-variables` for easy theming
- **Accessibility** — tabs use `role="tab"`, `aria-selected`, `aria-controls`; keypad cells have `role="button"` and `tabindex`; keyboard navigation (arrow keys, Enter, Space) supported throughout
- **Countdown end feedback** — red flash animation when countdown reaches zero
- **Responsive keypad** — switches from 6-column to 3-column grid on small screens
- **Analog clock performance** — static face & numbers rendered once into an offscreen canvas; only hands redrawn each second
- **Organised file structure** — HTML at root, CSS in `css/`, JS in `js/`, images in `assets/`
- **Strict equality** — all `==` comparisons replaced with `===`
- **IIFEs** — each JS module wrapped in an IIFE to avoid polluting the global scope

---

## How to Run

No build step needed. Just open `index.html` in any modern browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES6+ support.

---

## Author

Designed by © Mahmoud Esmat | ® MEM
