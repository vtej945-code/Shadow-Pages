// Matrix Rain Animation
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.init();
        this.animate();
    }

// Enhanced Leaderboard Database System
class LeaderboardDatabase {
    constructor() {
        this.dbName = 'shadowPagesLeaderboard';
        this.participants = new Map();
        this.observers = [];
        this.autoSaveInterval = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.startAutoSave();
        this.setupStorageListener();
    }

    // Load data from localStorage
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.dbName);
            if (data) {
                const parsed = JSON.parse(data);
                this.participants = new Map(parsed.participants || []);
            }
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            this.participants = new Map();
        }
    }

    // Save data to localStorage
    saveToStorage() {
        try {
            const data = {
                participants: Array.from(this.participants.entries()),
                lastUpdated: Date.now()
            };
            localStorage.setItem(this.dbName, JSON.stringify(data));
            localStorage.setItem('leaderboardData', JSON.stringify(this.getLeaderboardArray()));
            this.notifyObservers();
        } catch (error) {
            console.error('Error saving leaderboard data:', error);
        }
    }

    // Auto-save every 3 seconds
    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveToStorage();
        }, 3000);
    }

    // Listen for storage changes from other tabs
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.dbName) {
                this.loadFromStorage();
                this.notifyObservers();
            }
        });
    }

    // Add observer for real-time updates
    addObserver(callback) {
        this.observers.push(callback);
    }

    // Notify all observers of changes
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.getLeaderboardArray());
            } catch (error) {
                console.error('Error notifying observer:', error);
            }
        });
    }

    // Create or update participant
    updateParticipant(name, level, status, additionalData = {}) {
        const currentTime = Date.now();
        const challengeStartTime = parseInt(localStorage.getItem('challengeStartTime')) || currentTime;
        const elapsedTime = currentTime - challengeStartTime;

        // Calculate time string
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const timeString = String(totalMinutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');

        const existingParticipant = this.participants.get(name);

        const participant = {
            name: name,
            level: Math.max(existingParticipant?.level || 0, level),
            status: status,
            time: timeString,
            totalTime: elapsedTime,
            timestamp: currentTime,
            attempts: (existingParticipant?.attempts || 0) + (status === 'failed' ? 1 : 0),
            completedLevels: existingParticipant?.completedLevels || [],
            failedLevels: existingParticipant?.failedLevels || [],
            startTime: existingParticipant?.startTime || challengeStartTime,
            ...additionalData
        };

        // Track completed/failed levels
        if (status === 'completed' && !participant.completedLevels.includes(level)) {
            participant.completedLevels.push(level);
            participant.completedLevels.sort((a, b) => a - b);
        } else if (status === 'failed' && !participant.failedLevels.includes(level)) {
            participant.failedLevels.push(level);
        }

        // Update final completion status
        if (level === 5 && status === 'completed') {
            participant.status = 'champion';
            participant.completionTime = currentTime;
        }

        this.participants.set(name, participant);
        this.saveToStorage();

        console.log(`Leaderboard updated: ${name} - Level ${level} - ${status}`);
        return participant;
    }

    // Get participant data
    getParticipant(name) {
        return this.participants.get(name);
    }

    // Get all participants as sorted array
    getLeaderboardArray() {
        const participants = Array.from(this.participants.values());

        return participants.sort((a, b) => {
            // Champions first
            if (a.status === 'champion' && b.status !== 'champion') return -1;
            if (b.status === 'champion' && a.status !== 'champion') return 1;

            // If both are champions, sort by completion time
            if (a.status === 'champion' && b.status === 'champion') {
                return a.totalTime - b.totalTime;
            }

            // Sort by level (descending), then by time (ascending)
            if (a.level !== b.level) {
                return b.level - a.level;
            }

            return a.totalTime - b.totalTime;
        });
    }

    // Remove participant
    removeParticipant(name) {
        const removed = this.participants.delete(name);
        if (removed) {
            this.saveToStorage();
        }
        return removed;
    }

    // Clear all data
    clearAll() {
        this.participants.clear();
        this.saveToStorage();
    }

    // Get statistics
    getStats() {
        const participants = Array.from(this.participants.values());
        return {
            totalParticipants: participants.length,
            champions: participants.filter(p => p.status === 'champion').length,
            activeParticipants: participants.filter(p => p.status === 'active').length,
            averageLevel: participants.length > 0 ?
                participants.reduce((sum, p) => sum + p.level, 0) / participants.length : 0
        };
    }
}

