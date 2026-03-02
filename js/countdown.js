/**
 * countdown.js
 * Handles all countdown functionality.
 * Fixes: uses Date.now() to avoid timer drift, proper state variables,
 *        visual feedback on countdown end, typo "Puase" → "Pause" fixed.
 */

(function () {
  'use strict';

  // --- DOM refs ---
  const cd_seconds_e     = document.querySelector('#cd_seconds');
  const cd_minutes_e     = document.querySelector('#cd_minutes');
  const cd_hours_e       = document.querySelector('#cd_hours');
  const cd_ms_e          = document.querySelector('#cd_milliseconds');
  const cd_keypad        = document.querySelector('.cd_keypad');
  const cd_btns          = document.querySelector('.cd-btns');
  const start_cd         = document.querySelector('#start_cd');
  const clear_cd         = document.querySelector('#clear_cd');
  const back_cd          = document.querySelector('#back_cd');
  const countdown_display = document.querySelector('#countdown_display');

  if (!start_cd) return; // Guard: element not present on this page

  // --- State ---
  let isRunning     = false;
  let isPaused      = false;
  let intervalId    = null;

  // Target total milliseconds set by the keypad
  let targetMs      = 0;
  // Remaining ms when paused
  let remainingMs   = 0;
  // Timestamp when last started / resumed
  let startTimestamp = null;

  // Keypad input accumulator
  let inputValue = 0;

  // --- Helpers ---
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function pad3(n) { return n < 10 ? '00' + n : (n < 100 ? '0' + n : String(n)); }

  function renderMs(ms) {
    if (ms < 0) ms = 0;
    const totalS  = Math.floor(ms / 1000);
    const dispMs  = ms % 1000;
    const seconds = totalS % 60;
    const totalM  = Math.floor(totalS / 60);
    const minutes = totalM % 60;
    const hours   = Math.floor(totalM / 60);

    cd_hours_e.textContent   = pad2(hours);
    cd_minutes_e.textContent = pad2(minutes);
    cd_seconds_e.textContent = pad2(seconds);
    cd_ms_e.textContent      = pad3(dispMs);
  }

  function updateKeypadDisplay() {
    const h = Math.floor(inputValue / 10000) % 100;
    const m = Math.floor(inputValue / 100)   % 100;
    const s = inputValue % 100;
    cd_hours_e.textContent   = pad2(h);
    cd_minutes_e.textContent = pad2(m);
    cd_seconds_e.textContent = pad2(s);
    cd_ms_e.textContent      = '000';
  }

  function onFinished() {
    clearInterval(intervalId);
    isRunning  = false;
    isPaused   = false;
    renderMs(0);

    // Visual feedback
    countdown_display.classList.add('finished');
    setTimeout(() => countdown_display.classList.remove('finished'), 3200);

    start_cd.textContent         = 'Start';
    start_cd.style.backgroundColor = 'green';
  }

  function tick() {
    const elapsed    = Date.now() - startTimestamp;
    const currentMs  = remainingMs - elapsed;

    if (currentMs <= 0) {
      onFinished();
      return;
    }
    renderMs(currentMs);
  }

  // --- Keypad logic ---
  function handleKeypad(input) {
    const isDigit = /^\d$/.test(input);

    if (isDigit) {
      // Guard: don't allow hours beyond 99
      const hDigits = Math.floor(inputValue / 10000);
      if (hDigits >= 10) return;

      inputValue = (inputValue * 10) + Number(input);
      updateKeypadDisplay();
    } else if (input === 'Clear') {
      inputValue = 0;
      updateKeypadDisplay();
    } else if (input === 'Set') {
      // Normalise: carry over seconds ≥ 60 into minutes, etc.
      let h = Math.floor(inputValue / 10000) % 100;
      let m = Math.floor(inputValue / 100)   % 100;
      let s = inputValue % 100;

      m += Math.floor(s / 60);
      s  = s % 60;
      h += Math.floor(m / 60);
      m  = m % 60;

      // Default to 10 s if user set 0
      if (h === 0 && m === 0 && s === 0) s = 10;

      cd_hours_e.textContent   = pad2(h);
      cd_minutes_e.textContent = pad2(m);
      cd_seconds_e.textContent = pad2(s);
      cd_ms_e.textContent      = '000';

      targetMs = remainingMs = (h * 3600 + m * 60 + s) * 1000;
      inputValue = 0;

      // Switch from keypad to control buttons
      cd_keypad.style.display = 'none';
      cd_btns.style.display   = 'flex';
    }
  }

  cd_keypad.addEventListener('click', (e) => {
    const cell = e.target.closest('.cd_cell');
    if (cell) handleKeypad(cell.textContent.trim());
  });

  // Keyboard support for keypad cells
  cd_keypad.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const cell = e.target.closest('.cd_cell');
      if (cell) {
        e.preventDefault();
        handleKeypad(cell.textContent.trim());
      }
    }
  });

  // --- Controls ---
  function startCountdown() {
    isRunning      = true;
    isPaused       = false;
    startTimestamp = Date.now();
    intervalId     = setInterval(tick, 30);

    start_cd.textContent         = 'Pause';
    start_cd.style.backgroundColor = 'green';
  }

  function pauseCountdown() {
    isPaused      = true;
    isRunning     = false;
    remainingMs  -= Date.now() - startTimestamp;
    if (remainingMs < 0) remainingMs = 0;
    clearInterval(intervalId);

    start_cd.textContent         = 'Resume';
    start_cd.style.backgroundColor = 'rgba(176, 0, 230, 0.7)';
  }

  function resetCountdown() {
    clearInterval(intervalId);
    isRunning  = false;
    isPaused   = false;
    remainingMs = targetMs;
    renderMs(remainingMs);

    start_cd.textContent         = 'Start';
    start_cd.style.backgroundColor = 'green';
  }

  start_cd.addEventListener('click', () => {
    if (isRunning) {
      pauseCountdown();
    } else {
      startCountdown();
    }
  });

  clear_cd.addEventListener('click', resetCountdown);

  back_cd.addEventListener('click', () => {
    clearInterval(intervalId);
    isRunning   = false;
    isPaused    = false;
    targetMs    = 0;
    remainingMs = 0;
    inputValue  = 0;

    cd_hours_e.textContent   = '00';
    cd_minutes_e.textContent = '00';
    cd_seconds_e.textContent = '00';
    cd_ms_e.textContent      = '000';

    start_cd.textContent         = 'Start';
    start_cd.style.backgroundColor = 'green';

    cd_btns.style.display   = 'none';
    cd_keypad.style.display = 'grid';
    countdown_display.classList.remove('finished');
  });

})();
