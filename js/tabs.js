/**
 * tabs.js
 * Handles tab switching between Stopwatch and Countdown panels.
 * Uses aria attributes for accessibility.
 */

(function () {
  'use strict';

  const sw_tab = document.querySelector('#sw_tab');
  const sw_div = document.querySelector('#sw_div');
  const cd_tab = document.querySelector('#cd_tab');
  const cd_div = document.querySelector('#cd_div');

  if (!sw_tab || !cd_tab) return;

  function activateTab(activeTab, activePanel, inactiveTab, inactivePanel) {
    // Tab styling
    activeTab.classList.add('active_tab');
    activeTab.style.borderBottom = 'none';
    activeTab.setAttribute('aria-selected', 'true');
    activeTab.setAttribute('tabindex', '0');

    inactiveTab.classList.remove('active_tab');
    inactiveTab.style.borderBottom = '4px solid orange';
    inactiveTab.setAttribute('aria-selected', 'false');
    inactiveTab.setAttribute('tabindex', '-1');

    // Panel visibility
    activePanel.classList.add('active_div');
    activePanel.removeAttribute('hidden');

    inactivePanel.classList.remove('active_div');
    inactivePanel.setAttribute('hidden', '');
  }

  sw_tab.addEventListener('click', () => {
    if (!sw_tab.classList.contains('active_tab')) {
      activateTab(sw_tab, sw_div, cd_tab, cd_div);
    }
  });

  cd_tab.addEventListener('click', () => {
    if (!cd_tab.classList.contains('active_tab')) {
      activateTab(cd_tab, cd_div, sw_tab, sw_div);
    }
  });

  // Keyboard navigation (left/right arrow keys)
  [sw_tab, cd_tab].forEach(tab => {
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (tab === sw_tab && !cd_tab.classList.contains('active_tab')) {
          cd_tab.click();
          cd_tab.focus();
        } else if (tab === cd_tab && !sw_tab.classList.contains('active_tab')) {
          sw_tab.click();
          sw_tab.focus();
        }
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tab.click();
      }
    });
  });

})();
