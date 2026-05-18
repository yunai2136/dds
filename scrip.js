document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const slots = [
        document.getElementById('slot-1'),
        document.getElementById('slot-2'),
        document.getElementById('slot-3'),
        document.getElementById('slot-4'),
        document.getElementById('slot-5')
    ];
    const confettiContainer = document.getElementById('confetti-container');

    const TOTAL_NUMBERS = 30;
    const SELECT_COUNT = 5;

    let isDrawing = false;

    function getRandomNumbers(count, max) {
        const numbers = new Set();
        while (numbers.size < count) {
            const randomNum = Math.floor(Math.random() * max) + 1;
            numbers.add(randomNum);
        }
        return Array.from(numbers);
    }

    function createConfetti() {
        const colors = ['#8b5cf6', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5; // 5px to 15px
            const left = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 2 + 2; // 2s to 4s
            const delay = Math.random() * 0.5;
            
            // Apply styles
            particle.style.backgroundColor = color;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `-20px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Randomly make some particles squares or rectangles
            if (Math.random() > 0.5) {
                particle.style.borderRadius = '0';
                if (Math.random() > 0.5) {
                    particle.style.height = `${size * 2}px`;
                }
            }
            
            confettiContainer.appendChild(particle);
            
            // Remove particle after animation ends
            setTimeout(() => {
                particle.remove();
            }, (duration + delay) * 1000);
        }
    }

    async function startDraw() {
        if (isDrawing) return;
        isDrawing = true;
        drawBtn.disabled = true;
        drawBtn.textContent = '추첨 중...';

        // Reset slots
        slots.forEach(slot => {
            slot.textContent = '?';
            slot.classList.remove('active');
        });

        // Get final numbers
        const finalNumbers = getRandomNumbers(SELECT_COUNT, TOTAL_NUMBERS);
        
        // Rolling animation for each slot
        for (let i = 0; i < SELECT_COUNT; i++) {
            await animateSlot(slots[i], finalNumbers[i], i);
        }

        // Finish drawing
        isDrawing = false;
        drawBtn.disabled = false;
        drawBtn.textContent = '다시 추첨하기';
        
        // Celebrate
        createConfetti();
    }

    function animateSlot(slot, finalNumber, index) {
        return new Promise(resolve => {
            let iterations = 0;
            const maxIterations = 20 + (index * 10); // Each subsequent slot spins longer
            const interval = 50; // ms per spin

            const spinInterval = setInterval(() => {
                slot.textContent = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
                iterations++;

                if (iterations >= maxIterations) {
                    clearInterval(spinInterval);
                    slot.textContent = finalNumber;
                    slot.classList.add('active');
                    
                    // Small delay before next slot starts showing its final number
                    setTimeout(resolve, 300);
                }
            }, interval);
        });
    }

    drawBtn.addEventListener('click', startDraw);
});
