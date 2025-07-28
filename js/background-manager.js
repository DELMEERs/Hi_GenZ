import { CONFIG, CSS_CLASSES, SELECTORS } from './config.js';
import { Utils } from './utils.js';

/**
 * Manages background animations and interactions
 */
export class BackgroundManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.isTouch = Utils.isTouchDevice();
        this.lastInteraction = 0;
        this.animationId = null;
        
        // Throttled event handlers for performance
        this.throttledMouseMove = Utils.throttle(this.handleMouseMove.bind(this), CONFIG.ANIMATION_THROTTLE);
        this.throttledTouchMove = Utils.throttle(this.handleTouchMove.bind(this), CONFIG.ANIMATION_THROTTLE);
        
        this.start();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.backgroundContainer = document.querySelector(SELECTORS.BACKGROUND_CONTAINER);
        this.animatedBg = document.querySelector(SELECTORS.ANIMATED_BG);
        this.cursorLight = document.querySelector(SELECTORS.CURSOR_LIGHT);
        this.circles = document.querySelectorAll(SELECTORS.GRADIENT_CIRCLES);
    }

    /**
     * Setup event listeners for mouse and touch interactions
     */
    setupEventListeners() {
        // Mouse events for desktop
        document.addEventListener('mousemove', this.throttledMouseMove);
        document.addEventListener('mouseenter', () => {
            this.cursorLight.classList.add(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        });
        document.addEventListener('mouseleave', () => {
            this.cursorLight.classList.remove(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        });

        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.throttledTouchMove, { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Device orientation for mobile tilt effects
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
        }

        // Performance optimization
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    /**
     * Handle mouse movement
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        if (this.isTouch) return;

        this.targetMouse.x = e.clientX;
        this.targetMouse.y = e.clientY;
        this.lastInteraction = Date.now();

        this.updateCircleInteractions();
    }

    /**
     * Handle touch start
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        this.isTouch = true;
        const touch = e.touches[0];
        this.targetMouse.x = touch.clientX;
        this.targetMouse.y = touch.clientY;
        this.cursorLight.classList.add(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        this.lastInteraction = Date.now();
    }

    /**
     * Handle touch movement
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.targetMouse.x = touch.clientX;
        this.targetMouse.y = touch.clientY;
        this.lastInteraction = Date.now();

        this.updateCircleInteractions();
    }

    /**
     * Handle touch end
     */
    handleTouchEnd() {
        setTimeout(() => {
            this.cursorLight.classList.remove(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        }, 1000);
    }

    /**
     * Handle device orientation for mobile tilt effects
     * @param {DeviceOrientationEvent} e - Orientation event
     */
    handleDeviceOrientation(e) {
        const tiltX = e.gamma; // Left-right tilt
        const tiltY = e.beta;  // Forward-back tilt

        if (tiltX !== null && tiltY !== null) {
            // Apply subtle parallax effect based on device tilt
            const maxTilt = 0.5;
            const translateX = Utils.clamp(tiltX * maxTilt, -30, 30);
            const translateY = Utils.clamp(tiltY * maxTilt, -30, 30);
            
            this.animatedBg.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
    }

    /**
     * Handle visibility change for performance optimization
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Update cursor light position with smooth interpolation
     */
    updateCursorLight() {
        // Smooth interpolation for cursor movement
        this.mouse.x = Utils.lerp(this.mouse.x, this.targetMouse.x, 0.1);
        this.mouse.y = Utils.lerp(this.mouse.y, this.targetMouse.y, 0.1);

        this.cursorLight.style.left = this.mouse.x + 'px';
        this.cursorLight.style.top = this.mouse.y + 'px';
    }

    /**
     * Update circle interactions based on mouse position
     */
    updateCircleInteractions() {
        this.circles.forEach((circle) => {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distance = Utils.distance(this.mouse.x, this.mouse.y, centerX, centerY);
            const maxDistance = 300;
            const interactionStrength = Math.max(0, 1 - distance / maxDistance);

            // Remove existing interaction classes
            circle.classList.remove(CSS_CLASSES.CIRCLE_ATTRACTED, CSS_CLASSES.CIRCLE_REPELLED);

            if (interactionStrength > 0.3) {
                // Strong attraction effect
                circle.classList.add(CSS_CLASSES.CIRCLE_ATTRACTED);

                const pullStrength = interactionStrength * 20;
                const angle = Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX);
                const offsetX = Math.cos(angle) * pullStrength;
                const offsetY = Math.sin(angle) * pullStrength;

                // Apply additional transform while preserving existing transforms
                circle.style.transform += ` translate(${offsetX}px, ${offsetY}px)`;
            } else if (interactionStrength > 0.1) {
                // Weak repulsion effect
                circle.classList.add(CSS_CLASSES.CIRCLE_REPELLED);
            }
        });
    }

    /**
     * Create screen flash effect
     */
    createScreenFlash() {
        const flash = Utils.createElement('div', {
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(0,255,255,0.2) 50%, transparent 80%)',
                pointerEvents: 'none',
                zIndex: '9999',
                opacity: '1',
                transition: 'opacity 0.8s ease-out'
            }
        });

        document.body.appendChild(flash);

        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => {
                Utils.removeElement(flash);
            }, 800);
        }, 100);
    }

    /**
     * Create shockwave effect
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createShockwave(x, y) {
        const shockwave = Utils.createElement('div', {
            className: 'shockwave',
            style: {
                position: 'fixed',
                width: '100px',
                height: '100px',
                border: '3px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%) scale(0)',
                animation: 'shockwaveExpand 0.8s ease-out',
                pointerEvents: 'none',
                zIndex: '9998',
                left: x + 'px',
                top: y + 'px'
            }
        });

        document.body.appendChild(shockwave);

        setTimeout(() => {
            Utils.removeElement(shockwave);
        }, 800);
    }

    /**
     * Start the animation loop
     */
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }

    /**
     * Main animation loop
     */
    animate() {
        this.updateCursorLight();

        // Auto-hide cursor light after inactivity
        if (Date.now() - this.lastInteraction > CONFIG.INTERACTION_TIMEOUT && !this.isTouch) {
            this.cursorLight.classList.remove(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Pause animations for performance
     */
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Resume animations
     */
    resume() {
        if (!this.animationId) {
            this.start();
        }
    }

    /**
     * Get current mouse position
     * @returns {Object} Mouse position {x, y}
     */
    getMousePosition() {
        return { ...this.mouse };
    }

    /**
     * Set cursor light visibility
     * @param {boolean} visible - Whether cursor light should be visible
     */
    setCursorLightVisible(visible) {
        if (visible) {
            this.cursorLight.classList.add(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        } else {
            this.cursorLight.classList.remove(CSS_CLASSES.CURSOR_LIGHT_ACTIVE);
        }
    }

    /**
     * Reset all circle transformations
     */
    resetCircles() {
        this.circles.forEach(circle => {
            circle.classList.remove(CSS_CLASSES.CIRCLE_ATTRACTED, CSS_CLASSES.CIRCLE_REPELLED);
            circle.style.transform = '';
        });
    }

    /**
     * Cleanup and destroy the background manager
     */
    destroy() {
        this.pause();
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.throttledMouseMove);
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchmove', this.throttledTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('deviceorientation', this.handleDeviceOrientation);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        this.resetCircles();
    }
}
