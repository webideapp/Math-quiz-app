/**
 * Math Quiz - Core Logic
 * Refactored for iPhone-style Multiple Choice UI
 * Focuses on premium interactions and realistic math generation
 */

class MathQuizGame {
    constructor() {
        this.problemElement = document.getElementById('problem');
        this.optionsContainer = document.getElementById('options-grid');
        this.statusMsg = document.getElementById('status-message');
        this.progressBar = document.getElementById('progress-inner');
        this.progressText = document.querySelector('.progress-text');
        this.quizLabel = document.querySelector('.quiz-category-label');
        
        this.currentAnswer = 0;
        this.questionCount = 1;
        this.maxQuestions = 10;
        this.isLocked = false;
        
        this.init();
    }

    init() {
        this.generateProblem();
        this.initSmoothScroll();
    }

    generateProblem() {
        const operations = [
            { name: 'Addition', symbol: '+', fn: (a, b) => a + b, range: 20 },
            { name: 'Multiplication', symbol: '×', fn: (a, b) => a * b, range: 12 }
        ];
        
        const op = operations[Math.floor(Math.random() * operations.length)];
        this.quizLabel.textContent = op.name;
        
        const a = Math.floor(Math.random() * op.range) + 2;
        const b = Math.floor(Math.random() * op.range) + 2;

        this.currentAnswer = op.fn(a, b);
        this.problemElement.textContent = `${a} ${op.symbol} ${b}`;

        this.renderOptions();
        this.updateProgress();
    }

    renderOptions() {
        this.optionsContainer.innerHTML = '';
        const options = this.generateDistractors(this.currentAnswer);
        
        // Fisher-Yates shuffle
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn micro-interaction';
            btn.innerHTML = `<span class="option-text">${opt}</span>`;
            btn.addEventListener('click', () => this.handleSelection(btn, opt));
            this.optionsContainer.appendChild(btn);
        });
    }

    generateDistractors(correct) {
        const distractors = new Set([correct]);
        while (distractors.size < 4) {
            // Generate realistic mistakes (off by 1, off by 10, or small variation)
            const strategy = Math.floor(Math.random() * 3);
            let val;
            
            if (strategy === 0) val = correct + (Math.random() > 0.5 ? 1 : -1);
            else if (strategy === 1) val = correct + (Math.random() > 0.5 ? 10 : -10);
            else val = correct + Math.floor(Math.random() * 7) - 3;

            if (val > 0 && val !== correct) distractors.add(val);
        }
        return Array.from(distractors);
    }

    handleSelection(button, selectedValue) {
        if (this.isLocked) return;
        this.isLocked = true;

        if (selectedValue === this.currentAnswer) {
            button.classList.add('correct');
            this.showFeedback('Excellent!', 'var(--color-emerald)');
            
            // Premium success haptic-like scaling
            button.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                button.style.transform = '';
                this.nextQuestion();
            }, 800);
        } else {
            button.classList.add('wrong');
            this.showFeedback('Try Again', 'var(--color-crimson)');
            button.classList.add('shake');
            
            // Briefly highlight the correct answer
            const buttons = this.optionsContainer.querySelectorAll('.option-btn');
            buttons.forEach(b => {
                if (parseInt(b.textContent) === this.currentAnswer) {
                    b.classList.add('hint');
                }
            });

            setTimeout(() => {
                button.classList.remove('shake');
                button.classList.remove('wrong');
                buttons.forEach(b => b.classList.remove('hint'));
                this.isLocked = false;
                this.statusMsg.style.opacity = '0';
            }, 1000);
        }
    }

    nextQuestion() {
        this.questionCount = (this.questionCount % this.maxQuestions) + 1;
        this.generateProblem();
        this.isLocked = false;
        this.statusMsg.style.opacity = '0';
    }

    updateProgress() {
        const percentage = (this.questionCount / this.maxQuestions) * 100;
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${this.questionCount}/${this.maxQuestions}`;
    }

    showFeedback(text, color) {
        this.statusMsg.textContent = text;
        this.statusMsg.style.color = color;
        this.statusMsg.style.opacity = '1';
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new MathQuizGame();
});