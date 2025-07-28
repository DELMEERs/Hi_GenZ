import { CONFIG, CSS_CLASSES, SELECTORS } from './config.js';
import { Utils } from './utils.js';

/**
 * Manages password display animations and effects
 */
export class PasswordDisplay {
    constructor() {
        this.initializeElements();
        this.currentPassword = '';
        this.isAnimating = false;
        this.dnaAnimationId = null;
        this.quantumParticles = [];
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.passwordDisplay = document.querySelector(SELECTORS.PASSWORD_DISPLAY);
        this.generationOverlay = document.querySelector(SELECTORS.GENERATION_OVERLAY);
        this.dnaCanvas = document.querySelector(SELECTORS.DNA_CANVAS);
        this.quantumContainer = document.querySelector(SELECTORS.QUANTUM_PARTICLES);
        this.dnaCtx = this.dnaCanvas.getContext('2d');
        
        this.setupDNACanvas();
    }

    /**
     * Setup DNA canvas dimensions
     */
    setupDNACanvas() {
        const resizeDNACanvas = () => {
            const container = this.passwordDisplay.parentElement;
            this.dnaCanvas.width = container.offsetWidth;
            this.dnaCanvas.height = container.offsetHeight;
        };

        resizeDNACanvas();
        window.addEventListener('resize', Utils.debounce(resizeDNACanvas, 250));
    }

    /**
     * Start the complete password generation animation sequence
     * @param {string} newPassword - The password to display
     * @returns {Promise} Promise that resolves when animation completes
     */
    async startGenerationSequence(newPassword) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.currentPassword = newPassword;