// Global leaderboard database instance
window.leaderboardDB = new LeaderboardDatabase();

init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array(this.columns).fill(1);
}

animate() {
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.04)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#00d4ff';
    this.ctx.font = `${this.fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
        const text = this.chars[Math.floor(Math.random() * this.chars.length)];
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;

        // Add glow effect
        this.ctx.shadowColor = '#00d4ff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText(text, x, y);
        this.ctx.shadowBlur = 0;

        if (y > this.canvas.height && Math.random() > 0.975) {
            this.drops[i] = 0;
        }
        this.drops[i]++;
    }

    requestAnimationFrame(() => this.animate());
}

resize() {
    this.init();
}
}

// Enhanced Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.maxParticles = 80;
        this.connectionDistance = 120;

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Create particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: this.getRandomColor(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    getRandomColor() {
        const colors = ['#00d4ff', '#8b5cf6', '#f472b6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.pulse += 0.02;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.x -= dx * force * 0.02;
                particle.y -= dy * force * 0.02;
            }

            // Pulsing effect
            const pulseSize = particle.size + Math.sin(particle.pulse) * 0.5;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();

            // Draw glow
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity * 0.2;
            this.ctx.fill();

            // Draw connections
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// Background Music System
class BackgroundMusic {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNode = null;
        this.toggle = document.getElementById('music-toggle');
        this.musicStatus = this.toggle.querySelector('.music-status');

        this.init();
    }

    init() {
        this.toggle.addEventListener('click', () => this.toggleMusic());
    }

    async toggleMusic() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0.1;
        }

        if (this.isPlaying) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
    }

    startMusic() {
        this.isPlaying = true;
        this.toggle.classList.add('active');
        this.musicStatus.textContent = 'Music: ON';

        // Create ambient cyberpunk music
        this.createAmbientTrack();
    }

    stopMusic() {
        this.isPlaying = false;
        this.toggle.classList.remove('active');
        this.musicStatus.textContent = 'Music: OFF';

        this.oscillators.forEach(osc => {
            osc.stop();
        });
        this.oscillators = [];
    }

    createAmbientTrack() {
        const frequencies = [110, 146.83, 220, 293.66, 440];

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            gainNode.gain.value = 0.02;
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 2);

            oscillator.connect(gainNode);
            gainNode.connect(this.gainNode);

            oscillator.start();
            this.oscillators.push(oscillator);

            // Add subtle frequency modulation
            setTimeout(() => {
                if (this.isPlaying) {
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(freq * 1.1, this.audioContext.currentTime + 4);
                    oscillator.frequency.linearRampToValueAtTime(freq, this.audioContext.currentTime + 8);
                }
            }, index * 1000);
        });
    }
}

// Page Transition System
class PageTransition {
    constructor() {
        this.overlay = document.getElementById('page-transition');
        this.isTransitioning = false;
    }

    show() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.overlay.classList.add('active');

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    hide() {
        setTimeout(() => {
            this.overlay.classList.remove('active');
            this.isTransitioning = false;
        }, 500);
    }

    async transition(callback) {
        await this.show();
        if (callback) callback();
        this.hide();
    }
}

// Particle Explosion System
class ParticleExplosion {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.className = 'particle-explosion';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createExplosion(x, y, color = '#00d4ff') {
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1,
                decay: Math.random() * 0.02 + 0.01,
                size: Math.random() * 4 + 2,
                color: color,
                gravity: 0.1
            });
        }

        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.life -= particle.decay;

            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }

    levelCompleteExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Multiple explosions with different colors
        this.createExplosion(centerX, centerY, '#00d4ff');
        setTimeout(() => this.createExplosion(centerX, centerY, '#8b5cf6'), 200);
        setTimeout(() => this.createExplosion(centerX, centerY, '#f472b6'), 400);

        // Add screen shake effect
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.start();
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Enhanced Countdown Timer
class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        this.start();
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;

        if (distance < 0) {
            this.elements.days.textContent = '00';
            this.elements.hours.textContent = '00';
            this.elements.minutes.textContent = '00';
            this.elements.seconds.textContent = '00';
            clearInterval(this.interval);
            this.showEventStarted();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        this.animateNumber(this.elements.days, days.toString().padStart(2, '0'));
        this.animateNumber(this.elements.hours, hours.toString().padStart(2, '0'));
        this.animateNumber(this.elements.minutes, minutes.toString().padStart(2, '0'));
        this.animateNumber(this.elements.seconds, seconds.toString().padStart(2, '0'));
    }

    animateNumber(element, newValue) {
        if (element.textContent !== newValue) {
            element.style.transform = 'scale(1.2) rotateX(180deg)';
            element.style.color = '#f472b6';
            setTimeout(() => {
                element.textContent = newValue;
                element.style.transform = 'scale(1) rotateX(0deg)';
                element.style.color = '';
            }, 200);
        }
    }

    showEventStarted() {
        const countdownWrapper = document.querySelector('.countdown-wrapper');
        countdownWrapper.innerHTML = `
            <div class="event-started">
                <h2 style="color: #00d4ff; font-size: 2rem; margin-bottom: 20px;">🎉 EVENT HAS STARTED! 🎉</h2>
                <p style="color: #8b5cf6; font-size: 1.2rem;">The Shadow Pages challenge is now live!</p>
            </div>
        `;
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        this.init();
    }

    init() {
        // Add different animation types to elements
        const elements = [
            { selector: '.glass-card', animation: 'scale-up' },
            { selector: '.timeline-item', animation: 'slide-left' },
            { selector: '.level-card', animation: 'rotate-in' },
            { selector: '.rule-item', animation: 'slide-right' },
            { selector: '.stat-item', animation: 'scale-up' }
        ];

        elements.forEach(({ selector, animation }) => {
            const items = document.querySelectorAll(selector);
            items.forEach((el, index) => {
                el.classList.add('scroll-animate', animation);
                el.style.animationDelay = `${index * 0.1}s`;
                this.observer.observe(el);
            });
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Add special effects for certain elements
                if (entry.target.classList.contains('stat-item')) {
                    this.animateCounter(entry.target);
                }

                this.observer.unobserve(entry.target);
            }
        });
    }

    animateCounter(element) {
        const numberElement = element.querySelector('.stat-number');
        if (!numberElement) return;

        const finalValue = numberElement.textContent;
        if (finalValue === '∞') return;

        const finalNumber = parseInt(finalValue);
        let currentNumber = 0;
        const increment = finalNumber / 50;

        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                numberElement.textContent = finalValue;
                clearInterval(counter);
            } else {
                numberElement.textContent = Math.floor(currentNumber).toString();
            }
        }, 50);
    }
}

// Interactive Timeline Enhanced
class InteractiveTimeline {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.currentActive = 0;
        this.autoProgressInterval = null;
        this.init();
    }

    init() {
        this.timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => this.activateItem(index));
            item.addEventListener('mouseenter', () => this.hoverItem(item, true));
            item.addEventListener('mouseleave', () => this.hoverItem(item, false));
        });

        // Start auto-progress after a delay
        setTimeout(() => {
            this.startAutoProgress();
        }, 3000);
    }

    activateItem(index) {
        // Stop auto-progress when user interacts
        this.stopAutoProgress();

        this.timelineItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active', 'unlocking');
                setTimeout(() => {
                    item.classList.remove('unlocking');
                }, 1000);
            }
        });

        this.currentActive = index;
        this.playLevelSound();

        // Restart auto-progress after user interaction
        setTimeout(() => {
            this.startAutoProgress();
        }, 5000);
    }

    hoverItem(item, isHover) {
        const marker = item.querySelector('.timeline-marker');
        const icon = item.querySelector('.level-icon');

        if (isHover) {
            marker.style.transform = 'translateX(-50%) scale(1.2)';
            marker.style.borderColor = '#f472b6';
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            this.playHoverSound();
        } else if (!item.classList.contains('active')) {
            marker.style.transform = 'translateX(-50%) scale(1)';
            marker.style.borderColor = '#00d4ff';
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    startAutoProgress() {
        this.autoProgressInterval = setInterval(() => {
            this.currentActive = (this.currentActive + 1) % this.timelineItems.length;
            this.activateItem(this.currentActive);
        }, 4000);
    }

    stopAutoProgress() {
        if (this.autoProgressInterval) {
            clearInterval(this.autoProgressInterval);
            this.autoProgressInterval = null;
        }
    }

    playLevelSound() {
        // Play level sound using the global playSound function
        if (window.backgroundMusic && window.backgroundMusic.audioContext) {
            playSound(440, 0.2, 'sine');
        }
    }

    playHoverSound() {
        // Play hover sound using the global playSound function
        if (window.backgroundMusic && window.backgroundMusic.audioContext) {
            playSound(880, 0.1, 'sine');
        }
    }
}

// Enhanced Level Card Effects
class LevelCardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.level-card');
        this.init();
    }

    init() {
        // Initially lock all cards
        this.cards.forEach(card => {
            card.classList.add('locked');
        });

        this.cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => this.onHover(card, index));
            card.addEventListener('mouseleave', () => this.onLeave(card));
            card.addEventListener('click', () => this.onClick(card, index));
        });
    }

    onHover(card, index) {
        if (card.classList.contains('locked')) return;

        // Enhanced hover effects
        const title = card.querySelector('h3');
        const icon = card.querySelector('.level-icon');
        const arrow = card.querySelector('.card-arrow');

        title.style.animation = 'glitchAnimation 0.5s ease-in-out';
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        arrow.style.transform = 'translateX(10px) scale(1.2)';

        card.style.transform = 'translateY(-15px) scale(1.03)';
        card.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.3)';

        this.playHoverSound();
    }

    onLeave(card) {
        if (card.classList.contains('locked')) return;

        const title = card.querySelector('h3');
        const icon = card.querySelector('.level-icon');
        const arrow = card.querySelector('.card-arrow');

        title.style.animation = '';
        icon.style.transform = '';
        arrow.style.transform = '';
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    onClick(card, index) {
        if (card.classList.contains('locked')) {
            this.showLockedMessage();
            return;
        }

        // Click animation
        card.style.transform = 'translateY(-15px) scale(0.98)';
        setTimeout(() => {
            card.style.transform = 'translateY(-15px) scale(1.03)';
        }, 150);

        // Trigger level completion effect
        card.classList.add('level-completed');
        window.particleExplosion.levelCompleteExplosion(card);

        setTimeout(() => {
            card.classList.remove('level-completed');
        }, 2000);

        this.showLevelPreview(index + 1);
        this.playClickSound();
    }

    showLockedMessage() {
        const message = document.createElement('div');
        message.className = 'locked-message';
        message.innerHTML = `
            <div class="message-content">
                <h3>🔒 Level Locked</h3>
                <p>Complete the terminal login to unlock all levels!</p>
            </div>
        `;

        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ff0040;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #ff0040;
            text-align: center;
            z-index: 10001;
            animation: fadeInUp 0.3s ease-out;
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 2000);

        this.playErrorSound();
    }

    showLevelPreview(level) {
        const levelData = {
            1: { title: 'Logic Puzzle', description: 'Solve complex logical sequences and patterns', difficulty: 'Medium', color: '#00d4ff' },
            2: { title: 'Cipher Challenge', description: 'Decrypt hidden messages using various cipher techniques', difficulty: 'Hard', color: '#8b5cf6' },
            3: { title: 'Code Debugging', description: 'Find and fix bugs in algorithmic code snippets', difficulty: 'Expert', color: '#f472b6' },
            4: { title: 'Mind Riddle', description: 'Think creatively to solve abstract puzzles', difficulty: 'Extreme', color: '#00d4ff' },
            5: { title: 'Final Challenge', description: 'The ultimate test combining all previous skills', difficulty: 'Legendary', color: '#8b5cf6' }
        };

        const data = levelData[level];

        const modal = document.createElement('div');
        modal.className = 'level-modal';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h2 style="color: ${data.color};">Level ${level}: ${data.title}</h2>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="modal-body">
                    <p class="level-description">${data.description}</p>
                    <div class="level-stats">
                        <div class="stat">
                            <span class="stat-label">Difficulty:</span>
                            <span class="stat-value" style="color: ${data.color};">${data.difficulty}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Estimated Time:</span>
                            <span class="stat-value">${10 + level * 5} minutes</span>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="start-level-btn" style="background: ${data.color};">Start Level</button>
                        <button class="preview-btn" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">Close Preview</button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            animation: fadeInUp 0.3s ease-out;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            max-width: 600px;
            width: 90%;
            text-align: center;
            position: relative;
        `;

        document.body.appendChild(modal);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    playHoverSound() {
        // Play hover sound using the global playSound function
        if (window.backgroundMusic && window.backgroundMusic.audioContext) {
            playSound(660, 0.1, 'sine');
        }
    }

    playClickSound() {
        // Play click sound using the global playSound function
        if (window.backgroundMusic && window.backgroundMusic.audioContext) {
            playSound(880, 0.2, 'sine');
        }
    }

    playErrorSound() {
        // Play error sound using the global playSound function
        if (window.backgroundMusic && window.backgroundMusic.audioContext) {
            playSound(200, 0.3, 'sawtooth');
        }
    }
}

