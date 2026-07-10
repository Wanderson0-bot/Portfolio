"use strict";

const sectionMap = {
    "Início": ".hero",
    "Sobre": "#about-me",
    "Habilidades": ".skills-section",
    "Projetos": ".projects",
    "Serviços": ".skills-section",
    "Contato": ".contact"
};

const progressValues = [96, 94, 88, 84, 92, 90, 86, 89, 91];

function scrollToSection(selector) {
    const section = document.querySelector(selector);

    if (!section) {
        return;
    }

    const headerOffset = 110;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });
}

function abrirProjetos() {
    scrollToSection(".projects");
}

function setupNavigation() {
    const links = document.querySelectorAll(".navbar__link, .hero__actions .btn__link");

    links.forEach((link) => {
        const label = link.textContent.trim();
        const target = sectionMap[label];

        if (!target) {
            return;
        }

        link.addEventListener("click", (event) => {
            event.preventDefault();
            scrollToSection(target);
        });
    });
}

function setupActiveMenu() {
    const navLinks = document.querySelectorAll(".navbar__link");
    const activeLabels = new Map([
        [document.querySelector(".hero"), "Início"],
        [document.querySelector("#about-me"), "Sobre"],
        [document.querySelector(".skills-section"), "Habilidades"],
        [document.querySelector(".projects"), "Projetos"],
        [document.querySelector(".contact"), "Contato"]
    ]);

    const observedSections = [...activeLabels.keys()].filter(Boolean);

    const setActiveLink = (activeLabel) => {
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.textContent.trim() === activeLabel);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            setActiveLink(activeLabels.get(entry.target));
        });
    }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    });

    observedSections.forEach((section) => observer.observe(section));
}

function setupHeaderState() {
    const header = document.querySelector(".header");

    if (!header) {
        return;
    }

    const updateHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupProgressBars() {
    const bars = document.querySelectorAll(".skill-progress__bar");

    bars.forEach((bar, index) => {
        const progress = `${progressValues[index] || 88}%`;
        const label = bar.previousElementSibling;

        bar.style.setProperty("--progress", "0%");
        bar.dataset.progress = progress;

        if (label) {
            label.dataset.progress = progress;
        }
    });
}

function animateProgressBars() {
    const bars = document.querySelectorAll(".skill-progress__bar");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const bar = entry.target;
            bar.style.setProperty("--progress", bar.dataset.progress);
            observer.unobserve(bar);
        });
    }, {
        threshold: 0.45
    });

    bars.forEach((bar) => observer.observe(bar));
}

function setupRevealAnimations() {
    const animatedElements = document.querySelectorAll(
        ".hero__content, .hero__visual, .skills-card, .project-card, .contact__container"
    );

    animatedElements.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(24px)";
        element.style.transition = "opacity 600ms ease, transform 600ms ease";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15
    });

    animatedElements.forEach((element) => observer.observe(element));
}

function setupProjectCards() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
        card.tabIndex = 0;

        card.addEventListener("keydown", (event) => {
            if (event.target.closest("button, a")) {
                return;
            }

            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            card.classList.toggle("is-selected");
        });
    });
}

function setupProjectDescriptions() {
    const descriptions = document.querySelectorAll(".project-card__description");

    descriptions.forEach((description) => {
        const text = description.textContent.trim();

        if (!text) {
            description.hidden = true;
            return;
        }

        const button = document.createElement("button");
        button.className = "project-card__read-more";
        button.type = "button";
        button.textContent = "Ler mais";
        button.setAttribute("aria-expanded", "false");

        description.insertAdjacentElement("afterend", button);

        const isOverflowing = description.scrollHeight > description.clientHeight + 1;

        if (!isOverflowing) {
            button.hidden = true;
            return;
        }

        button.addEventListener("click", () => {
            const isExpanded = description.classList.toggle("is-expanded");

            button.textContent = isExpanded ? "Mostrar menos" : "Ler mais";
            button.setAttribute("aria-expanded", String(isExpanded));
        });
    });
}

function injectInteractionStyles() {
    const style = document.createElement("style");

    style.textContent = `
        .header.is-scrolled .navbar {
            background: rgba(17, 18, 23, 0.88);
            border-color: rgba(168, 85, 247, 0.22);
        }

        .navbar__link.is-active {
            color: #ffffff;
        }

        .navbar__link.is-active::after {
            transform: scaleX(1);
            transform-origin: left;
        }

        .project-card.is-selected {
            border-color: rgba(168, 85, 247, 0.58);
            box-shadow: 0 26px 70px rgba(0, 0, 0, 0.34), 0 0 58px rgba(168, 85, 247, 0.18);
        }
    `;

    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
    injectInteractionStyles();
    setupNavigation();
    setupActiveMenu();
    setupHeaderState();
    setupProgressBars();
    animateProgressBars();
    setupRevealAnimations();
    setupProjectCards();
    setupProjectDescriptions();
});
