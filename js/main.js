/**
 * BESPOKE PORTFOLIO - CORE JAVASCRIPT
 * Tactile micro-interactions, dynamic clock, theme switcher, scrollspy & clipboard utilities.
 */

// --- 1. Sound Synthesis (Subtle luxury haptic click) ---
let audioCtx = null;
let soundEnabled = true;

function playSubtleClick() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Soft metallic click (1050Hz -> 350Hz over 0.035s)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1050, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + 0.035);
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {
    // Graceful fallback
  }
}

// --- 2. Live Dynamic Clock ---
function updateLocalClock() {
  const clockEl = document.getElementById('local-clock');
  if (!clockEl) return;
  
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  const timeStr = now.toLocaleTimeString('en-US', options);
  const timeZoneOffset = -now.getTimezoneOffset() / 60;
  const gmtStr = `GMT${timeZoneOffset >= 0 ? '+' : ''}${timeZoneOffset}`;
  
  clockEl.textContent = `${timeStr} (${gmtStr})`;
}

// --- 3. Copy to Clipboard & Toast ---
function copyEmail(emailAddress) {
  playSubtleClick();
  navigator.clipboard.writeText(emailAddress).then(() => {
    showToast(`Copied ${emailAddress} to clipboard!`);
  }).catch(() => {
    showToast("Failed to copy email.");
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  
  toastMsg.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// --- 4. Interactive Magnetic Button Effect ---
function initMagneticButtons() {
  const magnets = document.querySelectorAll('.magnetic-btn');
  
  magnets.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
    
    btn.addEventListener('click', () => {
      playSubtleClick();
    });
  });
}

// --- 5. Sound Toggle ---
function initSoundToggle() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;
  
  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = soundEnabled ? 'ph-bold ph-speaker-high text-sm' : 'ph-bold ph-speaker-slash text-sm';
    }
    showToast(soundEnabled ? 'Tactile sound: Enabled' : 'Tactile sound: Muted');
    if (soundEnabled) playSubtleClick();
  });
}

// --- 6. Theme Switcher (Standard Dark / Clean Light) ---
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    document.documentElement.classList.remove('dark');
    updateThemeIcon(true);
  } else {
    document.body.classList.remove('light-theme');
    document.documentElement.classList.add('dark');
    updateThemeIcon(false);
  }

  themeBtn.addEventListener('click', () => {
    playSubtleClick();
    const isLight = document.body.classList.toggle('light-theme');
    if (isLight) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
    showToast(isLight ? 'Switched to Clean Light' : 'Switched to Clean Dark');
  });
}

function updateThemeIcon(isLight) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  if (icon) {
    icon.className = isLight ? 'ph-bold ph-sun text-sm text-amber-500' : 'ph-bold ph-moon text-sm text-zinc-400';
  }
}

// --- 7. Scrollspy Active Navbar Link ---
function initScrollSpy() {
  const sectionIds = ['hero', 'about', 'education', 'skills', 'contact'];
  const navBtns = document.querySelectorAll('.nav-btn');
  
  window.addEventListener('scroll', () => {
    let current = 'hero';
    const scrollPos = window.scrollY + 250;
    
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          current = id;
        }
      }
    });
    
    navBtns.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('href') === `#${current}`) {
        btn.classList.add('active');
      }
    });
  });
}

// --- 8. Interactive Skill Category Filter ---
function filterSkills(cat) {
  playSubtleClick();
  const rows = document.querySelectorAll('.skill-row');
  const btns = document.querySelectorAll('.skill-tab-btn');
  
  btns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === cat) {
      btn.classList.add('active');
    }
  });

  rows.forEach(row => {
    const rowCat = row.getAttribute('data-category');
    if (cat === 'all' || rowCat === cat) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// --- DOM Ready Execution ---
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateLocalClock();
  setInterval(updateLocalClock, 1000);
  
  initMagneticButtons();
  initSoundToggle();
  initThemeToggle();
  initScrollSpy();
  
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => playSubtleClick());
  });
});
