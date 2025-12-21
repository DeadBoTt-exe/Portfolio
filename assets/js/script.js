// --- Neural Background Logic ---
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 100;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 180) {
                ctx.lineWidth = 1 - dist / 180;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(draw);
}

window.addEventListener('resize', init);
init();
draw();

// --- Modal Logic ---
function toggleModal() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
        modal.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('resumeModal');
    if (event.target == modal) toggleModal();
}

// --- Project Card Logic ---
function flipCard(container) {
    // Check if this card is meant for redirecting to GitHub
    // If it is, we DON'T want it to flip.
    if (container.classList.contains('redirect-card')) {
        return;
    }

    const inner = container.querySelector('.project-card-inner');
    if (inner) {
        inner.classList.toggle('is-flipped');
    }
}

// --- Typing Animation Logic ---
const quoteText = "Turning data into intelligent, real-world solutions.";
const typingTarget = document.getElementById("typing-quote");
let typingIndex = 0;

function typeEffect() {
    if (typingTarget && typingIndex < quoteText.length) {
        typingTarget.textContent += quoteText.charAt(typingIndex);
        typingIndex++;
        setTimeout(typeEffect, 50);
    }
}

// Trigger animation after 1 second delay
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 1000);
});