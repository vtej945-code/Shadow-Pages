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

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
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
    if (window.leaderboardDB) {
        window.leaderboardDB.updateParticipant(participantName, 1, 'active', {
            startTime: startTime || Date.now()
        });
    }

    console.log('User initialized successfully');
}

// Function to update leaderboard when user progresses
function updateLeaderboardProgress(participantName, level, status) {
    console.log('Updating leaderboard progress:', participantName, level, status);

    // Update participant in database
    let participant = null;
    if (window.leaderboardDB) {
        participant = window.leaderboardDB.updateParticipant(participantName, level, status);
    }

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

    if (window.leaderboardDB) {
        window.leaderboardDB.removeParticipant(participantName);
    }

    // Re-initialize with fresh start
    const startTime = Date.now();
    localStorage.setItem('challengeStartTime', startTime.toString());

    return initializeUserInLeaderboard(participantName, startTime);
}

// Add screen shake animation to CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
}`;
document.head.appendChild(shakeStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize matrix rain
    window.matrixRain = new MatrixRain();

    // Initialize particle system
    window.particleSystem = new ParticleSystem();

    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const texts = [
            'Five levels. One winner. Five attempts.',
            'Are you ready to enter the shadows?',
            'Only the strongest minds will survive.',
            'The challenge awaits the brave.'
        ];
        new TypingAnimation(typingElement, texts, 80, 40, 3000);
    }

    // Initialize scroll animations
    const scrollAnimations = new ScrollAnimations();

    // Initialize interactive timeline
    const interactiveTimeline = new InteractiveTimeline();

    // Initialize navbar effects
    const navbarEffects = new NavbarEffects();

    // Add loading animation to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.opacity = '0';
        setTimeout(() => {
            heroSection.style.transition = 'opacity 2s ease-in-out';
            heroSection.style.opacity = '1';
        }, 100);
    }

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

// Handle window resize
window.addEventListener('resize', () => {
    if (window.matrixRain) {
        window.matrixRain.resize();
    }
    if (window.particleSystem) {
        window.particleSystem.canvas.width = window.innerWidth;
        window.particleSystem.canvas.height = window.innerHeight;
    }
});