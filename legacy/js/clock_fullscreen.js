/**
 * clock_fullscreen.js
 * Drives the full-screen world clock page.
 * - Local time hero section: digital HH:MM:SS, AM/PM, Day · Month DD, YYYY
 * - World capitals: live time, short date, UTC offset for each city
 */

(function () {
  'use strict';

  // ─── Hero clock elements ───────────────────────────────────────────────────
  const heroTime = document.getElementById('hero-time');
  const heroAmpm = document.getElementById('hero-ampm');
  const heroDate = document.getElementById('hero-date');

  const DAYS   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function updateHero() {
    const now  = new Date();
    let   h    = now.getHours();
    const m    = now.getMinutes();
    const s    = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    heroTime.textContent = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
    heroAmpm.textContent = ampm;
    heroDate.textContent =
      DAYS[now.getDay()] + ' · ' +
      MONTHS[now.getMonth()] + ' ' +
      now.getDate() + ', ' +
      now.getFullYear();
  }

  // ─── World capitals config ─────────────────────────────────────────────────
  // Each entry: { tz, timeId, dateId, offsetId }
  const cities = [
    { tz: 'Africa/Cairo',     timeId: 'tz-Cairo',      dateId: 'dt-Cairo',      offsetId: 'off-Cairo'      },
    { tz: 'Asia/Riyadh',      timeId: 'tz-Riyadh',     dateId: 'dt-Riyadh',     offsetId: 'off-Riyadh'     },
    { tz: 'America/Toronto',  timeId: 'tz-Ottawa',     dateId: 'dt-Ottawa',     offsetId: 'off-Ottawa'     },
    { tz: 'Africa/Tunis',     timeId: 'tz-Tunis',      dateId: 'dt-Tunis',      offsetId: 'off-Tunis'      },
    { tz: 'Africa/Casablanca',timeId: 'tz-Rabat',      dateId: 'dt-Rabat',      offsetId: 'off-Rabat'      },
    { tz: 'America/New_York', timeId: 'tz-Washington', dateId: 'dt-Washington', offsetId: 'off-Washington' },
    { tz: 'Europe/London',    timeId: 'tz-London',     dateId: 'dt-London',     offsetId: 'off-London'     },
    { tz: 'Europe/Paris',     timeId: 'tz-Paris',      dateId: 'dt-Paris',      offsetId: 'off-Paris'      },
  ];

  // Pre-build Intl formatters (created once, not every tick)
  const timeFormatters = {};
  const dateFormatters = {};

  cities.forEach(({ tz }) => {
    timeFormatters[tz] = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    dateFormatters[tz] = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      month:   'short',
      day:     'numeric',
    });
  });

  /**
   * Get UTC offset string for a timezone, e.g. "UTC+3" or "UTC-5"
   * Computed once per city on init (offsets don't change mid-session for our purposes).
   */
  function getUtcOffsetLabel(tz) {
    try {
      const now      = new Date();
      const utcMs    = now.getTime() + now.getTimezoneOffset() * 60000;
      const tzDate   = new Date(now.toLocaleString('en-US', { timeZone: tz }));
      const localDate = new Date(now.toLocaleString('en-US'));
      const diffHrs   = (tzDate - localDate) / 3600000;
      const localOff  = -now.getTimezoneOffset() / 60;
      const absOff    = Math.round(localOff + diffHrs);
      return 'UTC' + (absOff >= 0 ? '+' : '') + absOff;
    } catch {
      return '';
    }
  }

  // Set offsets once on load
  cities.forEach(({ tz, offsetId }) => {
    const el = document.getElementById(offsetId);
    if (el) el.textContent = getUtcOffsetLabel(tz);
  });

  function updateCities() {
    const now = new Date();
    cities.forEach(({ tz, timeId, dateId }) => {
      const timeEl = document.getElementById(timeId);
      const dateEl = document.getElementById(dateId);

      if (timeEl) {
        // Format: "09:38:37 PM" → strip the space before AM/PM
        const raw = timeFormatters[tz].format(now);
        timeEl.textContent = raw;
      }
      if (dateEl) {
        dateEl.textContent = dateFormatters[tz].format(now);
      }
    });
  }

  // ─── Init & tick ──────────────────────────────────────────────────────────
  updateHero();
  updateCities();
  setInterval(() => {
    updateHero();
    updateCities();
  }, 1000);

})();
