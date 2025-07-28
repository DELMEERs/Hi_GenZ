import { CONFIG } from './config.js';
import { Utils } from './utils.js';

/**
 * Manages particle effects and animations
 */
export class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.setupCanvas();
        this.start();
    }

    /**
     * Setup canvas dimensions and event listeners
     */
    setupCanvas() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', Utils.debounce(resizeCanvas, 250));
    }

    /**
     * Start the particle animation loop
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    /**
     * Stop the particle animation loop
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Create particles for mouse/touch trail
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createTrailParticles(x, y) {
        if (this.particles.length > CONFIG.MAX_PARTICLES) return;

        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1,
                decay: CONFIG.PARTICLE_DECAY_BASE + Math.random() * CONFIG.PARTICLE_DECAY_VARIATION,
                size: Math.random() * 3 + 1,
                brightness: 1,
                color: 'white'
            });
        }
    }

    /**
     * Create click effect particles
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
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

    /**
     * Create explosion effect for button clicks
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createExplosion(x, y) {
        // Multiple waves of particles for dramatic effect
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

    /**
     * Create character burst effect for password typing
     * @param {number} charIndex - Index of the character
     * @param {number} totalChars - Total number of characters
     * @param {HTMLElement} container - Container element for positioning
     */
    createCharacterBurst(charIndex, totalChars, container) {
        const rect = container.getBoundingClientRect();
        const charWidth = rect.width / totalChars;
        const x = rect.left + (charIndex * charWidth) + (charWidth / 2);
        const y = rect.top + rect.height / 2;

        // Mini explosion for each character
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
                color: Utils.randomHSL(180, 240) // Cyan to blue range
            });
        }
    }

    /**
     * Update all particles
     */
    updateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update particle physics
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.99; // Air resistance
            particle.vy *= 0.99;

            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Render particle
            this.renderParticle(particle);
        }
    }

    /**
     * Render a single particle
     * @param {Object} particle - Particle to render
     */
    renderParticle(particle) {
        this.ctx.save();
        
        // Set opacity based on life
        this.ctx.globalAlpha = particle.life;
        
        // Add glow effect
        const glowSize = 20 * (particle.brightness || 1);
        this.ctx.shadowBlur = glowSize;
        this.ctx.shadowColor = particle.color || 'white';
        
        // Set fill color
        this.ctx.fillStyle = particle.color || 'white';
        
        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(
            particle.x, 
            particle.y, 
            particle.size * particle.life, 
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
        
        this.ctx.restore();
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.updateParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Get particle count
     * @returns {number} Current number of particles
     */
    getParticleCount() {
        return this.particles.length;
    }

    /**
     * Add custom particle
     * @param {Object} particleConfig - Particle configuration
     */
    addParticle(particleConfig) {
        const defaultConfig = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 1,
            decay: 0.02,
            size: 2,
            brightness: 1,
            color: 'white'
        };

        this.particles.push({ ...defaultConfig, ...particleConfig });
    }

    /**
     * Create sparkle effect
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    createSparkles(centerX, centerY) {
        for (let i = 0; i < 15; i++) {
            const sparkle = Utils.createElement('div', {
                className: 'sparkle',
                style: {
                    position: 'fixed',
                    width: '8px',
                    height: '8px',
                    background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: '9997',
                    animation: 'sparkleFloat 1.5s ease-out forwards'
                }
            });

            const angle = (i / 15) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                Utils.removeElement(sparkle);
            }, 1500);
        }
    }
}
