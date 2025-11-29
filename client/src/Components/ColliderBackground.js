import { useRef, useEffect } from "react";

export default function ColliderBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // full screen canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const numParticles = 50;

        // particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.radius = 2 + Math.random() * 2;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#4f46e5";
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // bounce on edge
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                    this.vx *= -1;
                }
                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                    this.vy *= -1;
                }

                this.draw();
            }
        }

        // init particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let p of particles) p.update();

            requestAnimationFrame(animate);
        }

        animate();

    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -1,
                background: "var(--cl--white-pure)",
            }}
        />
    );
}
