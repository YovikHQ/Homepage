// ================================
// YOVIK
// ================================

// Fade elements into view

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});

document.querySelectorAll("section, .feature-card, details").forEach((el) => {

    el.classList.add("hidden");

    observer.observe(el);

});

// Hero floating effect

const hero = document.querySelector(".hero-content");

window.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;

    hero.style.transform = `translate(${x}px, ${y}px)`;

});