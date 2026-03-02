/**
 * clock.js
 * Analog clock using Canvas API.
 * Fix: static parts (face, numbers) are drawn once on load;
 *      only the hands are redrawn every second — better performance.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Make canvas responsive
  function resizeCanvas() {
    const container = canvas.parentElement;
    const size = Math.min(container.clientWidth, 200);
    canvas.width  = size;
    canvas.height = size;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawStatic();
    drawTime();
  });

  const ctx    = canvas.getContext('2d');
  let radius   = canvas.height / 2;

  function getRadius() {
    return (canvas.height / 2) * 0.90;
  }

  // =====================
  // Static elements (drawn once, or on resize)
  // =====================
  function drawFace(r) {
    // White circle
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Gradient ring
    const grad = ctx.createRadialGradient(0, 0, r * 0.95, 0, 0, r * 1.05);
    grad.addColorStop(0,   '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1,   '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth   = r * 0.1;
    ctx.stroke();

    // Centre dot
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  function drawNumbers(r) {
    ctx.font         = r * 0.15 + 'px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign    = 'center';
    ctx.fillStyle    = '#333';

    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -r * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(String(num), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, r * 0.85);
      ctx.rotate(-ang);
    }
  }

  // Draw the static clock face into an offscreen canvas for compositing
  let staticImage = null;

  function drawStatic() {
    const r = getRadius();
    const offscreen = document.createElement('canvas');
    offscreen.width  = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');
    offCtx.translate(canvas.width / 2, canvas.height / 2);
    drawFaceOn(offCtx, r);
    drawNumbersOn(offCtx, r);
    staticImage = offscreen;
  }

  // Generic draw helpers that accept a context param
  function drawFaceOn(c, r) {
    c.beginPath();
    c.arc(0, 0, r, 0, 2 * Math.PI);
    c.fillStyle = 'white';
    c.fill();
    const grad = c.createRadialGradient(0, 0, r * 0.95, 0, 0, r * 1.05);
    grad.addColorStop(0,   '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1,   '#333');
    c.strokeStyle = grad;
    c.lineWidth   = r * 0.1;
    c.stroke();
    c.beginPath();
    c.arc(0, 0, r * 0.1, 0, 2 * Math.PI);
    c.fillStyle = '#333';
    c.fill();
  }

  function drawNumbersOn(c, r) {
    c.font         = r * 0.15 + 'px arial';
    c.textBaseline = 'middle';
    c.textAlign    = 'center';
    c.fillStyle    = '#333';
    for (let num = 1; num <= 12; num++) {
      const ang = num * Math.PI / 6;
      c.rotate(ang);
      c.translate(0, -r * 0.85);
      c.rotate(-ang);
      c.fillText(String(num), 0, 0);
      c.rotate(ang);
      c.translate(0, r * 0.85);
      c.rotate(-ang);
    }
  }

  // =====================
  // Hands (redrawn every second)
  // =====================
  function drawHand(c, pos, length, width) {
    c.beginPath();
    c.lineWidth = width;
    c.lineCap   = 'round';
    c.moveTo(0, 0);
    c.rotate(pos);
    c.lineTo(0, -length);
    c.stroke();
    c.rotate(-pos);
  }

  function drawTime() {
    const r   = getRadius();
    const now = new Date();
    const hr  = now.getHours() % 12;
    const min = now.getMinutes();
    const sec = now.getSeconds();

    // Clear and redraw static image
    ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
    if (staticImage) {
      // Draw the cached static face without transform applied
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(staticImage, 0, 0);
      ctx.restore();
    }

    // Hour hand
    const hourAngle = (hr * Math.PI / 6) + (min * Math.PI / 360) + (sec * Math.PI / 21600);
    drawHand(ctx, hourAngle, r * 0.5, r * 0.07);

    // Minute hand
    const minAngle = (min * Math.PI / 30) + (sec * Math.PI / 1800);
    drawHand(ctx, minAngle, r * 0.8, r * 0.07);

    // Second hand
    const secAngle = sec * Math.PI / 30;
    ctx.strokeStyle = 'red';
    drawHand(ctx, secAngle, r * 0.9, r * 0.02);
    ctx.strokeStyle = '#333'; // reset
  }

  // =====================
  // Init
  // =====================
  ctx.translate(canvas.width / 2, canvas.height / 2);
  drawStatic();
  drawTime();
  setInterval(drawTime, 1000);

})();
