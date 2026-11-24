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

function copyPhone(phone) {
  playSubtleClick();
  navigator.clipboard.writeText(phone).then(() => {
    showToast(`Copied ${phone} to clipboard!`);
  }).catch(() => {
    showToast("Failed to copy phone number.");
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
  const sectionIds = ['hero', 'about', 'education', 'skills', 'projects', 'contact'];
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

// --- 9. Interactive Project Category Filter ---
function filterProjects(cat) {
  playSubtleClick();
  const cards = document.querySelectorAll('.project-card');
  const btns = document.querySelectorAll('.project-tab-btn');
  
  btns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-filter') === cat) {
      btn.classList.add('active');
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category') || '';
    if (cat === 'all' || cardCat.includes(cat)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// --- 10. Interactive 3D Hanging Lanyard ID Badge ---
function toggleBadgeFlip() {
  playSubtleClick();
  const card = document.getElementById('badge-card-container');
  if (card) {
    card.classList.toggle('flipped');
  }
}

function initLanyardCardPhysics() {
  const rig = document.getElementById('lanyard-rig');
  const card = document.getElementById('badge-card-container');
  if (!rig || !card) return;

  let currentRotateX = 0;
  let currentRotateY = 0;
  let targetRotateX = 0;
  let targetRotateY = 0;

  // 3D tilt tracking mouse over hero
  window.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = (e.clientX - centerX) / (window.innerWidth / 2);
    const distY = (e.clientY - centerY) / (window.innerHeight / 2);

    targetRotateY = Math.max(-16, Math.min(16, distX * 18));
    targetRotateX = Math.max(-16, Math.min(16, -distY * 18));
  });

  // Drag to swing physics
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;

  card.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    rig.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragOffset = (e.clientX - startX) * 0.22;
    rig.style.transform = `rotate(${dragOffset}deg)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    rig.style.transition = 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    rig.style.transform = 'rotate(0deg)';
  });

  // Touch drag support
  card.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    rig.style.transition = 'none';
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    dragOffset = (e.touches[0].clientX - startX) * 0.22;
    rig.style.transform = `rotate(${dragOffset}deg)`;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    rig.style.transition = 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    rig.style.transform = 'rotate(0deg)';
  });

  function renderTilt() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    card.style.transform = `rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;

    requestAnimationFrame(renderTilt);
  }
  requestAnimationFrame(renderTilt);
}

// --- 11. Custom Neon Green Arrow Pointer & Colorful Splash Burst Trail ---
function initCustomCursorAndSplash() {
  const arrow = document.getElementById('custom-cursor-arrow');
  const canvas = document.getElementById('cursor-splash-canvas');
  if (!arrow || !canvas) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let mouseX = -100;
  let mouseY = -100;
  let isVisible = false;

  const sparkColors = [
    '#22c55e', // Neon Green (matching cursor)
    '#38bdf8', // Electric Cyan
    '#a855f7', // Electric Violet
    '#ec4899', // Hot Pink
    '#fbbf24', // Bright Amber
    '#06b6d4'  // Aqua Teal
  ];

  const particles = [];

  class Spark {
    constructor(x, y, isBurst = false) {
      this.x = x;
      this.y = y;
      const angle = isBurst ? Math.random() * Math.PI * 2 : (Math.random() * Math.PI * 2);
      const speed = isBurst ? (Math.random() * 5 + 2) : (Math.random() * 1.5 + 0.4);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (isBurst ? 0 : 0.4);
      this.size = isBurst ? (Math.random() * 4.5 + 2) : (Math.random() * 3 + 1.5);
      this.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
      this.alpha = 1;
      this.decay = isBurst ? (Math.random() * 0.025 + 0.015) : (Math.random() * 0.035 + 0.02);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04;
      this.alpha -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      
      // Star / spark diamond geometry
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(this.x, this.y - s);
      ctx.lineTo(this.x + s * 0.35, this.y);
      ctx.lineTo(this.x + s, this.y);
      ctx.lineTo(this.x + s * 0.35, this.y + s * 0.35);
      ctx.lineTo(this.x + s * 0.55, this.y + s);
      ctx.lineTo(this.x, this.y + s * 0.5);
      ctx.lineTo(this.x - s * 0.55, this.y + s);
      ctx.lineTo(this.x - s * 0.35, this.y + s * 0.35);
      ctx.lineTo(this.x - s, this.y);
      ctx.lineTo(this.x - s * 0.35, this.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    arrow.style.left = `${mouseX}px`;
    arrow.style.top = `${mouseY}px`;

    if (!isVisible) {
      isVisible = true;
      document.body.classList.add('cursor-visible');
    }

    // Emit 2 colorful trailing sparks on movement
    for (let i = 0; i < 2; i++) {
      particles.push(new Spark(mouseX, mouseY, false));
    }
  });

  window.addEventListener('mouseleave', () => {
    isVisible = false;
    document.body.classList.remove('cursor-visible');
  });

  window.addEventListener('mousedown', (e) => {
    document.body.classList.add('cursor-click');
    // Colorful splash explosion burst (18 particles)
    for (let i = 0; i < 18; i++) {
      particles.push(new Spark(e.clientX, e.clientY, true));
    }
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  function attachCursorHover() {
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, .project-card, .skill-row, .luxury-card, .nav-btn, .pill-badge, .project-tab-btn, .badge-card-container';
    const elements = document.querySelectorAll(interactiveSelectors);

    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }
  attachCursorHover();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// --- 12. Cinematic Portfolio Opening Intro Sequence ---
function initPortfolioOpening() {
  const loader = document.getElementById('portfolio-loader');
  const progress = document.getElementById('loader-progress');
  if (!loader) return;

  if (progress) {
    setTimeout(() => {
      progress.style.width = '100%';
    }, 100);
  }

  function dismissLoader() {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.remove();
    }, 700);
  }

  loader.addEventListener('click', dismissLoader);
  setTimeout(dismissLoader, 1100);
}

// --- 11. Dynamic Particle Network Canvas Background ---
function initAnimatedBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Mouse interaction
  let mouse = { x: -1000, y: -1000, radius: 130 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Create subtle floating particles
  const particleCount = Math.min(Math.floor((width * height) / 26000), 45);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      this.baseAlpha = Math.random() * 0.4 + 0.25;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse reaction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * force * 1.8;
        this.y -= Math.sin(angle) * force * 1.8;
      }
    }

    draw() {
      const isLight = document.body.classList.contains('light-theme');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = isLight 
        ? `rgba(2, 132, 199, ${this.baseAlpha * 0.75})` 
        : `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    if (document.hidden) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.classList.contains('light-theme');

    // Connect particles with faint glowing lines
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.16;
          ctx.beginPath();
          ctx.strokeStyle = isLight 
            ? `rgba(2, 132, 199, ${alpha * 0.6})` 
            : `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
      particles[a].update();
      particles[a].draw();
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// --- DOM Ready Execution ---
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateLocalClock();
  setInterval(updateLocalClock, 1000);
  
  initPortfolioOpening();
  initLanyardCardPhysics();
  initCustomCursorAndSplash();
  initAnimatedBackground();
  initMagneticButtons();
  initSoundToggle();
  initThemeToggle();
  initScrollSpy();
  
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => playSubtleClick());
  });
});