// Enhanced Glitch Effects
class GlitchEffects {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch-text');
        this.init();
    }

    init() {
        this.glitchElements.forEach(element => {
            // Random glitch intervals
            setInterval(() => {
                this.triggerGlitch(element);
            }, 5000 + Math.random() * 10000);

            // Hover glitch
            element.addEventListener('mouseenter', () => {
                this.triggerGlitch(element);
            });
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'glitchAnimation 0.6s ease-in-out';
        }, 10);
    }
}

// Navbar Effects
class NavbarEffects {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            if (scrolled > 100) {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                this.navbar.style.backdropFilter = 'blur(30px)';
                this.navbar.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.8)';
                this.navbar.style.backdropFilter = 'blur(20px)';
                this.navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            }
        });
    }
}

// Parallax Effects
class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            // Hero parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            // Floating elements parallax
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform += ` translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Make startChallenge function globally available
window.startChallenge = function () {
    console.log('startChallenge function called');

    // Allow all users to start the challenge
    // Initialize the challenge timer
    const startTime = new Date().getTime();
    localStorage.setItem('challengeStartTime', startTime);
    localStorage.setItem('challengeStatus', 'active');

    // Reset attempts counter for new challenge
    localStorage.removeItem('totalAttempts');

    // Set a default participant name (no prompt)
    localStorage.setItem('participantName', 'Anonymous');

    console.log('About to initialize user in leaderboard');

    // Initialize user in leaderboard with level 1 active status
    try {
        initializeUserInLeaderboard('Anonymous', startTime);
        console.log('User initialized in leaderboard successfully');
    } catch (error) {
        console.error('Error initializing user in leaderboard:', error);
    }

    console.log('About to redirect to level1.html');

    // Direct redirect to level 1
    window.location.href = 'level1.html';
};

// Enhanced leaderboard functions using the new database system
function initializeUserInLeaderboard(participantName, startTime) {
    console.log('Initializing user in leaderboard:', participantName);

    // Initialize user with level 1 active status
    window.leaderboardDB.updateParticipant(participantName, 1, 'active', {
        startTime: startTime || Date.now()
    });

    console.log('User initialized successfully');
}

// Function to update leaderboard when user progresses
function updateLeaderboardProgress(participantName, level, status) {
    console.log('Updating leaderboard progress:', participantName, level, status);

    // Update participant in database
    const participant = window.leaderboardDB.updateParticipant(participantName, level, status);

    // Force refresh the leaderboard display
    if (window.animatedLeaderboard) {
        window.animatedLeaderboard.forceRefresh();
    }

    return participant;
}

// Function to handle level completion
function handleLevelCompletion(participantName, level) {
    console.log('Level completed:', participantName, level);

    const nextLevel = level + 1;
    const status = nextLevel > 5 ? 'champion' : 'active';

    return updateLeaderboardProgress(participantName, nextLevel > 5 ? 5 : nextLevel, status);
}

// Function to handle level failure
function handleLevelFailure(participantName, level) {
    console.log('Level failed:', participantName, level);

    return updateLeaderboardProgress(participantName, level, 'failed');
}

// Function to reset user progress
function resetUserProgress(participantName) {
    console.log('Resetting user progress:', participantName);

    window.leaderboardDB.removeParticipant(participantName);

    // Re-initialize with fresh start
    const startTime = Date.now();
    localStorage.setItem('challengeStartTime', startTime.toString());

    return initializeUserInLeaderboard(participantName, startTime);
}

function initializeUserInLeaderboard(participantName, startTime) {
    // Get existing leaderboard data
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData') || '[]');

    // Remove any existing entry for this user (fresh start)
    leaderboardData = leaderboardData.filter(entry => entry.name !== participantName);

    // Create new entry for this user
    const userEntry = {
        name: participantName,
        level: 1,
        time: '00:00',
        status: 'active',
        timestamp: startTime
    };

    leaderboardData.push(userEntry);

    // Save updated leaderboard
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

// Function to update leaderboard when user progresses
function updateLeaderboardProgress(participantName, level, status) {
    // Calculate current time
    const challengeStartTime = localStorage.getItem('challengeStartTime');
    if (!challengeStartTime) return;

    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - parseInt(challengeStartTime);
    const totalMinutes = Math.floor(elapsedTime / (1000 * 60));
    const remainingSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const timeString = String(totalMinutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0');

    // Get existing leaderboard data
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboardData') || '[]');

    // Find and update user entry
    const userIndex = leaderboardData.findIndex(entry => entry.name === participantName);

    if (userIndex !== -1) {
        leaderboardData[userIndex].level = Math.max(leaderboardData[userIndex].level, level);
        leaderboardData[userIndex].time = timeString;
        leaderboardData[userIndex].status = status;
        leaderboardData[userIndex].timestamp = currentTime;
    } else {
        // Create new entry if not found
        leaderboardData.push({
            name: participantName,
            level: level,
            time: timeString,
            status: status,
            timestamp: currentTime
        });
    }

    // Save updated leaderboard
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
}

function playSound(frequency, duration, type = 'sine', volume = 0.1) {
    if (!window.AudioContext && !window.webkitAudioContext) return;

    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        // Silently fail if audio context is not available
    }
}

// Add screen shake animation to CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize matrix rain
    window.matrixRain = new MatrixRain();

    // Initialize particle system
    window.particleSystem = new ParticleSystem();

    // Initialize background music
    window.backgroundMusic = new BackgroundMusic();

    // Initialize page transition
    window.pageTransition = new PageTransition();

    // Initialize particle explosion system
    window.particleExplosion = new ParticleExplosion();

    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const texts = [
            'Five levels. One winner. Infinite possibilities.',
            'Are you ready to enter the shadows?',
            'Only the strongest minds will survive.',
            'The challenge awaits the brave.'
        ];
        new TypingAnimation(typingElement, texts, 80, 40, 3000);
    }

    // Initialize countdown timer (March 12, 2026, 3:00 PM)
    const countdown = new CountdownTimer('March 12, 2026 15:00:00');

    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();

    // Initialize interactive timeline
    const interactiveTimeline = new InteractiveTimeline();

    // Initialize level card effects
    const levelCardEffects = new LevelCardEffects();

    // Initialize glitch effects
    const glitchEffects = new GlitchEffects();

    // Initialize navbar effects
    const navbarEffects = new NavbarEffects();

    // Initialize parallax effects
    const parallaxEffects = new ParallaxEffects();

    // Add loading animation to hero section
    const heroSection = document.querySelector('.hero-section');
    heroSection.style.opacity = '0';
    setTimeout(() => {
        heroSection.style.transition = 'opacity 2s ease-in-out';
        heroSection.style.opacity = '1';
    }, 100);

    // Add stagger animation to nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 300 + index * 150);
    });
});

// Add smooth scroll behavior to nav links
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        const modals = document.querySelectorAll('.level-modal, .locked-message');
        modals.forEach(modal => modal.remove());
    }

    // Arrow key navigation
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const nextSection = getNextSection(currentSection);
        if (nextSection) {
            window.pageTransition.transition(() => {
                scrollToSection(nextSection.id);
            });
        }
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const prevSection = getPrevSection(currentSection);
        if (prevSection) {
            window.pageTransition.transition(() => {
                scrollToSection(prevSection.id);
            });
        }
    }
});

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 80;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - scroll to next section
            const currentSection = getCurrentSection();
            const nextSection = getNextSection(currentSection);
            if (nextSection) {
                window.pageTransition.transition(() => {
                    scrollToSection(nextSection.id);
                });
            }
        } else {
            // Swipe down - scroll to previous section
            const currentSection = getCurrentSection();
            const prevSection = getPrevSection(currentSection);
            if (prevSection) {
                window.pageTransition.transition(() => {
                    scrollToSection(prevSection.id);
                });
            }
        }
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.pageYOffset + 200;

    for (let section of sections) {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
            return section;
        }
    }
    return sections[0];
}

function getNextSection(currentSection) {
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex + 1] || null;
}

function getPrevSection(currentSection) {
    const sections = Array.from(document.querySelectorAll('section'));
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex - 1] || null;
}

// Performance optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any performance-heavy animations here
    ticking = false;
}

// Add scroll listener with throttling
window.addEventListener('scroll', requestTick);

// Handle window resize
window.addEventListener('resize', () => {
    window.matrixRain.resize();
    window.particleSystem.canvas.width = window.innerWidth;
    window.particleSystem.canvas.height = window.innerHeight;
});//
 Animated Leaderboard
class AnimatedLeaderboard {
    constructor() {
        this.leaderboardBody = document.getElementById('leaderboard-body');
        this.refreshIndicator = document.getElementById('refresh-indicator');
        this.participants = [];

        this.init();
        this.startUpdates();
    }

    init() {
        this.loadLeaderboardData();
        this.renderLeaderboard();
    }

    loadLeaderboardData() {
        // Get real leaderboard data from localStorage
        const realData = JSON.parse(localStorage.getItem('leaderboardData') || '[]');

        // Add some demo data if no real data exists
        let demoData = [];
        if (realData.length === 0) {
            demoData = [
                { name: 'CyberNinja', level: 5, time: '12:34', status: 'completed', timestamp: Date.now() - 1000000 },
                { name: 'CodeMaster', level: 4, time: '15:22', status: 'active', timestamp: Date.now() - 800000 },
                { name: 'HackWizard', level: 4, time: '16:45', status: 'active', timestamp: Date.now() - 700000 },
                { name: 'DataGhost', level: 3, time: '18:12', status: 'active', timestamp: Date.now() - 600000 },
                { name: 'ByteHunter', level: 3, time: '19:33', status: 'failed', timestamp: Date.now() - 500000 },
                { name: 'PixelWarrior', level: 2, time: '21:45', status: 'active', timestamp: Date.now() - 400000 },
                { name: 'LogicBeast', level: 2, time: '23:12', status: 'active', timestamp: Date.now() - 300000 },
                { name: 'AlgoKnight', level: 1, time: '25:34', status: 'active', timestamp: Date.now() - 200000 }
            ];
        }

        // Prioritize real data over demo data
        this.participants = [...realData, ...demoData];

        // Remove duplicates (prioritize real data)
        const uniqueParticipants = [];
        const seenNames = new Set();

        for (const participant of this.participants) {
            if (!seenNames.has(participant.name)) {
                uniqueParticipants.push(participant);
                seenNames.add(participant.name);
            }
        }

        this.participants = uniqueParticipants;

        // Sort by completion status and progress
        this.participants.sort((a, b) => {
            // Completed participants first
            if (a.status === 'completed' && b.status !== 'completed') return -1;
            if (a.status !== 'completed' && b.status === 'completed') return 1;

            // Among completed participants, sort by completion time (fastest first)
            if (a.status === 'completed' && b.status === 'completed') {
                return a.timestamp - b.timestamp;
            }

            // Among non-completed, sort by level progress (highest level first)
            if (a.level !== b.level) return b.level - a.level;

            // If same level, sort by time (fastest first)
            return a.time.localeCompare(b.time);
        });

        // Limit to top 10
        this.participants = this.participants.slice(0, 10);
    }

    renderLeaderboard() {
        if (!this.leaderboardBody) return;

        if (this.participants.length === 0) {
            this.leaderboardBody.innerHTML = `
                <div class="empty-leaderboard">
                    <div class="empty-leaderboard-icon">🏆</div>
                    <h3>No participants yet</h3>
                    <p>Be the first to take on the Shadow Pages challenge!</p>
                </div>
            `;
            return;
        }

        this.leaderboardBody.innerHTML = '';

        this.participants.forEach((participant, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            entry.style.animationDelay = `${index * 0.1}s`;

            // Special styling for completed participants
            if (participant.status === 'completed') {
                entry.classList.add('completed-participant');
            }

            // Add new entry animation for recently added participants
            if (participant.isNew) {
                entry.classList.add('new-entry');
                setTimeout(() => {
                    entry.classList.remove('new-entry');
                    participant.isNew = false;
                }, 2000);
            }

            const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
            const statusColor = participant.status === 'completed' ? 'var(--success-color)' :
                participant.status === 'active' ? 'var(--neon-blue)' :
                    participant.status === 'failed' ? '#ff0040' : 'var(--neon-pink)';

            entry.innerHTML = `
                <div class="rank ${rankClass}">#${index + 1}</div>
                <div class="participant-name">${participant.name}</div>
                <div class="level-progress">${participant.level}/5</div>
                <div class="completion-time">${participant.time}</div>
                <div class="participant-status" style="color: ${statusColor}">
                    ${participant.status.toUpperCase()}
                </div>
            `;

            this.leaderboardBody.appendChild(entry);
        });
    }

    // Method to immediately refresh leaderboard (called from Level 5)
    forceRefresh() {
        this.loadLeaderboardData();
        this.renderLeaderboard();
        console.log('Leaderboard force refreshed');
    }

    // Method to add real-time participant update
    addParticipant(participantData) {
        participantData.isNew = true;
        this.participants.unshift(participantData);
        this.participants = this.participants.slice(0, 10); // Keep top 10
        this.renderLeaderboard();
    }

    // Cleanup method
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated leaderboard
    window.animatedLeaderboard = new AnimatedLeaderboard();
});