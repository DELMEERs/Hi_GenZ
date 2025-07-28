/**
 * Configuration and constants for the password generator
 */
export const CONFIG = {
    // Animation timing
    ANIMATION_THROTTLE: 16,
    DNA_ANIMATION_DURATION: 3000,
    TYPEWRITER_CHAR_DELAY: 150,
    GLITCH_DURATION: 50,
    INTERACTION_TIMEOUT: 3000,
    
    // Particle system
    MAX_PARTICLES: 80,
    PARTICLE_DECAY_BASE: 0.02,
    PARTICLE_DECAY_VARIATION: 0.02,
    
    // Password generation
    PASSWORD_LENGTHS: {
        chill: { min: 8, max: 12 },
        lit: { min: 12, max: 16 },
        fire: { min: 16, max: 20 }
    },
    
    // Character sets for password generation
    CHAR_SETS: {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        basicSymbols: '!@#$%^&*',
        extendedSymbols: '!@#$%^&*()[]{}+=<>?~`|:;,.^-_',
        chillWords: ['Cat', 'Dog', 'Sun', 'Moon', 'Star', 'Blue', 'Red', 'Cool', 'Nice', 'Fun', 'Sky', 'Sea'],
        basicNumbers: '123456789'
    }
};

/**
 * CSS class names used throughout the application
 */
export const CSS_CLASSES = {
    // Background elements
    CURSOR_LIGHT_ACTIVE: 'active',
    CIRCLE_ATTRACTED: 'attracted',
    CIRCLE_REPELLED: 'repelled',
    
    // Password display states
    PASSWORD_PREPARING: 'preparing',
    PASSWORD_GENERATING: 'generating',
    PASSWORD_REVEALING: 'revealing',
    PASSWORD_COMPLETE: 'complete',
    
    // Button states
    COMPLEXITY_ACTIVE: 'active',
    BUTTON_CLICKED: 'clicked',
    COPY_HIDDEN: 'hidden',
    COPY_COPYING: 'copying',
    
    // Overlay states
    OVERLAY_ACTIVE: 'active'
};

/**
 * DOM element selectors
 */
export const SELECTORS = {
    // Background elements
    BACKGROUND_CONTAINER: '#backgroundContainer',
    ANIMATED_BG: '#animatedBg',
    CURSOR_LIGHT: '#cursorLight',
    GRADIENT_CIRCLES: '.gradient-circle',
    PARTICLE_CANVAS: '#particleCanvas',
    
    // Main content
    PASSWORD_DISPLAY: '#passwordDisplay',
    GENERATION_OVERLAY: '#generationOverlay',
    DNA_CANVAS: '#dnaCanvas',
    QUANTUM_PARTICLES: '.quantum-particles',
    
    // Buttons
    GENZ_BUTTON: '#genzButton',
    COPY_BUTTON: '#copyButton',
    COMPLEXITY_BUTTONS: {
        chill: '#chillBtn',
        lit: '#litBtn',
        fire: '#fireBtn'
    },
    
    // Button sub-elements
    BUTTON_TEXT: '.button-text',
    COPY_TEXT: '.copy-text',
    RIPPLE_CONTAINER: '.ripple-container'
};
