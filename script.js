// =========================
// Fade In On Scroll
// =========================

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll("section, .card, details").forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
});


// =========================
// Hero Mouse Movement
// =========================

const hero = document.querySelector(".hero");

hero.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 10;

    hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;

});


// =========================
// FAQ Animation
// =========================

document.querySelectorAll("details").forEach((detail) => {

    detail.addEventListener("toggle", () => {

        if (detail.open) {

            document.querySelectorAll("details").forEach((other) => {

                if (other !== detail) {

                    other.open = false;

                }

            });

        }

    });

});


// =========================
// Button Ripple Effect
// =========================

document.querySelectorAll(".hero-button").forEach((button) => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        const rect = this.getBoundingClientRect();

        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        ripple.className = "ripple";

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

    });

});