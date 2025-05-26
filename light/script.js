class LightPasswordGen {
    constructor() {
        this.currentComplexity = 'chill';
        this.generatedPassword = '';
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.complexityButtons = {
            chill: document.getElementById('chillBtn'),
            lit: document.getElementById('litBtn'),
            fire: document.getElementById('fireBtn')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateBtn.addEventListener('click', this.handleGenerate.bind(this));
        this.copyBtn.addEventListener('click', this.handleCopy.bind(this));

        Object.entries(this.complexityButtons).forEach(([complexity, button]) => {
            button.addEventListener('click', () => this.setComplexity(complexity));
        });
    }

    setComplexity(complexity) {
        this.currentComplexity = complexity;

        Object.entries(this.complexityButtons).forEach(([key, button]) => {
            if (key === complexity) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

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

    generateLitPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const length = 12;
        let password = '';

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*';

        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += symbols[Math.floor(Math.random() * symbols.length)];

        for (let i = 4; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    generateFirePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}+=<>?~`|:;,.^-_';
        const length = 19;
        let password = '';

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()[]{}+=<>?~`|:;,.^-_';

        for (let i = 0; i < 3; i++) {
            password += uppercase[Math.floor(Math.random() * uppercase.length)];
            password += lowercase[Math.floor(Math.random() * lowercase.length)];
            password += numbers[Math.floor(Math.random() * numbers.length)];
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }

        while (password.length < length) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

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
        return password;
    }

    async handleGenerate() {
        if (this.isGenerating) return;

        this.isGenerating = true;
        this.generateBtn.disabled = true;
        this.copyBtn.classList.add('hidden');

        this.passwordDisplay.classList.add('generating');
        this.passwordDisplay.textContent = 'Generating...';

        await this.wait(1000);

        const newPassword = this.generatePassword();

        this.passwordDisplay.classList.remove('generating');
        this.passwordDisplay.classList.add('complete');
        this.passwordDisplay.textContent = newPassword;

        setTimeout(() => {
            this.copyBtn.classList.remove('hidden');
        }, 300);

        setTimeout(() => {
            this.passwordDisplay.classList.remove('complete');
        }, 2000);

        this.isGenerating = false;
        this.generateBtn.disabled = false;
    }

    async handleCopy() {
        if (!this.generatedPassword) return;

        this.copyBtn.classList.add('copying');

        try {
            await navigator.clipboard.writeText(this.generatedPassword);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = this.generatedPassword;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = 'Copied!';

        setTimeout(() => {
            this.copyBtn.textContent = originalText;
            this.copyBtn.classList.remove('copying');
        }, 1500);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LightPasswordGen();
});