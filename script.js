/* =========================================================
   SHREYANSH — PERSONAL WEBSITE
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. MOBILE NAVIGATION
    ===================================================== */

    const menuButton = document.querySelector(".mobile-menu-button");
    const navLinks = document.querySelector(".nav-links");

    if (menuButton && navLinks) {
        menuButton.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            });
        });

        // Close menu when clicking outside it
        document.addEventListener("click", (event) => {
            const clickedInsideNav =
                navLinks.contains(event.target) ||
                menuButton.contains(event.target);

            if (!clickedInsideNav) {
                navLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
            }
        });
    }


    /* =====================================================
       02. HEADER SCROLL STATE
    ===================================================== */

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeader = () => {
            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );
    }


    /* =====================================================
       03. SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".project-card, " +
        ".now-item, " +
        ".lab-card, " +
        ".timeline-item, " +
        ".architecture-node, " +
        ".flow-step, " +
        ".argus-card, " +
        ".philosophy-card"
    );

    // Don't force animations if the user prefers reduced motion.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!reducedMotion && "IntersectionObserver" in window) {

        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("revealed");

                    observer.unobserve(entry.target);
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });

    }


    /* =====================================================
       04. ACTIVE NAVIGATION
    ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        ".nav-links a"
    );

    if (
        sections.length > 0 &&
        navigationLinks.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId = entry.target.id;

                    navigationLinks.forEach((link) => {
                        link.classList.remove("active");

                        const target = link.getAttribute("href");

                        if (target === `#${currentId}`) {
                            link.classList.add("active");
                        }
                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       05. SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });

            // Update browser URL without jumping.
            history.pushState(null, "", targetId);

        });

    });


    /* =====================================================
       06. EXTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll('a[href^="http"]')
        .forEach((link) => {

            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener noreferrer");

        });


    /* =====================================================
       07. PROJECT CARD KEYBOARD ACCESSIBILITY
    ===================================================== */

    document
        .querySelectorAll(".project-card")
        .forEach((card) => {

            const projectLink = card.querySelector(".project-link");

            if (!projectLink) {
                return;
            }

            card.addEventListener("click", (event) => {

                // Don't interfere with clicking an actual link.
                if (event.target.closest("a")) {
                    return;
                }

                projectLink.click();

            });

            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "link");

            card.addEventListener("keydown", (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();
                    projectLink.click();

                }

            });

        });


    /* =====================================================
       08. CURRENT YEAR
       Automatically creates a year if a footer element
       with data-current-year exists.
    ===================================================== */

    const yearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    yearElements.forEach((element) => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       09. PAGE LOADED
    ===================================================== */

    document.documentElement.classList.add("js-ready");

});
