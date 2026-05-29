(function () {
  function createConfetti(originX, originY) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:9999'
    ].join(';');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = [
      '#a855f7', '#7c22d4', '#c084fc',
      '#f43f5e', '#fb923c', '#facc15',
      '#34d399', '#38bdf8', '#ffffff'
    ];

    const particles = Array.from({ length: 130 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 5 + Math.random() * 12;
      return {
        x: originX, y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        w: 5 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        alpha: 1,
        shape: Math.random() > 0.45 ? 'rect' : 'circle',
      };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.alpha <= 0) continue;
        alive = true;
        p.vy += 0.38; p.vx *= 0.985;
        p.x += p.vx; p.y += p.vy;
        p.rotation += p.spin;
        p.alpha -= 0.016;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      alive ? requestAnimationFrame(draw) : canvas.remove();
    }
    requestAnimationFrame(draw);
  }

  function initBadge(badge) {
    const pill = badge.querySelector('.badge-pill');
    const leftLabel = badge.querySelector('.badge-label--left');
    if (!pill || !leftLabel) return;
    pill.style.width = leftLabel.offsetWidth + 'px';
  }

  function toggleBadge(badge) {
    const pill = badge.querySelector('.badge-pill');
    const leftLabel = badge.querySelector('.badge-label--left');
    const rightLabel = badge.querySelector('.badge-label--right');
    if (!pill || !leftLabel || !rightLabel) return;

    if (badge.classList.contains('toggled')) {
      pill.style.transform = '';
      pill.style.width = leftLabel.offsetWidth + 'px';
      badge.classList.remove('toggled');
    } else {
      pill.style.transform = `translateX(${leftLabel.offsetWidth}px)`;
      pill.style.width = rightLabel.offsetWidth + 'px';
      badge.classList.add('toggled');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.hero-badge').forEach(function (badge) {
      initBadge(badge);
      badge.addEventListener('click', function (e) {
        const rect = badge.getBoundingClientRect();
        createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        toggleBadge(badge);
      });
    });
  });
})();
