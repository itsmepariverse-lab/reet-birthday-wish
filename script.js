document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Audio Control ---
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = musicToggle.querySelector('.icon');
  const musicText = musicToggle.querySelector('.text');
  let isPlaying = false;

  bgMusic.volume = 0.4; // Soft background music

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIcon.textContent = '🎵';
      musicText.textContent = 'Play Music';
    } else {
      if(bgMusic.currentTime > 0 && bgMusic.paused) {
         // resume instantly without resetting if just paused, OR we can reset to 0:
         bgMusic.currentTime = 0; // The user asked for "restarts", so we force restart!
      }
      bgMusic.play().catch(e => console.log('Audio play failed:', e));
      musicIcon.textContent = '⏸️';
      musicText.textContent = 'Pause Music';
    }
    isPlaying = !isPlaying;
  });

  // --- 2. Ethereal Canvas Background (replaces emoji particles) ---
  const canvas = document.getElementById('etherealCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let orbs = [];
  let stars = [];
  let mouseX = W / 2, mouseY = H / 2;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initOrbs() {
    orbs = [];
    const palette = [
      [255, 182, 193],  // pink
      [230, 230, 250],  // lavender
      [255, 220, 180],  // warm gold
      [180, 220, 255],  // soft blue
      [255, 192, 203],  // rose
    ];
    for (let i = 0; i < 7; i++) {
      const c = palette[i % palette.length];
      orbs.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 220 + 120,
        r0: c[0], r1: c[1], r2: c[2],
        alpha: Math.random() * 0.25 + 0.10,
      });
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  let rafId;
  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);

    // Draw gradient background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#ffe4ec');
    bg.addColorStop(0.5, '#f3e8ff');
    bg.addColorStop(1, '#ffe4ec');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Draw floating glowing orbs
    orbs.forEach(o => {
      o.x += o.vx;
      o.y += o.vy;
      if (o.x < -o.r) o.x = W + o.r;
      if (o.x > W + o.r) o.x = -o.r;
      if (o.y < -o.r) o.y = H + o.r;
      if (o.y > H + o.r) o.y = -o.r;

      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
      g.addColorStop(0, `rgba(${o.r0},${o.r1},${o.r2},${o.alpha})`);
      g.addColorStop(1, `rgba(${o.r0},${o.r1},${o.r2},0)`);
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // Draw twinkling stars
    const now = Date.now() * 0.001;
    stars.forEach(s => {
      const a = (Math.sin(now * s.speed * 60 + s.phase) + 1) / 2 * 0.8 + 0.1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    // Mouse sparkle trail
    const mx = mouseX, my = mouseY;
    if (mx && my) {
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
      mg.addColorStop(0, 'rgba(255,210,240,0.18)');
      mg.addColorStop(1, 'rgba(255,210,240,0)');
      ctx.beginPath();
      ctx.arc(mx, my, 60, 0, Math.PI * 2);
      ctx.fillStyle = mg;
      ctx.fill();
    }

    rafId = requestAnimationFrame(animateCanvas);
  }

  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('touchmove', e => { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('resize', () => { resizeCanvas(); initOrbs(); initStars(); });
  resizeCanvas();
  initOrbs();
  initStars();
  animateCanvas();

  // --- 3. Navigation & Section Reveal ---
  const startBtn = document.getElementById('startJourneyBtn');
  const openingSec = document.getElementById('opening');
  const storySec = document.getElementById('story');
  const qualitiesSec = document.getElementById('qualities');
  const surprisesSec = document.getElementById('surprises');
  const memoryStackSec = document.getElementById('memory-stack');
  const filmReelSec = document.getElementById('film-reel');
  const reasonsSec = document.getElementById('reasons');
  const virtualCakeSec = document.getElementById('virtual-cake');
  const letterSec = document.getElementById('letter');
  const finaleSec = document.getElementById('finale');
  const finaleBtn = document.getElementById('finaleBtn');

  function smoothScrollTo(element) {
    element.style.display = 'flex';
    // Small delay to allow display flex to apply before opacity transition
    setTimeout(() => {
      element.classList.remove('hidden');
      element.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  const welcomeModal = document.getElementById('welcomeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function startJourneySequence() {
    welcomeModal.style.display = 'none';
    // Reveal first story section
    smoothScrollTo(storySec);
    // Unhide qualities and surprises so they can be scrolled to naturally
    setTimeout(() => {
      qualitiesSec.style.display = 'flex';
      qualitiesSec.classList.remove('hidden');
      const memoriesSec = document.getElementById('memories');
      if (memoriesSec) {
          memoriesSec.style.display = 'flex';
          memoriesSec.classList.remove('hidden');
      }
      surprisesSec.style.display = 'flex';
      surprisesSec.classList.remove('hidden');
      // New sections
      memoryStackSec.style.display = 'flex';
      memoryStackSec.classList.remove('hidden');
      filmReelSec.style.display = 'flex';
      filmReelSec.classList.remove('hidden');
    }, 500);

    // Try playing music automatically on first interaction
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicIcon.textContent = '⏸️';
        musicText.textContent = 'Pause Music';
      }).catch(e => console.log(e));
    }
  }

  startBtn.addEventListener('click', () => {
    // Show guided onboarding modal first instead of jumping
    welcomeModal.style.display = 'flex';
    welcomeModal.classList.remove('hidden');
  });

  if(closeModalBtn) {
    closeModalBtn.addEventListener('click', startJourneySequence);
  }

  // --- 4. Intersection Observer for Scroll Animations ---
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        
        // Custom logic for traits delay
        if (entry.target.classList.contains('traits-grid')) {
          const children = entry.target.querySelectorAll('.trait-card');
          children.forEach((child, idx) => {
             child.style.opacity = '1';
          });
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

  // --- 5. Surprises Logic ---
  const surpriseBtns = document.querySelectorAll('.surprise-btn:not(.final)');
  const finalSurpriseBtn = document.getElementById('finalSurpriseBtn');
  const msgBox = document.getElementById('surpriseMsg');
  let clickedCount = 0;

  surpriseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Disable this button
      this.disabled = true;
      this.style.opacity = '0.5';
      this.style.transform = 'none';
      this.style.boxShadow = 'none';

      // Show msg
      const msg = this.getAttribute('data-msg');
      msgBox.textContent = msg;
      msgBox.classList.remove('hidden');

      // Pop animation
      msgBox.style.transform = 'scale(1.1)';
      setTimeout(() => msgBox.style.transform = 'scale(1)', 200);

      clickedCount++;
      if (clickedCount === surpriseBtns.length) {
        // Show final button
        setTimeout(() => {
          finalSurpriseBtn.style.display = 'block';
          finalSurpriseBtn.classList.add('fade-in');
        }, 1000);
      }
    });
  });

  finalSurpriseBtn.addEventListener('click', () => {
    msgBox.textContent = "Unlocking the reasons...";
    setTimeout(() => {
      smoothScrollTo(reasonsSec);
      reasonsSec.style.display = 'flex';
      setTimeout(() => {
        letterSec.style.display = 'flex';
        letterSec.classList.remove('hidden');
      }, 500);
    }, 800);
  });

  // --- 6. Reasons "Why You're Amazing" List ---
  const reasonsList = document.getElementById('reasonsList');
  const reasons = [
    "You have the sweetest smile 😊",
    "You make normal moments feel special ✨",
    "You are genuinely kind 💗",
    "You bring positivity everywhere 🌈",
    "You are beautifully unique 🌸",
    "Your laugh is contagious 😂",
    "You have a heart of gold 💛",
    "You care deeply about others 🥰",
    "You light up every room you enter ⭐",
    "You always know how to make people feel seen 👀",
    "You have an amazing sense of humor 🤣",
    "You are incredibly thoughtful 💌",
    "You make the world a better place 🌍",
    "Your energy is unmatched ⚡",
    "You are so easy to talk to 💬",
    "You have a beautiful soul 🦋",
    "You support people unconditionally 🤝",
    "You look stunning even when you're not trying 🥺",
    "You give the best advice 💡",
    "You radiate comfort and warmth ☀️",
    "You're deeply empathetic 🫂",
    "You inspire people effortlessly 💫",
    "You have the best taste in almost everything 🎶",
    "Your presence alone is calming 🍃",
    "You're an amazing listener 🎧",
    "You don't judge, you understand 🤍",
    "You find joy in the little things 🌻",
    "You are strong but soft at the same time 💪🌺",
    "You make everyone around you feel special 👑",
    "You’re just undeniably, completely amazing 💖",
    "You're a true blessing to have around 🙏",
    "You make memories unforgettable 📸",
    "You are incredibly intelligent and bright 🧠",
    "You have this magical charm about you ✨",
    "You are just YOU, and that is your superpower 🦸‍♀️"
  ];

  // duplicate them to create continuous scroll
  const allReasons = [...reasons, ...reasons];

  allReasons.forEach(text => {
    const item = document.createElement('div');
    item.className = 'reason-item';
    item.innerHTML = `<span class="cursive" style="font-size: 1.3rem;">${text}</span>`;
    reasonsList.appendChild(item);
  });

  // --- 7. Grand Finale ---
  const finaleCenterpieceVideo = document.getElementById('finaleCenterpieceVideo');
  const lastVideoMessages = [
    'last video message/1.mp4',
    'last video message/2.mp4'
  ];

  finaleBtn.addEventListener('click', () => {
    // Randomly pick one of the landscape videos
    if (finaleCenterpieceVideo) {
      const randomVid = lastVideoMessages[Math.floor(Math.random() * lastVideoMessages.length)];
      finaleCenterpieceVideo.src = randomVid;
      finaleCenterpieceVideo.load();
    }
    
    smoothScrollTo(finaleSec);
    
    // Trigger confetti
    setTimeout(() => {
        const end = Date.now() + (5 * 1000); // 5 seconds of confetti
        const colors = ['#ffb6c1', '#e6e6fa', '#ffffff', '#ff9a9e'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, 500); // Wait for scroll to largely complete
  });

  // --- 8. Interactive Peacock Trail & Golden Dust ---
  const createPeacockTrail = (x, y) => {
    const rand = Math.random();
    const el = document.createElement('div');
    
    if (rand < 0.1) {
      el.className = 'divine-flute';
      el.textContent = '🪈';
    } else if (rand < 0.25) {
      el.className = 'peacock-feather';
      el.textContent = '🪶';
    } else {
      el.className = 'golden-dust';
    }
    
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  };
  
  let lastTrailTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 50) { 
      createPeacockTrail(e.clientX, e.clientY);
      lastTrailTime = now;
    }
  });

  window.addEventListener('touchmove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 50 && e.touches.length > 0) {
      createPeacockTrail(e.touches[0].clientX, e.touches[0].clientY);
      lastTrailTime = now;
    }
  }, {passive: true});

  // --- 9. Typewriter Letter Effect ---
  const letterText = `You make life brighter just by being in it…\n\nYour smile, your energy, and your presence mean more than you know 🌸\n\nMay your life always be filled with happiness, peace, and love 🌈\n\nYou truly deserve the best things in the world 💫`;
  const typeWriterElement = document.getElementById('typewriter-text');
  let isTyping = false;

  const typeLetter = () => {
    if (isTyping || !typeWriterElement) return;
    isTyping = true;
    typeWriterElement.innerHTML = '';
    typeWriterElement.classList.add('cursor-blink');
    
    let i = 0;
    const typeNext = () => {
      if (i < letterText.length) {
        typeWriterElement.innerHTML += letterText.charAt(i) === '\\n' ? '<br>' : letterText.charAt(i);
        i++;
        setTimeout(typeNext, Math.random() * 40 + 30); // Random human-like delay
      } else {
        typeWriterElement.classList.remove('cursor-blink');
      }
    };
    typeNext();
  };

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeLetter();
        letterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  
  if (letterSec) {
    letterObserver.observe(letterSec);
  }

  // --- 10. Draggable Scattered Polaroids ---
  const polaroids = document.querySelectorAll('.gallery-item');
  let zIndexCounter = 100;

  polaroids.forEach(polaroid => {
    let isDragging = false;
    let startX, startY, initialX = 0, initialY = 0;
    
    // Add flip listener
    polaroid.addEventListener('click', (e) => {
      // Prevent flipping if dragging occurred
      if (!isDragging) {
        polaroid.classList.toggle('flipped');
        polaroid.style.zIndex = zIndexCounter++;
      }
    });

    const onPointerDown = (e) => {
      isDragging = false;
      startX = e.clientX || e.touches[0].clientX;
      startY = e.clientY || e.touches[0].clientY;
      
      polaroid.style.zIndex = zIndexCounter++;
      polaroid.style.cursor = 'grabbing';
      
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('touchmove', onPointerMove, {passive: false});
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchend', onPointerUp);
    };

    const onPointerMove = (e) => {
      const currentX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
      const currentY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
      
      const dx = currentX - startX;
      const dy = currentY - startY;
      
      // On mobile, if we've moved enough horizontally/vertically, assume it's a drag
      if (!isDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        isDragging = true;
      }

      if (isDragging) {
        if (e.cancelable) e.preventDefault(); // prevent scrolling while dragging
        polaroid.style.transform = `translate(${dx + initialX}px, ${dy + initialY}px) rotate(0deg)`;
      }
    };

    const onPointerUp = (e) => {
      polaroid.style.cursor = 'grab';
      
      const currentX = e.clientX || (e.changedTouches ? e.changedTouches[0].clientX : startX);
      const currentY = e.clientY || (e.changedTouches ? e.changedTouches[0].clientY : startY);
      
      if (isDragging) {
        initialX += (currentX - startX);
        initialY += (currentY - startY);
      }
      
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchend', onPointerUp);
      
      // Reset isDragging slightly after click event resolves
      setTimeout(() => isDragging = false, 50);
    };

    polaroid.addEventListener('mousedown', onPointerDown);
    polaroid.addEventListener('touchstart', onPointerDown, {passive: false});
  });

  // --- 11. Pagination Logic ---
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const pageIndicator = document.getElementById('pageIndicator');
  const galleryPages = document.querySelectorAll('.gallery-page');
  let currentPage = 1;
  const totalPages = galleryPages.length;

  if (prevPageBtn && nextPageBtn && galleryPages.length > 0) {
    const updatePagination = () => {
      galleryPages.forEach((page, index) => {
        if (index + 1 === currentPage) {
          page.style.display = 'flex';
          setTimeout(() => page.classList.remove('hidden'), 50);
        } else {
          page.classList.add('hidden');
          setTimeout(() => page.style.display = 'none', 500); // Wait for fade out
        }
      });
      
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
      prevPageBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
      nextPageBtn.style.display = currentPage === totalPages ? 'none' : 'inline-block';
      
      // Auto-scroll to top of gallery smoothly when changing page
      const gallerySec = document.getElementById('memories');
      if (gallerySec) {
        gallerySec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
      }
    });

    nextPageBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });

    // Initialize display properly
    updatePagination();
  }

  // --- 12. Interactive Virtual Cake Logic ---
  const finalCakeTrigger = document.getElementById('finalCakeTrigger');
  const lightCandleBtn = document.getElementById('lightCandleBtn');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const fallbackBlowBtn = document.getElementById('fallbackBlowBtn');
  const cutCakeBtn = document.getElementById('cutCakeBtn');
  const candleFlame = document.getElementById('candleFlame');
  const cake = document.querySelector('.cake');
  
  const cakeMessage = document.getElementById('cakeMessage');
  const reetAvatar = document.getElementById('reetAvatar');
  const windBlow = document.getElementById('windBlow');
  
  // Trigger Cake display from Finale
  if(finalCakeTrigger) {
    finalCakeTrigger.addEventListener('click', () => {
      virtualCakeSec.style.display = 'block';
      setTimeout(() => {
        virtualCakeSec.classList.remove('hidden');
        virtualCakeSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }

  let audioContext;
  let microphone;
  let analyser;
  let blowDetected = false;
  
  if (lightCandleBtn) {
    lightCandleBtn.addEventListener('click', () => {
      // Light the candle
      candleFlame.classList.add('burning');
      document.body.classList.add('lights-dimmed');
      // Surprise 4: Eternal Glow Focus
      document.body.classList.add('cake-focus-mode');
      
      lightCandleBtn.classList.add('hidden');
      blowCandleBtn.classList.remove('hidden');
      blowCandleBtn.style.display = 'inline-block';
      fallbackBlowBtn.classList.remove('hidden');
      fallbackBlowBtn.style.display = 'inline-block';
    });
  }

  const triggerBlowOutSequence = () => {
    if (blowDetected) return;
    blowDetected = true;
    
    // Remove focus mode on blow out
    document.body.classList.remove('cake-focus-mode');
    
    // 1. Show Avatar Sliding In
    reetAvatar.classList.remove('hidden');
    setTimeout(() => {
      reetAvatar.classList.add('slide-in');
    }, 50);

    // 2. Avatar blows wind after sliding in
    setTimeout(() => {
      windBlow.classList.remove('hidden');
      windBlow.classList.add('blowing');
      
      // 3. Flame goes out as wind hits it
      setTimeout(() => {
        candleFlame.classList.remove('burning');
        document.body.classList.remove('lights-dimmed');
        
        // 4. BIG Confetti Explosion!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          if(window.confetti) {
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
          }
        }, 250);

        blowCandleBtn.classList.add('hidden');
        fallbackBlowBtn.classList.add('hidden');
        blowCandleBtn.style.display = 'none';
        fallbackBlowBtn.style.display = 'none';
        
        cakeMessage.innerHTML = "Have the best day ever, Reet, and live beautifully!<br>You are a truly great soul, and I pray you always remain blessed.<br>May this upcoming year be as sweet and magical as you are! 🍰✨";
        cakeMessage.classList.remove('hidden');
        cakeMessage.style.display = 'inline-block';
        setTimeout(() => cakeMessage.classList.add('show-msg'), 50);
        
        cutCakeBtn.classList.remove('hidden');
        cutCakeBtn.style.display = 'inline-block';

        // Clean up audio
        if(microphone) microphone.disconnect();
        if(audioContext) audioContext.close();

      }, 800); // sync with wind journey
    }, 1000); // wait for avatar to finish slide-in 
  };

  if (fallbackBlowBtn) {
    fallbackBlowBtn.addEventListener('click', () => {
      triggerBlowOutSequence();
    });
  }

  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        blowCandleBtn.textContent = 'Listening (Blow closely!) 🌬️';
        blowCandleBtn.classList.remove('pulse');

        const checkVolume = () => {
          if (blowDetected) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for(let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          let average = sum / bufferLength;
          
          // If average volume crosses threshold, blow out candle
          if (average > 80) { // Threshold for a loud sustained noise
            triggerBlowOutSequence();
          } else {
            requestAnimationFrame(checkVolume);
          }
        };
        checkVolume();
        
      } catch (err) {
        console.error("Microphone access denied:", err);
        alert("Microphone access was denied. You can tap the fallback button to blow it out!");
        blowCandleBtn.classList.add('hidden');
      }
    });
  }

  if (cutCakeBtn) {
    cutCakeBtn.addEventListener('click', () => {
      cake.classList.add('sliced');
      cutCakeBtn.classList.add('hidden');
      setTimeout(() => cutCakeBtn.style.display = 'none', 500);

      cakeMessage.innerHTML = "Have the best day ever, Reet, and live beautifully!<br>You are a truly great soul, and I pray you always remain blessed.<br><br>Praying to Krishna and the Heavens to have all your wishes granted,<br>including the most beautiful wish of all—YOU.<br><br>May this upcoming year be as sweet and magical as you are! 🍰✨";
      cakeMessage.classList.remove('hidden');
      cakeMessage.style.display = 'inline-block';
      setTimeout(() => cakeMessage.classList.add('show-msg'), 50);

      if(window.confetti) {
        confetti({ particleCount: 200, spread: 160, origin: { y: 0.8 }, colors: ['#ffb6c1', '#ffc0cb', '#ffffff'] });
      }

      // Reveal final video message after 3.5s delay
      const finalVideoSec = document.getElementById('final-video');
      if (finalVideoSec) {
        setTimeout(() => {
          finalVideoSec.style.display = 'flex';
          setTimeout(() => {
            finalVideoSec.classList.remove('hidden');
            finalVideoSec.scrollIntoView({ behavior: 'smooth' });
            fadeMusicTo(0.15);
          }, 100);
        }, 3500);
      }
    });
  }

  // --- Memory Stack ---
  const memoryStackEl = document.getElementById('memoryStack');
  if (memoryStackEl) {
    const picsFolder = 'Pics/';
    const picFiles = [
      '1059dc9d2b0c490e819e752ead0ced7e.jpg','20260331201335.jpg','20260331201341.jpg',
      '20260331201345.jpg','20260331201347.jpg','20260331201349.jpg','20260331201350.jpg',
      '20260331201353.jpg','20260331201354.jpg','20260331201356.jpg','20260331201358.jpg',
      '20260331201401.jpg','20260331201403.jpg','20260331201412.jpg','20260331201421.jpg',
      '20260331201426.jpg','20260331201429.jpg','20260331201441.jpg','20260331201449.jpg',
      '20260331201456.jpg','20260331201504.jpg','20260331201513.jpg','20260331201517.jpg',
      '20260331201536.jpg','20260331201540.jpg','2da3c70a7726427b937bf0df12f8c7d3.jpg',
      '2f5a5cb6eb56476b8f249efb5a60bb5d.jpg','5d2fa35b96b840c282fa20d7aaf002e2.jpg',
      '8811b389c9da4ec184bfda9600847542.jpg','9145c1b7121e4686afb1f65ca4b074cb.jpg',
      'b4c0af68e7b140c394ef09996b79085c.jpg','d07d9d61d5fb48658d19e8e532f0be10.jpg',
      'e2b08b6fe6dd419c905e527f50ed56cb.jpg'
    ];
    const captions = [
      'Absolutely her 💖','This one right here 🌸','Pure happiness ✨','Cannot be tamed 🔥',
      'A whole vibe 💫','Just look at her 😍','Effortlessly gorgeous 👑','She glows 🌟',
      'My favorite human 💝','Iconic. Simply iconic 🎭','Born to shine ✨','Unmatched energy 💃',
      'Cutest ever 🥺','This smile! 😊','Too beautiful 🌺','Timeless 🕊️','Heart eyes 💖',
      'She just does it 🔮','Radiate & elevate 🌙','Main character energy 🎬','Soft & powerful 🌸',
      'Joyful soul 🌈','One of a kind 💎','Precious vibes 🌟','Flor de vida 🌷',
      'That laugh tho 😂💖','Shining through 🌤️','Queen behavior 👸','Magical person 🪄',
      'Total it-girl 💅','Worth every word 📖','Dreamy & real ✨'
    ];

    // Shuffle randomly
    const shuffled = [...picFiles].sort(() => Math.random() - 0.5);

    // Build only top 15 for performance
    const toShow = shuffled.slice(0, 15);
    toShow.forEach((file, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.style.zIndex = toShow.length - i;
      // Slight random initial tilt per card
      const tiltInit = (Math.random() - 0.5) * 12;
      card.style.transform = `rotate(${tiltInit}deg) translateY(${i * 2}px)`;
      card.style.setProperty('--init-tilt', `${tiltInit}deg`);
      card.innerHTML = `
        <img src="${picsFolder}${file}" alt="Memory" loading="lazy" style="object-position: center 20%;">
        <div class="memory-card-caption cursive">${captions[i % captions.length]}</div>
      `;
      memoryStackEl.appendChild(card);

      // Drag-to-swipe
      let startX, startY, isDragging = false;
      card.addEventListener('mousedown', e => { startX = e.clientX; startY = e.clientY; isDragging = true; });
      card.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; isDragging = true; }, { passive: true });
      
      const onMove = e => {
        if (!isDragging) return;
        const cx = e.clientX || e.touches[0].clientX;
        const cy = e.clientY || e.touches[0].clientY;
        const dx = cx - startX, dy = cy - startY;
        
        // Prevent default only if we are actually dragging enough
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            if (e.cancelable) e.preventDefault();
        }
        
        const tilt = dx * 0.08;
        card.style.transform = `rotate(${tiltInit + tilt}deg) translate(${dx}px, ${dy}px)`;
        card.style.opacity = Math.max(0.4, 1 - Math.abs(dx) / 300);
      };
      const onEnd = e => {
        if (!isDragging) return;
        isDragging = false;
        const cx = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) || startX;
        const dx = cx - startX;
        if (Math.abs(dx) > 80) {
          // Flick it off
          const dir = dx > 0 ? 1 : -1;
          card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
          card.style.transform = `rotate(${tiltInit + dir * 25}deg) translate(${dir * 600}px, 80px)`;
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 500);
        } else {
          card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
          card.style.transform = `rotate(${tiltInit}deg)`;
          card.style.opacity = '1';
          setTimeout(() => card.style.transition = '', 400);
        }
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('touchmove', onMove, { passive: true });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    });
  }

  // --- Film Reel hover-to-play with audio crossfade ---
  let activeFilmVid = null;
  let musicFadeInterval = null;

  function fadeMusicTo(targetVol, onComplete) {
    clearInterval(musicFadeInterval);
    const step = targetVol > bgMusic.volume ? 0.05 : -0.05;
    musicFadeInterval = setInterval(() => {
      const next = bgMusic.volume + step;
      if ((step > 0 && next >= targetVol) || (step < 0 && next <= targetVol)) {
        bgMusic.volume = Math.max(0, Math.min(1, targetVol));
        clearInterval(musicFadeInterval);
        if (onComplete) onComplete();
      } else {
        bgMusic.volume = Math.max(0, Math.min(1, next));
      }
    }, 40);
  }

  document.querySelectorAll('.film-frame').forEach(frame => {
    const vid = frame.querySelector('.film-video');
    if (!vid) return;

    let blessingInterval = null;

    frame.addEventListener('mouseenter', () => {
      // Surprise 2: Floating Blessings
      blessingInterval = setInterval(() => {
        const blessing = document.createElement('div');
        blessing.className = 'floating-blessing';
        blessing.textContent = ['❤️','✨','🌸','🌟','💖'][Math.floor(Math.random()*5)];
        blessing.style.left = `${Math.random() * 80 + 10}%`;
        blessing.style.bottom = '20px';
        frame.appendChild(blessing);
        setTimeout(() => blessing.remove(), 1500);
      }, 300);

      // Pause any other playing film video first
      if (activeFilmVid && activeFilmVid !== vid) {
        activeFilmVid.pause();
        activeFilmVid.currentTime = 0;
      }
      activeFilmVid = vid;
      // Fade music down to 0, then play video with sound
      fadeMusicTo(0, () => bgMusic.pause());
      vid.volume = 0.9;
      vid.play().catch(() => {});
    });

    frame.addEventListener('mouseleave', () => {
      clearInterval(blessingInterval);
      vid.pause();
      vid.currentTime = 0;
      activeFilmVid = null;
      // Resume & fade music back in if it was playing
      if (isPlaying) {
        bgMusic.volume = 0;
        bgMusic.play().catch(() => {});
        fadeMusicTo(0.4);
      }
    });
  });


});
