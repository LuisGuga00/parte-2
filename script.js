const revealItems = document.querySelectorAll(".reveal");
const backgroundCanvas = document.getElementById("bg");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (backgroundCanvas) {
  const context = backgroundCanvas.getContext("2d");
  const pointer = { x: null, y: null };
  let particles = [];

  function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * backgroundCanvas.width;
      this.y = Math.random() * backgroundCanvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (pointer.x !== null && pointer.y !== null) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 110) {
          this.x += dx / 35;
          this.y += dy / 35;
        }
      }

      if (this.x < 0 || this.x > backgroundCanvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > backgroundCanvas.height) this.speedY *= -1;
    }

    draw() {
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fillStyle = "rgba(255,255,255,0.9)";
      context.shadowBlur = 18;
      context.shadowColor = "rgba(255, 59, 59, 0.45)";
      context.fill();
      context.shadowBlur = 0;
    }
  }

  function createParticles() {
    const total = window.innerWidth < 780 ? 70 : 120;
    particles = Array.from({ length: total }, () => new Particle());
  }

  function drawConnections() {
    for (let index = 0; index < particles.length; index += 1) {
      for (let next = index + 1; next < particles.length; next += 1) {
        const dx = particles[index].x - particles[next].x;
        const dy = particles[index].y - particles[next].y;
        const distance = Math.hypot(dx, dy);

        if (distance > 120) continue;

        context.beginPath();
        context.moveTo(particles[index].x, particles[index].y);
        context.lineTo(particles[next].x, particles[next].y);
        context.strokeStyle = `rgba(255, 59, 59, ${0.14 - distance / 1100})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  function animate() {
    context.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  window.addEventListener("mouseleave", () => {
    pointer.x = null;
    pointer.y = null;
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  animate();
}

const hoverTiltElements = document.querySelectorAll(".hover-tilt");

hoverTiltElements.forEach((element) => {
  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateY = ((offsetX / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - (offsetY / rect.height)) * 10;

    element.style.setProperty("--mx", `${(offsetX / rect.width) * 100}%`);
    element.style.setProperty("--my", `${(offsetY / rect.height) * 100}%`);
    element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
    element.style.removeProperty("--mx");
    element.style.removeProperty("--my");
  });
});
