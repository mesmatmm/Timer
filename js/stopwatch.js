/**
 * stopwatch.js
 * Handles all stopwatch functionality.
 * Fixes: typo "Puase" → "Pause", state tracked via variables (not innerHTML),
 *        uses Date.now() for accurate timing.
 */

(function () {
  'use strict';

  // --- DOM refs ---
  const sw_seconds_e = document.querySelector('#stopwatch_seconds');
  const sw_minutes_e = document.querySelector('#stopwatch_minutes');
  const sw_hours_e   = document.querySelector('#stopwatch_hours');
  const sw_ms_e      = document.querySelector('#stopwatch_milliseconds');
  const start_sw     = document.querySelector('#start_sw');
  const clear_sw     = document.querySelector('#clear_sw');

  if (!start_sw) return; // Guard: element not present on this page

  // --- State ---
  let isRunning  = false;
  let isPaused   = false;
  let intervalId = null;
  let startTimestamp = null;   // Date.now() when started / resumed
  let elapsedMs  = 0;          // total elapsed ms accumulated before pause

  // --- Helpers ---
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function pad3(n) { return n < 10 ? '00' + n : (n < 100 ? '0' + n : String(n)); }

  function renderTime(totalMs) {
    const ms      = totalMs % 1000;
    const totalS  = Math.floor(totalMs / 1000);
    const seconds = totalS % 60;
    const totalM  = Math.floor(totalS / 60);
    const minutes = totalM % 60;
    const hours   = Math.floor(totalM / 60);

    sw_hours_e.textContent   = pad2(hours);
    sw_minutes_e.textContent = pad2(minutes);
    sw_seconds_e.textContent = pad2(seconds);
    sw_ms_e.textContent      = pad3(ms);
  }

  function tick() {
    const currentMs = elapsedMs + (Date.now() - startTimestamp);
    renderTime(currentMs);
  }

  // --- Controls ---
  function startStopwatch() {
    isRunning      = true;
    isPaused       = false;
    startTimestamp = Date.now();
    intervalId     = setInterval(tick, 30);

    start_sw.textContent         = 'Pause';
    start_sw.style.backgroundColor = 'green';
  }

  function pauseStopwatch() {
    isPaused    = true;
    isRunning   = false;
    elapsedMs  += Date.now() - startTimestamp;
    clearInterval(intervalId);

    start_sw.textContent         = 'Resume';
    start_sw.style.backgroundColor = 'rgba(176, 0, 230, 0.7)';
  }

  function clearStopwatch() {
    clearInterval(intervalId);
    isRunning  = false;
    isPaused   = false;
    elapsedMs  = 0;
    startTimestamp = null;

    renderTime(0);
    start_sw.textContent         = 'Start';
    start_sw.style.backgroundColor = 'green';
  }

  // --- Event Listeners ---
  start_sw.addEventListener('click', () => {
    if (isRunning) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
  });

  clear_sw.addEventListener('click', clearStopwatch);

})();