        try {
            // Phase 1: Preparation
            await this.showPreparationState();

            // Phase 2: Enable sci-fi overlay
            this.enableOverlay();
            await this.showGeneratingState();

            // Phase 3: Quantum particle effects
            this.createQuantumParticles();

            // Phase 4: DNA animation
            await this.playDNAAnimation();

            // Phase 5: Typewriter reveal with glitch effects
            await this.showRevealingState();
            await this.typewriterWithGlitch(newPassword);

            // Phase 6: Complete state
            await this.showCompleteState();

            // Phase 7: Cleanup
            await Utils.wait(3000);
            this.cleanupEffects();

        } finally {
            this.isAnimating = false;
        }
    }

    /**
     * Show preparation state
     */
    async showPreparationState() {
        this.passwordDisplay.classList.add(CSS_CLASSES.PASSWORD_PREPARING);
        await Utils.wait(800);
    }

    /**
     * Show generating state
     */
    async showGeneratingState() {
        this.passwordDisplay.classList.remove(CSS_CLASSES.PASSWORD_PREPARING);
        this.passwordDisplay.classList.add(CSS_CLASSES.PASSWORD_GENERATING);
    }

    /**
     * Show revealing state
     */
    async showRevealingState() {
        this.passwordDisplay.classList.remove(CSS_CLASSES.PASSWORD_GENERATING);
        this.passwordDisplay.classList.add(CSS_CLASSES.PASSWORD_REVEALING);
    }

    /**
     * Show complete state
     */
    async showCompleteState() {
        this.passwordDisplay.classList.remove(CSS_CLASSES.PASSWORD_REVEALING);
        this.passwordDisplay.classList.add(CSS_CLASSES.PASSWORD_COMPLETE);
    }

    /**
     * Enable the generation overlay
     */
    enableOverlay() {
        this.generationOverlay.classList.add(CSS_CLASSES.OVERLAY_ACTIVE);
    }

    /**
     * Disable the generation overlay
     */
    disableOverlay() {
        this.generationOverlay.classList.remove(CSS_CLASSES.OVERLAY_ACTIVE);
    }

    /**
     * Create quantum particle effects
     */
    createQuantumParticles() {
        this.quantumContainer.innerHTML = '';
        this.quantumParticles = [];

        for (let i = 0; i < 20; i++) {
            const particle = Utils.createElement('div', {
                className: 'quantum-particle',
                style: {
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 3 + 's',
                    animationDuration: (Math.random() * 2 + 2) + 's'
                }
            });

            this.quantumContainer.appendChild(particle);
            this.quantumParticles.push(particle);
        }
    }

    /**
     * Clean up quantum particles
     */
    cleanupQuantumParticles() {
        this.quantumParticles.forEach(particle => {
            Utils.removeElement(particle);
        });
        this.quantumParticles = [];
    }

    /**
     * Play DNA helix animation
     * @returns {Promise} Promise that resolves when animation completes
     */
    playDNAAnimation() {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / CONFIG.DNA_ANIMATION_DURATION;

                // Clear canvas
                this.dnaCtx.clearRect(0, 0, this.dnaCanvas.width, this.dnaCanvas.height);

                this.renderDNAHelix(progress);

                if (progress < 1) {
                    this.dnaAnimationId = requestAnimationFrame(animate);
                } else {
                    if (this.dnaAnimationId) {
                        cancelAnimationFrame(this.dnaAnimationId);
                        this.dnaAnimationId = null;
                    }
                    resolve();
                }
            };

            animate();
        });
    }

    /**
     * Render the DNA helix visualization
     * @param {number} progress - Animation progress (0-1)
     */
    renderDNAHelix(progress) {
        const centerX = this.dnaCanvas.width / 2;
        const centerY = this.dnaCanvas.height / 2;
        const radius = 40;
        const helixHeight = 80;
        const rotationSpeed = progress * 8 * Math.PI;

        // Draw DNA strands
        for (let strand = 0; strand < 2; strand++) {
            const color = strand === 0 ? 
                `rgba(0, 255, 255, ${0.8 * (1 - progress * 0.3)})` : 
                `rgba(255, 0, 255, ${0.8 * (1 - progress * 0.3)})`;

            this.dnaCtx.strokeStyle = color;
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

        // Draw base pairs (connecting lines)
        this.dnaCtx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - progress * 0.5)})`;
        this.dnaCtx.lineWidth = 2;

        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const angle1 = rotationSpeed + t * 4 * Math.PI;
            const angle2 = rotationSpeed + t * 4 * Math.PI + Math.PI;

            const x1 = centerX + Math.cos(angle1) * radius;
            const y1 = centerY + (t - 0.5) * helixHeight;
            const x2 = centerX + Math.cos(angle2) * radius;
            const y2 = centerY + (t - 0.5) * helixHeight;

            this.dnaCtx.beginPath();
            this.dnaCtx.moveTo(x1, y1);
            this.dnaCtx.lineTo(x2, y2);
            this.dnaCtx.stroke();
        }
    }

    /**
     * Typewriter effect with glitch animations
     * @param {string} password - Password to type out
     * @returns {Promise} Promise that resolves when typing completes
     */
    async typewriterWithGlitch(password) {
        const chars = password.split('');
        let currentText = '';

        for (let i = 0; i < chars.length; i++) {
            // Glitch effect before each character
            await this.showGlitchEffect(currentText, chars.length - i - 1);

            // Reveal actual character
            currentText += chars[i];
            this.passwordDisplay.textContent = currentText + '_'.repeat(chars.length - i - 1);

            // Emit character burst event for particle system
            this.emitCharacterBurst(i, chars.length);

            await Utils.wait(CONFIG.TYPEWRITER_CHAR_DELAY);
        }

        // Final clean display
        this.passwordDisplay.textContent = password;
    }

    /**
     * Show glitch effect for a character position
     * @param {string} currentText - Text revealed so far
     * @param {number} remainingChars - Number of characters remaining
     */
    async showGlitchEffect(currentText, remainingChars) {
        for (let glitch = 0; glitch < 3; glitch++) {
            const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
            this.passwordDisplay.textContent = currentText + randomChar + '_'.repeat(remainingChars);
            await Utils.wait(CONFIG.GLITCH_DURATION);
        }
    }

    /**
     * Emit character burst event for particle system
     * @param {number} charIndex - Index of the character
     * @param {number} totalChars - Total number of characters
     */
    emitCharacterBurst(charIndex, totalChars) {
        // Dispatch custom event for particle system to handle
        const event = new CustomEvent('characterBurst', {
            detail: { charIndex, totalChars, container: this.passwordDisplay }
        });
        document.dispatchEvent(event);
    }

    /**
     * Clean up all effects and reset state
     */
    cleanupEffects() {
        this.disableOverlay();
        this.cleanupQuantumParticles();
        
        // Remove all state classes
        this.passwordDisplay.classList.remove(
            CSS_CLASSES.PASSWORD_PREPARING,
            CSS_CLASSES.PASSWORD_GENERATING,
            CSS_CLASSES.PASSWORD_REVEALING,
            CSS_CLASSES.PASSWORD_COMPLETE
        );

        // Cancel any running DNA animation
        if (this.dnaAnimationId) {
            cancelAnimationFrame(this.dnaAnimationId);
            this.dnaAnimationId = null;
        }

        // Clear DNA canvas
        this.dnaCtx.clearRect(0, 0, this.dnaCanvas.width, this.dnaCanvas.height);
    }

    /**
     * Set password text directly without animation
     * @param {string} password - Password to display
     */
    setPassword(password) {
        this.currentPassword = password;
        this.passwordDisplay.textContent = password;
    }

    /**
     * Get current password
     * @returns {string} Current password
     */
    getPassword() {
        return this.currentPassword;
    }

    /**
     * Check if animation is currently running
     * @returns {boolean} True if animating
     */
    isCurrentlyAnimating() {
        return this.isAnimating;
    }

    /**
     * Reset display to initial state
     */
    reset() {
        this.cleanupEffects();
        this.passwordDisplay.textContent = '0000-0000-0000-0000';
        this.currentPassword = '';
    }

    /**
     * Destroy the password display manager
     */
    destroy() {
        this.cleanupEffects();
        
        if (this.dnaAnimationId) {
            cancelAnimationFrame(this.dnaAnimationId);
        }
    }
}
