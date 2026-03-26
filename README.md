# Timer App — HTML · CSS · JavaScript

> A clean, responsive timing utility built with vanilla HTML, CSS, and JavaScript — no external libraries or frameworks.

**Live Demo:** https://mesmatmm.github.io/Timer/

---

## Features

- ⏱ **Stopwatch** — start, pause, resume, and clear with centisecond precision; hr / min / sec labels
- ⏳ **Countdown** — enter time via a numeric keypad, then start/pause/reset; animated flash on finish
- 🎂 **Age Calculator** — enter any birthday and see your exact elapsed age update live
- 📅 **Next Birthday Countdown** — see exactly how long until someone's next birthday
- 🕐 **Analog + Digital Clock** — live current time in both formats; links to World Clock full screen
- 🌍 **World Clock** — full-screen hero clock with live city cards (Cairo, Riyadh, Ottawa, Tunis, Rabat, Washington D.C., London, Paris)
- 🖥 **Full Screen Mode** — browser fullscreen toggle on Stopwatch/Countdown and World Clock pages
- 🎨 **Animated Background** — living gradient overlay across all pages
- 📱 **Responsive Design** — adapts cleanly from mobile to desktop

---

## Project Structure

```
timer-app/
├── index.html                  # Main page
├── stopwatch_fullScreen.html   # Full-screen Stopwatch / Countdown
├── clock_fullscreen.html       # Full-screen World Clock
├── assets/
│   └── bg.jpg                  # Background image
├── css/
│   ├── style.css               # Main stylesheet
│   ├── fullscreen.css          # Stopwatch full-screen stylesheet
│   └── clock_fullscreen.css    # World clock full-screen stylesheet
└── js/
    ├── stopwatch.js            # Stopwatch logic
    ├── countdown.js            # Countdown logic
    ├── tabs.js                 # Tab-switching logic
    ├── age.js                  # Age calculator & next-birthday countdown
    ├── clock.js                # Analog clock (Canvas API)
    └── clock_fullscreen.js     # World clock / hero digital clock logic
```

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
