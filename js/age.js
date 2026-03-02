/**
 * age.js
 * Age calculator and next-birthday countdown.
 * Fixes: myVar scoping bug (moved to module scope), hardcoded dates replaced
 *        with user-configurable inputs, all intervals properly tracked.
 */

(function () {
  'use strict';

  // --- Helpers ---
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  // =====================
  // Current Time Display
  // =====================
  const current_time = document.getElementById('current-time');
  if (current_time) {
    function updateCurrentTime() {
      current_time.textContent = new Date().toLocaleTimeString();
    }
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
  }

  // =====================
  // Age Calculator
  // =====================
  const birthdayInput = document.getElementById('birthday');
  const generateBtn   = document.getElementById('generate');

  const years_b   = document.getElementById('years_b');
  const months_b  = document.getElementById('months_b');
  const days_b    = document.getElementById('days_b');
  const hours_b   = document.getElementById('hours_b');
  const mins_b    = document.getElementById('mins_b');
  const seconds_b = document.getElementById('seconds_b');

  // Module-scoped interval ID — fixes the scoping bug from the original code
  let ageIntervalId = null;

  function calcElapsedAge(birthday) {
    const oldDate     = new Date(birthday);
    const currentDate = new Date();
    const totalSec    = (currentDate - oldDate) / 1000;

    const seconds = Math.floor(totalSec) % 60;
    const mins    = Math.floor(totalSec / 60) % 60;
    const hours   = Math.floor(totalSec / 3600) % 24;

    let dayDiff = currentDate.getDate() - oldDate.getDate();
    const days  = dayDiff >= 0 ? dayDiff : 30 + dayDiff;

    let totalMonths = (currentDate.getFullYear() - oldDate.getFullYear()) * 12
                    + (currentDate.getMonth() - oldDate.getMonth());
    if (dayDiff < 0) totalMonths -= 1;

    const yrs    = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years_b)   years_b.textContent   = pad2(yrs);
    if (months_b)  months_b.textContent  = months;
    if (days_b)    days_b.textContent    = days;
    if (hours_b)   hours_b.textContent   = pad2(hours);
    if (mins_b)    mins_b.textContent    = pad2(mins);
    if (seconds_b) seconds_b.textContent = pad2(seconds);
  }

  function startAgeTimer(dateValue) {
    const birthday = new Date(dateValue);
    birthday.setHours(0, 0, 0, 0);

    if (isNaN(birthday.getTime())) return;

    clearInterval(ageIntervalId);
    calcElapsedAge(birthday);
    ageIntervalId = setInterval(() => calcElapsedAge(birthday), 1000);
  }

  if (birthdayInput) {
    startAgeTimer(birthdayInput.value);

    generateBtn && generateBtn.addEventListener('click', () => {
      startAgeTimer(birthdayInput.value);
    });
  }

  // =====================
  // Next Birthday Countdown
  // =====================
  const nextBirthdayInput = document.getElementById('next_birthday_input');
  const updateBirthdayBtn = document.getElementById('update_birthday');

  const r_years   = document.getElementById('r_years');
  const r_months  = document.getElementById('r_months');
  const r_days    = document.getElementById('r_days');
  const r_hours   = document.getElementById('r_hours');
  const r_mins    = document.getElementById('r_mins');
  const r_seconds = document.getElementById('r_seconds');

  let nextBirthdayIntervalId = null;

  function calcNextBirthday(dateValue) {
    const inputDate   = new Date(dateValue);
    if (isNaN(inputDate.getTime())) return;

    const now         = new Date();

    // Build this year's occurrence of the birthday month/day
    let next = new Date(now.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    // If already passed this year, use next year's
    if (next <= now) {
      next.setFullYear(now.getFullYear() + 1);
    }

    const diffMs      = next - now;
    const totalSec    = Math.floor(diffMs / 1000);
    const seconds     = totalSec % 60;
    const totalMin    = Math.floor(totalSec / 60);
    const mins        = totalMin % 60;
    const totalHours  = Math.floor(totalMin / 60);
    const hours       = totalHours % 24;
    const totalDays   = Math.floor(totalHours / 24);

    // Approximate months & years from total days
    const years       = Math.floor(totalDays / 365);
    const months      = Math.floor((totalDays % 365) / 30);
    const days        = totalDays % 30;

    if (r_years)   r_years.textContent   = years;
    if (r_months)  r_months.textContent  = months;
    if (r_days)    r_days.textContent    = days;
    if (r_hours)   r_hours.textContent   = pad2(hours);
    if (r_mins)    r_mins.textContent    = pad2(mins);
    if (r_seconds) r_seconds.textContent = pad2(seconds);
  }

  function startNextBirthdayTimer(dateValue) {
    clearInterval(nextBirthdayIntervalId);
    calcNextBirthday(dateValue);
    nextBirthdayIntervalId = setInterval(() => calcNextBirthday(dateValue), 1000);
  }

  if (nextBirthdayInput) {
    startNextBirthdayTimer(nextBirthdayInput.value);

    updateBirthdayBtn && updateBirthdayBtn.addEventListener('click', () => {
      startNextBirthdayTimer(nextBirthdayInput.value);
    });
  }

})();
