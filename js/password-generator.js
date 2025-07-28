import { CONFIG } from './config.js';
import { Utils } from './utils.js';

/**
 * Manages password generation with different complexity levels
 */
export class PasswordGenerator {
    constructor() {
        this.complexity = 'chill';
    }

    /**
     * Set the password complexity level
     * @param {string} complexity - Complexity level ('chill', 'lit', 'fire')
     */
    setComplexity(complexity) {
        if (['chill', 'lit', 'fire'].includes(complexity)) {
            this.complexity = complexity;
        }
    }

    /**
     * Generate a password based on current complexity
     * @returns {string} Generated password
     */
    generate() {
        switch (this.complexity) {
            case 'chill':
                return this._generateChillPassword();
            case 'lit':
                return this._generateLitPassword();
            case 'fire':
                return this._generateFirePassword();
            default:
                return this._generateLitPassword();
        }
    }

    /**
     * Generate a simple, memorable password
     * @private
     * @returns {string} Chill complexity password
     */
    _generateChillPassword() {
        const { chillWords, basicNumbers, basicSymbols } = CONFIG.CHAR_SETS;
        
        // Use memorable words with simple additions
        const word1 = Utils.randomElement(chillWords);
        const word2 = Utils.randomElement(chillWords);
        const num1 = Utils.randomElement(basicNumbers);
        const num2 = Utils.randomElement(basicNumbers);
        const symbol = Utils.randomElement(basicSymbols);

        // Simple concatenation for memorability
        return `${word1}${word2}${num1}${num2}${symbol}`;
    }

    /**
     * Generate a medium strength password
     * @private
     * @returns {string} Lit complexity password
     */
    _generateLitPassword() {
        const { uppercase, lowercase, numbers, basicSymbols } = CONFIG.CHAR_SETS;
        const targetLength = Utils.randomInt(12, 16);
        
        // Ensure at least one character from each type
        let password = '';
        password += Utils.randomElement(uppercase);
        password += Utils.randomElement(lowercase);
        password += Utils.randomElement(numbers);
        password += Utils.randomElement(basicSymbols);

        // Fill remaining length with random characters
        const allChars = uppercase + lowercase + numbers + basicSymbols;
        for (let i = password.length; i < targetLength; i++) {
            password += Utils.randomElement(allChars);
        }

        // Shuffle the password for better distribution
        return Utils.shuffleArray(password.split('')).join('');
    }

    /**
     * Generate a high-security password
     * @private
     * @returns {string} Fire complexity password
     */
    _generateFirePassword() {
        const { uppercase, lowercase, numbers, extendedSymbols } = CONFIG.CHAR_SETS;
        const targetLength = Utils.randomInt(16, 20);
        
        let password = '';
        
        // Ensure multiple characters from each type for added security
        for (let i = 0; i < 3; i++) {
            password += Utils.randomElement(uppercase);
            password += Utils.randomElement(lowercase);
            password += Utils.randomElement(numbers);
            password += Utils.randomElement(extendedSymbols);
        }

        // Fill to target length
        const allChars = uppercase + lowercase + numbers + extendedSymbols;
        while (password.length < targetLength) {
            password += Utils.randomElement(allChars);
        }

        // Multiple shuffles for maximum randomness
        let shuffledPassword = password;
        for (let i = 0; i < 5; i++) {
            shuffledPassword = Utils.shuffleArray(shuffledPassword.split('')).join('');
        }

        return shuffledPassword;
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with score and feedback
     */
    validateStrength(password) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*()[\]{}+=<>?~`|:;,.^-_]/.test(password),
            noRepeating: !/(.)\1{2,}/.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        
        let strength = 'Weak';
        if (score >= 5) strength = 'Strong';
        else if (score >= 3) strength = 'Medium';

        return {
            score,
            strength,
            checks,
            feedback: this._getStrengthFeedback(checks)
        };
    }

    /**
     * Get feedback for password strength
     * @private
     * @param {Object} checks - Password validation checks
     * @returns {Array} Array of feedback messages
     */
    _getStrengthFeedback(checks) {
        const feedback = [];
        
        if (!checks.length) feedback.push('Use at least 8 characters');
        if (!checks.uppercase) feedback.push('Add uppercase letters');
        if (!checks.lowercase) feedback.push('Add lowercase letters');
        if (!checks.numbers) feedback.push('Add numbers');
        if (!checks.symbols) feedback.push('Add symbols');
        if (!checks.noRepeating) feedback.push('Avoid repeating characters');

        return feedback;
    }

    /**
     * Generate multiple password options
     * @param {number} count - Number of passwords to generate
     * @returns {Array} Array of generated passwords
     */
    generateMultiple(count = 5) {
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generate());
        }
        return passwords;
    }

    /**
     * Get complexity information
     * @param {string} complexity - Complexity level
     * @returns {Object} Information about the complexity level
     */
    static getComplexityInfo(complexity) {
        const info = {
            chill: {
                name: 'Chill',
                description: 'Easy to remember, good for most sites',
                icon: '😎',
                color: 'rgba(0, 255, 0, 0.6)'
            },
            lit: {
                name: 'Lit',
                description: 'Balanced security and usability',
                icon: '🔥',
                color: 'rgba(255, 165, 0, 0.6)'
            },
            fire: {
                name: 'Fire',
                description: 'Maximum security for important accounts',
                icon: '🚀',
                color: 'rgba(255, 0, 0, 0.6)'
            }
        };

        return info[complexity] || info.lit;
    }
}
