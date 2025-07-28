// Main application entry point
import { PasswordGenerator } from './js/password-generator.js';
import { ParticleSystem } from './js/particle-system.js';
import { BackgroundManager } from './js/background-manager.js';
import { PasswordDisplay } from './js/password-display.js';
import { CONFIG, CSS_CLASSES, SELECTORS } from './js/config.js';
import { Utils } from './js/utils.js';

/**
 * Main application class that orchestrates all components
 */
class PasswordGenApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize core components
            this.initializeComponents();
            this.initializeState();
            this.setupEventListeners();
            this.setupCustomEvents();
            
            this.isInitialized = true;
            console.log('Hi GenZ Password Generator initialized successfully! 🚀');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Initialize password generator
        this.passwordGenerator = new PasswordGenerator();
        
        // Initialize particle system
        const particleCanvas = document.querySelector(SELECTORS.PARTICLE_CANVAS);
        this.particleSystem = new ParticleSystem(particleCanvas);
        
        // Initialize background manager
        this.backgroundManager = new BackgroundManager();
        
        // Initialize password display
        this.passwordDisplay = new PasswordDisplay();

        // Get DOM elements
        this.elements = {
            genzButton: document.querySelector(SELECTORS.GENZ_BUTTON),
            copyButton: document.querySelector(SELECTORS.COPY_BUTTON),
            complexityButtons: {
                chill: document.querySelector(SELECTORS.COMPLEXITY_BUTTONS.chill),
                lit: document.querySelector(SELECTORS.COMPLEXITY_BUTTONS.lit),
                fire: document.querySelector(SELECTORS.COMPLEXITY_BUTTONS.fire)
            }
        };
    }

    /**
     * Initialize application state
     */
    initializeState() {
        this.isGenerating = false;
        this.currentComplexity = 'chill';
        this.generatedPassword = '';
        
        // Set initial complexity
        this.setComplexity('chill');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Generate button
        this.elements.genzButton.addEventListener('click', this.handleGenerateClick.bind(this));
        
        // Copy button
        this.elements.copyButton.addEventListener('click', this.handleCopyClick.bind(this));
        
        // Complexity buttons
        Object.entries(this.elements.complexityButtons).forEach(([complexity, button]) => {
            button.addEventListener('click', () => this.setComplexity(complexity));
        });

        // Global click effects (excluding buttons)
        document.addEventListener('click', this.handleGlobalClick.bind(this));

        // Mouse/touch events for particle trails
        document.addEventListener('mousemove', 
            Utils.throttle(this.handleMouseMove.bind(this), CONFIG.ANIMATION_THROTTLE)
        );
        document.addEventListener('touchmove', 
            Utils.throttle(this.handleTouchMove.bind(this), CONFIG.ANIMATION_THROTTLE),
            { passive: false }
        );

        // Disable context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
    }

    /**
     * Setup custom events for component communication
     */
    setupCustomEvents() {
        // Listen for character burst events from password display
        document.addEventListener('characterBurst', this.handleCharacterBurst.bind(this));
    }

    /**
     * Handle generate button click
     * @param {Event} e - Click event
     */
    async handleGenerateClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isGenerating) return;

        this.isGenerating = true;
        this.elements.genzButton.disabled = true;
        this.elements.copyButton.classList.add(CSS_CLASSES.COPY_HIDDEN);

        try {
            // Visual effects
            await this.createButtonEffects(e);
            
            // Generate password
            this.generatedPassword = this.passwordGenerator.generate();
            console.log(`Generated ${this.currentComplexity} password:`, this.generatedPassword);
            
            // Animate password display
            await this.passwordDisplay.startGenerationSequence(this.generatedPassword);
            
            // Show copy button after animation
            setTimeout(() => {
                this.elements.copyButton.classList.remove(CSS_CLASSES.COPY_HIDDEN);
            }, 500);

        } catch (error) {
            console.error('Password generation failed:', error);
        } finally {
            this.isGenerating = false;
            this.elements.genzButton.disabled = false;
        }
    }

    /**
     * Create visual effects for button click
     * @param {Event} e - Click event
     */
    async createButtonEffects(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Button click animation
        button.classList.add(CSS_CLASSES.BUTTON_CLICKED);
        setTimeout(() => {
            button.classList.remove(CSS_CLASSES.BUTTON_CLICKED);
        }, 1200);

        // Create visual effects
        this.createRipple(e, button);
        this.backgroundManager.createShockwave(centerX, centerY);
        this.particleSystem.createSparkles(centerX, centerY);
        this.particleSystem.createExplosion(centerX, centerY);
        this.backgroundManager.createScreenFlash();
    }

    /**
     * Create ripple effect on button
     * @param {Event} e - Click event
     * @param {HTMLElement} button - Button element
     */
    createRipple(e, button) {
        const rippleContainer = button.querySelector(SELECTORS.RIPPLE_CONTAINER);
        const rect = button.getBoundingClientRect();
        
        const ripple = Utils.createElement('div', {
            className: 'ripple',
            style: {
                left: (e.clientX - rect.left) + 'px',
                top: (e.clientY - rect.top) + 'px',
                width: '10px',
                height: '10px',
                marginLeft: '-5px',
                marginTop: '-5px'
            }
        });

        rippleContainer.appendChild(ripple);

        setTimeout(() => {
            Utils.removeElement(ripple);
        }, 800);
    }

    /**
     * Handle copy button click
     * @param {Event} e - Click event
     */
    async handleCopyClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.generatedPassword) return;

        // Visual feedback
        this.elements.copyButton.classList.add(CSS_CLASSES.COPY_COPYING);

        try {
            const success = await Utils.copyToClipboard(this.generatedPassword);
            
            if (success) {
                console.log('Password copied successfully!');
                this.showCopyFeedback('Copied!');
            } else {
                this.showCopyFeedback('Copy failed');
            }

        } catch (error) {
            console.error('Copy failed:', error);
            this.showCopyFeedback('Copy failed');
        }
    }

    /**
     * Show copy feedback message
     * @param {string} message - Message to show
     */
    showCopyFeedback(message) {
        const copyText = this.elements.copyButton.querySelector(SELECTORS.COPY_TEXT);
        const originalText = copyText.textContent;
        
        copyText.textContent = message;

        setTimeout(() => {
            copyText.textContent = originalText;
            this.elements.copyButton.classList.remove(CSS_CLASSES.COPY_COPYING);
        }, 2000);
    }

    /**
     * Set password complexity level
     * @param {string} complexity - Complexity level
     */
    setComplexity(complexity) {
        this.currentComplexity = complexity;
        this.passwordGenerator.setComplexity(complexity);

        // Update button states
        Object.entries(this.elements.complexityButtons).forEach(([key, button]) => {
            if (key === complexity) {
                button.classList.add(CSS_CLASSES.COMPLEXITY_ACTIVE);
            } else {
                button.classList.remove(CSS_CLASSES.COMPLEXITY_ACTIVE);
            }
        });

        console.log(`Complexity set to: ${complexity}`);
    }

    /**
     * Handle global clicks for particle effects
     * @param {Event} e - Click event
     */
    handleGlobalClick(e) {
        // Only create effects for non-button clicks
        if (!e.target.closest('button') && !e.target.closest('a')) {
            this.particleSystem.createClickEffect(e.clientX, e.clientY);
        }
    }

    /**
     * Handle mouse movement for particle trails
     * @param {Event} e - Mouse event
     */
    handleMouseMove(e) {
        this.particleSystem.createTrailParticles(e.clientX, e.clientY);
    }

    /**
     * Handle touch movement for particle trails
     * @param {Event} e - Touch event
     */
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.particleSystem.createTrailParticles(touch.clientX, touch.clientY);
        }
    }

    /**
     * Handle character burst events from password display
     * @param {CustomEvent} e - Character burst event
     */
    handleCharacterBurst(e) {
        const { charIndex, totalChars, container } = e.detail;
        this.particleSystem.createCharacterBurst(charIndex, totalChars, container);
    }

    /**
     * Get application status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            generating: this.isGenerating,
            complexity: this.currentComplexity,
            hasPassword: !!this.generatedPassword,
            particleCount: this.particleSystem.getParticleCount()
        };
    }

    /**
     * Reset application to initial state
     */
    reset() {
        this.generatedPassword = '';
        this.passwordDisplay.reset();
        this.elements.copyButton.classList.add(CSS_CLASSES.COPY_HIDDEN);
        this.particleSystem.clear();
        this.setComplexity('chill');
    }

    /**
     * Destroy the application and clean up resources
     */
    destroy() {
        if (this.particleSystem) {
            this.particleSystem.stop();
        }
        
        if (this.backgroundManager) {
            this.backgroundManager.destroy();
        }
        
        if (this.passwordDisplay) {
            this.passwordDisplay.destroy();
        }

        // Remove event listeners
        document.removeEventListener('click', this.handleGlobalClick);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('characterBurst', this.handleCharacterBurst);
        document.removeEventListener('contextmenu', e => e.preventDefault());

        console.log('Application destroyed');
    }
}

// Initialize the application when the page loads
const app = new PasswordGenApp();

// Make app globally available for debugging
window.PasswordGenApp = app;
