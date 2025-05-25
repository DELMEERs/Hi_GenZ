// Password generator - I also wrote this at 2am 😭

class PasswordGenUI {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupParticles();
        this.setupButtonAnimation();
        this.setupPasswordGeneration();
        this.setupComplexitySelection();
        this.setupCopyButton();
        this.isTouch = false;
        this.lastInteraction = 0;
        this.animationId = null;
        this.isGenerating = false;
        this.currentComplexity = 'chill'; // start with easy mode
        this.generatedPassword = '';

        // throttle events cuz performance
        this.throttledMouseMove = this.throttle(this.handleMouseMove.bind(this), 16);
        this.throttledTouchMove = this.throttle(this.handleTouchMove.bind(this), 16);
    }

    init() {
        // grab DOM elements
        this.backgroundContainer = document.getElementById('backgroundContainer');
        this.animatedBg = document.getElementById('animatedBg');
        this.cursorLight = document.getElementById('cursorLight');
        this.circles = document.querySelectorAll('.gradient-circle');
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.genzButton = document.getElementById('genzButton');
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.generationOverlay = document.getElementById('generationOverlay');
        this.dnaCanvas = document.getElementById('dnaCanvas');
        this.dnaCtx = this.dnaCanvas.getContext('2d');
        this.copyButton = document.getElementById('copyButton');
        this.complexityButtons = {
            chill: document.getElementById('chillBtn'),
            lit: document.getElementById('litBtn'),
            fire: document.getElementById('fireBtn')
        };

        this.setupCanvas();
        this.setupDNACanvas();
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.dnaAnimationId = null;
        this.quantumParticles = [];
    }

    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    setupDNACanvas() {
        const resizeDNACanvas = () => {
            const container = this.passwordDisplay.parentElement;
            this.dnaCanvas.width = container.offsetWidth;
            this.dnaCanvas.height = container.offsetHeight;
        };

        resizeDNACanvas();
        window.addEventListener('resize', resizeDNACanvas);
    }

    setupEventListeners() {
        // mouse stuff for desktop
        document.addEventListener('mousemove', this.throttledMouseMove);
        document.addEventListener('mouseenter', () => {
            this.cursorLight.classList.add('active');
        });
        document.addEventListener('mouseleave', () => {
            this.cursorLight.classList.remove('active');
        });

        // touch events for mobile (annoying but necessary)
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.throttledTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // click effects but not on buttons
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.genz-button') && !e.target.closest('.complexity-btn') && !e.target.closest('.copy-button')) {
                this.handleClick(e);
            }
        });

        // mobile orientation stuff
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
        }

        // performance monitoring
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    setupButtonAnimation() {
        this.genzButton.addEventListener('click', this.handleButtonClick.bind(this));
    }

    setupComplexitySelection() {
        Object.entries(this.complexityButtons).forEach(([complexity, button]) => {
            button.addEventListener('click', () => this.setComplexity(complexity));
        });
    }

    setupCopyButton() {
        this.copyButton.addEventListener('click', this.handleCopyClick.bind(this));
    }

    setComplexity(complexity) {
        this.currentComplexity = complexity;

        // update button states
        Object.entries(this.complexityButtons).forEach(([key, button]) => {
            if (key === complexity) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        console.log(`Mode switched to: ${complexity}`);
    }

    setupPasswordGeneration() {
        // nothing here, generation happens on button click
    }

    // easy passwords - good for most stuff
    generateChillPassword() {
        const words = ['Cat', 'Dog', 'Sun', 'Moon', 'Star', 'Blue', 'Red', 'Cool', 'Nice', 'Fun'];
        const numbers = '123456789';
        const symbols = '!@#';

        const word1 = words[Math.floor(Math.random() * words.length)];
        const word2 = words[Math.floor(Math.random() * words.length)];
        const num1 = numbers[Math.floor(Math.random() * numbers.length)];
        const num2 = numbers[Math.floor(Math.random() * numbers.length)];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];

        return `${word1}${word2}${num1}${num2}${symbol}`;
    }

    // medium strength passwords
    generateLitPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const length = 12;
        let password = '';

        // make sure we have one of each type
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';

        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        // fill the rest randomly
        for (let i = 4; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        // shuffle it
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    // max security passwords - for important stuff
    generateFirePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}+=<>?~`|:;,.^-_';
        const length = 19;
        let password = '';

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()[]{}+=<>?~`|:;,.^-_';

        // add multiple of each type
        for (let i = 0; i < 3; i++) {
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
            password += lowercase[Math.floor(Math.random() * lowercase.length)];
            password += numbers[Math.floor(Math.random() * numbers.length)];
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }

        // fill to target length
        while (password.length < length) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        // shuffle multiple times for extra randomness
        for (let i = 0; i < 5; i++) {
            password = password.split('').sort(() => Math.random() - 0.5).join('');
        }

        return password;
    }

    generatePassword() {
        let password = '';

        switch (this.currentComplexity) {
            case 'chill':
                password = this.generateChillPassword();
                break;
            case 'lit':
                password = this.generateLitPassword();
                break;
            case 'fire':
                password = this.generateFirePassword();
                break;
            default:
                password = this.generateLitPassword();
        }

        this.generatedPassword = password;
        console.log(`Generated ${this.currentComplexity} password:`, password);
        return password;
    }

    async startPasswordGeneration() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.genzButton.disabled = true;
        this.copyButton.classList.add('hidden');

        // phase 1: prep
        this.passwordDisplay.classList.add('preparing');
        await this.wait(800);

        // phase 2: sci-fi mode engage
        this.generationOverlay.classList.add('active');
        this.passwordDisplay.classList.remove('preparing');
        this.passwordDisplay.classList.add('generating');

        // phase 3: particles!
        this.createQuantumParticles();

        // phase 4: DNA animation
        await this.playDNAAnimation();

        // phase 5: actually generate the password
        const newPassword = this.generatePassword();

        // phase 6: reveal mode
        this.passwordDisplay.classList.remove('generating');
        this.passwordDisplay.classList.add('revealing');

        // phase 7: typewriter with glitch effects
        await this.typewriterWithGlitch(newPassword);

        // phase 8: final reveal
        this.passwordDisplay.classList.remove('revealing');
        this.passwordDisplay.classList.add('complete');

        // phase 9: show copy button
        setTimeout(() => {
            this.copyButton.classList.remove('hidden');
        }, 500);

        // phase 10: cleanup
        this.generationOverlay.classList.remove('active');
        await this.wait(3000);

        this.passwordDisplay.classList.remove('complete');
        this.cleanupQuantumParticles();
        this.isGenerating = false;
        this.genzButton.disabled = false;
    }

    async handleCopyClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.generatedPassword) return;

        // epic pulse animation
        this.copyButton.classList.add('copying');

        try {
            await navigator.clipboard.writeText(this.generatedPassword);
            console.log('Password copied successfully!');

            // success feedback
            const originalText = this.copyButton.querySelector('.copy-text').textContent;
            this.copyButton.querySelector('.copy-text').textContent = 'Copied!';

            setTimeout(() => {
                this.copyButton.querySelector('.copy-text').textContent = originalText;
                this.copyButton.classList.remove('copying');
            }, 2000);

        } catch (err) {
            console.error('Copy failed:', err);

            // fallback for old browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.generatedPassword;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            // show success anyway
            const originalText = this.copyButton.querySelector('.copy-text').textContent;
            this.copyButton.querySelector('.copy-text').textContent = 'Copied! ✨';

            setTimeout(() => {
                this.copyButton.querySelector('.copy-text').textContent = originalText;
                this.copyButton.classList.remove('copying');
            }, 2000);
        }
    }

    createQuantumParticles() {
        const particleContainer = document.querySelector('.quantum-particles');
        particleContainer.innerHTML = '';

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';

            particleContainer.appendChild(particle);
            this.quantumParticles.push(particle);
        }
    }

    cleanupQuantumParticles() {
        this.quantumParticles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.quantumParticles = [];
    }

    playDNAAnimation() {
        return new Promise((resolve) => {
            const duration = 3000;
            const startTime = Date.now();

            const animateDNA = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;

                // clear canvas
                this.dnaCtx.clearRect(0, 0, this.dnaCanvas.width, this.dnaCanvas.height);

                // DNA helix stuff
                const centerX = this.dnaCanvas.width / 2;
                const centerY = this.dnaCanvas.height / 2;
                const radius = 40;
                const helixHeight = 80;
                const rotationSpeed = progress * 8 * Math.PI;

                // draw DNA strands
                for (let strand = 0; strand < 2; strand++) {
                    this.dnaCtx.strokeStyle = strand === 0 ?
                        `rgba(0, 255, 255, ${0.8 * (1 - progress * 0.3)})` :
                        `rgba(255, 0, 255, ${0.8 * (1 - progress * 0.3)})`;
                    this.dnaCtx.lineWidth = 3;
                    this.dnaCtx.beginPath();

                    for (let i = 0; i <= 50; i++) {
                        const t = i / 50;
                        const angle = rotationSpeed + t * 4 * Math.PI + strand * Math.PI;
                        const x = centerX + Math.cos(angle) * radius;
                        const y = centerY + (t - 0.5) * helixHeight;

                        if (i === 0) {
                            this.dnaCtx.moveTo(x, y);
                        } else {
                            this.dnaCtx.lineTo(x, y);
                        }
                    }
                    this.dnaCtx.stroke();
                }

                // draw base pairs (connecting lines)
                for (let i = 0; i <= 20; i++) {
                    const t = i / 20;
                    const angle1 = rotationSpeed + t * 4 * Math.PI;
                    const angle2 = rotationSpeed + t * 4 * Math.PI + Math.PI;

                    const x1 = centerX + Math.cos(angle1) * radius;
                    const y1 = centerY + (t - 0.5) * helixHeight;
                    const x2 = centerX + Math.cos(angle2) * radius;
                    const y2 = centerY + (t - 0.5) * helixHeight;

                    this.dnaCtx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - progress * 0.5)})`;
                    this.dnaCtx.lineWidth = 2;
                    this.dnaCtx.beginPath();
                    this.dnaCtx.moveTo(x1, y1);
                    this.dnaCtx.lineTo(x2, y2);
                    this.dnaCtx.stroke();
                }

                if (progress < 1) {
                    this.dnaAnimationId = requestAnimationFrame(animateDNA);
                } else {
                    if (this.dnaAnimationId) {
                        cancelAnimationFrame(this.dnaAnimationId);
                    }
                    resolve();
                }
            };

            animateDNA();
        });
    }

    async typewriterWithGlitch(newPassword) {
        const chars = newPassword.split('');
        let currentText = '';

        for (let i = 0; i < chars.length; i++) {
            // glitch effect before each character
            for (let glitch = 0; glitch < 3; glitch++) {
                const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                this.passwordDisplay.textContent = currentText + randomChar + '_'.repeat(chars.length - i - 1);
                await this.wait(50);
            }

            // reveal actual character
            currentText += chars[i];
            this.passwordDisplay.textContent = currentText + '_'.repeat(chars.length - i - 1);

            // particle burst for each character
            this.createCharacterBurst(i, chars.length);

            await this.wait(150);
        }

        // clean final display
        this.passwordDisplay.textContent = newPassword;
    }

    createCharacterBurst(charIndex, totalChars) {
        const rect = this.passwordDisplay.getBoundingClientRect();
        const charWidth = rect.width / totalChars;
        const x = rect.left + (charIndex * charWidth) + (charWidth / 2);
        const y = rect.top + rect.height / 2;

        // mini explosion for each character
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const speed = Math.random() * 2 + 1;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.03,
                size: Math.random() * 2 + 1,
                brightness: 2,
                color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`
            });
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // main animation
        button.classList.add('clicked');

        // create all the effects
        this.createRipple(e, button);
        this.createShockwave(centerX, centerY);
        this.createSparkles(centerX, centerY);
        this.createButtonExplosion(centerX, centerY);

        // remove animation class
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 1200);

        // screen flash
        this.createScreenFlash();

        // start generation
        this.startPasswordGeneration();

        console.log('Password generation started!');
    }

    createRipple(e, button) {
        const rippleContainer = button.querySelector('.ripple-container');
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.marginLeft = '-5px';
        ripple.style.marginTop = '-5px';

        rippleContainer.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 800);
    }

    createShockwave(x, y) {
        const shockwave = document.createElement('div');
        shockwave.className = 'shockwave';
        shockwave.style.left = x + 'px';
        shockwave.style.top = y + 'px';

        document.body.appendChild(shockwave);

        setTimeout(() => {
            shockwave.remove();
        }, 800);
    }

    createSparkles(centerX, centerY) {
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';

            const angle = (i / 15) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 1500);
        }
    }

    createButtonExplosion(x, y) {
        // multiple waves of particles
        for (let wave = 0; wave < 4; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 30; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 10 + 5;
                    const size = Math.random() * 8 + 2;

                    this.particles.push({
                        x: x,
                        y: y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1,
                        decay: 0.008 + Math.random() * 0.012,
                        size: size,
                        brightness: 2 + Math.random(),
                        color: 'white'
                    });
                }
            }, wave * 150);
        }
    }

    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(0,255,255,0.2) 50%, transparent 80%);
            pointer-events: none;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.8s ease-out;
        `;

        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                flash.remove();
            }, 800);
        }, 100);
    }

    handleMouseMove(e) {
        if (this.isTouch) return;

        this.targetMouse.x = e.clientX;
        this.targetMouse.y = e.clientY;
        this.lastInteraction = Date.now();

        this.updateCursorLight();
        this.updateCircleInteractions();
        this.createParticleTrail(e.clientX, e.clientY);
    }

    handleTouchStart(e) {
        this.isTouch = true;
        const touch = e.touches[0];
        this.targetMouse.x = touch.clientX;
        this.targetMouse.y = touch.clientY;
        this.cursorLight.classList.add('active');
        this.lastInteraction = Date.now();
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.targetMouse.x = touch.clientX;
        this.targetMouse.y = touch.clientY;
        this.lastInteraction = Date.now();

        this.updateCursorLight();
        this.updateCircleInteractions();
        this.createParticleTrail(touch.clientX, touch.clientY);
    }

    handleTouchEnd() {
        setTimeout(() => {
            this.cursorLight.classList.remove('active');
        }, 1000);
    }

    handleClick(e) {
        this.createClickEffect(e.clientX, e.clientY);
    }

    handleDeviceOrientation(e) {
        const tiltX = e.gamma;
        const tiltY = e.beta;

        if (tiltX !== null && tiltY !== null) {
            this.animatedBg.style.transform = `translate(${tiltX * 0.5}px, ${tiltY * 0.5}px)`;
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    updateCursorLight() {
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

        this.cursorLight.style.left = this.mouse.x + 'px';
        this.cursorLight.style.top = this.mouse.y + 'px';
    }

    updateCircleInteractions() {
        this.circles.forEach((circle, index) => {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(this.mouse.x - centerX, 2) +
                Math.pow(this.mouse.y - centerY, 2)
            );

            const maxDistance = 300;
            const interactionStrength = Math.max(0, 1 - distance / maxDistance);

            circle.classList.remove('attracted', 'repelled');

            if (interactionStrength > 0.3) {
                circle.classList.add('attracted');

                const pullStrength = interactionStrength * 20;
                const angle = Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX);
                const offsetX = Math.cos(angle) * pullStrength;
                const offsetY = Math.sin(angle) * pullStrength;

                circle.style.transform += ` translate(${offsetX}px, ${offsetY}px)`;
            } else if (interactionStrength > 0.1) {
                circle.classList.add('repelled');
            }
        });
    }

    setupParticles() {
        this.animate();
    }

    createParticleTrail(x, y) {
        if (this.particles.length > 80) return;

        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                size: Math.random() * 3 + 1,
                brightness: 1,
                color: 'white'
            });
        }
    }

    createClickEffect(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.015,
                size: Math.random() * 5 + 2,
                brightness: 1.5,
                color: 'white'
            });
        }
    }

    updateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.shadowBlur = 20 * (particle.brightness || 1);
            this.ctx.shadowColor = particle.color || 'white';
            this.ctx.fillStyle = particle.color || 'white';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    animate() {
        this.updateParticles();
        this.updateCursorLight();

        if (Date.now() - this.lastInteraction > 3000 && !this.isTouch) {
            this.cursorLight.classList.remove('active');
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    pauseAnimations() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.dnaAnimationId) {
            cancelAnimationFrame(this.dnaAnimationId);
        }
    }

    resumeAnimations() {
        this.animate();
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// start everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenUI();
});

// disable right click menu on mobile
document.addEventListener('contextmenu', e => e.preventDefault());