type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    emoji: '🐂' | '🐄';
    size: number;
    rotation: number;
    rotationSpeed: number;
    createdAt: number;
    life: number;
};

export const createFireworks = (canvas: HTMLCanvasElement): (() => void) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const particles: Particle[] = [];

    const BURST_INTERVAL = 600;
    const PARTICLES_PER_BURST = 15;
    const GRAVITY = 220;

    let frameId = 0;
    let stopped = false;
    let lastFrame = 0;
    let lastBurst = -Infinity;

    let width = 0;
    let height = 0;
    let pixelRatio = 0;

    const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        if (rect.width === width && rect.height === height && dpr === pixelRatio) return;

        width = rect.width;
        height = rect.height;
        pixelRatio = dpr;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createBurst = (x: number, y: number, now: number) => {
        for (let i = 0; i < PARTICLES_PER_BURST; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 110 + 70;

            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                emoji: Math.random() < 0.5 ? '🐂' : '🐄',
                size: Math.random() * 12 + 18,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 5,
                createdAt: now,
                life: Math.random() * 600 + 1200,
            });
        }
    };

    const launchFireworks = (now: number) => {
        createBurst(width * (Math.random() * 0.2 + 0.1), height * Math.random() * 0.5, now);

        createBurst(width * (Math.random() * 0.2 + 0.7), height * Math.random() * 0.5, now);
    };

    const animate = (now: number) => {
        if (stopped) return;

        resizeCanvas();

        const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.05) : 0;

        lastFrame = now;

        if (width > 0 && height > 0 && now - lastBurst >= BURST_INTERVAL) {
            launchFireworks(now);
            lastBurst = now;
        }

        ctx.clearRect(0, 0, width, height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            if (!particle) continue;

            const age = now - particle.createdAt;

            if (age >= particle.life) {
                particles.splice(i, 1);
                continue;
            }

            // Update position
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.vy += GRAVITY * delta;

            // Update rotation
            particle.rotation += particle.rotationSpeed * delta;

            // Draw particle
            ctx.save();

            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);

            ctx.globalAlpha = Math.min(1, (particle.life - age) / 400);

            ctx.font = `${particle.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(particle.emoji, 0, 0);

            ctx.restore();
        }

        frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
        stopped = true;
        cancelAnimationFrame(frameId);
        particles.length = 0;
        ctx.clearRect(0, 0, width, height);
    };
};
