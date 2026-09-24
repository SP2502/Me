/* =========================================================
   SHREYANSH PARGANIHA — PERSONAL WEBSITE
   Interaction & UI Logic
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       01. CONFIGURATION
    ===================================================== */

    const CLASS_CHANGE_DATE = new Date("2027-04-01T00:00:00");
    const DEFAULT_CLASS = 11;

    const SELECTORS = {
        menuToggle: ".menu-toggle",
        navLinks: ".nav-links a",
        navContainer: ".nav-links",
        sections: "main section[id]",
        revealTargets: [
            ".section-intro",
            ".thinking-description",
            ".learning-process li",
            ".about-block",
            ".question-item",
            ".project",
            ".technical-row",
            ".now-item",
            ".outside-item",
            ".contact-content"
        ],
        copyEmail: ".copy-email",
        currentClass: "[data-current-class]",
        currentYear: "[data-current-year]",
        currentDate: ".hero-current + *"
    };


    /* =====================================================
       02. UTILITY FUNCTIONS
    ===================================================== */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];


    /* =====================================================
       03. CURRENT CLASS
       Automatically changes:
       Class 11 → Class 12 on April 1, 2027
    ===================================================== */

    function getCurrentClass() {
        const now = new Date();

        return now >= CLASS_CHANGE_DATE
            ? 12
            : DEFAULT_CLASS;
    }

    function updateCurrentClass() {
        const currentClass = getCurrentClass();

        $$(SELECTORS.currentClass).forEach((element) => {
            element.textContent = currentClass;
        });
    }


    /* =====================================================
       04. CURRENT YEAR
    ===================================================== */

    function updateCurrentYear() {
        const year = new Date().getFullYear();

        $$(SELECTORS.currentYear).forEach((element) => {
            element.textContent = year;
        });
    }


    /* =====================================================
       05. CURRENT MONTH / YEAR LABEL
       Keeps "September 2026" dynamic.
    ===================================================== */

    function updateCurrentDateLabel() {
        const dateLabel = $(".now .eyebrow");

        if (!dateLabel) return;

        const now = new Date();

        const formatter = new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric"
        });

        dateLabel.textContent = formatter.format(now);
    }


    /* =====================================================
       06. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = $(SELECTORS.menuToggle);
    const navContainer = $(SELECTORS.navContainer);

    function openMenu() {
        document.body.classList.add("menu-open");

        menuToggle?.setAttribute("aria-expanded", "true");
        menuToggle?.setAttribute("aria-label", "Close navigation menu");
    }

    function closeMenu() {
        document.body.classList.remove("menu-open");

        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.setAttribute("aria-label", "Open navigation menu");
    }

    function toggleMenu() {
        const isOpen =
            document.body.classList.contains("menu-open");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle?.addEventListener("click", toggleMenu);


    /* Close menu after clicking a navigation link */

    $$(SELECTORS.navLinks).forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });


    /* Close menu with Escape */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });


    /* Close menu if viewport becomes desktop */

    window.addEventListener("resize", () => {
        if (window.innerWidth > 720) {
            closeMenu();
        }
    });


    /* =====================================================
       07. ACTIVE NAVIGATION
    ===================================================== */

    const navigationLinks = $$(SELECTORS.navLinks);
    const sections = $$(SELECTORS.sections);

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const id = entry.target.id;

                navigationLinks.forEach((link) => {
                    const target =
                        link.getAttribute("href");

                    const isActive =
                        target === `#${id}`;

                    link.classList.toggle(
                        "active",
                        isActive
                    );
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


    /* =====================================================
       08. SCROLL REVEAL
    ===================================================== */

    const revealSelector =
        SELECTORS.revealTargets.join(",");

    const revealElements = $$(revealSelector);

    revealElements.forEach((element, index) => {
        element.classList.add("js-reveal");

        /*
         * Small stagger without creating excessive animation.
         */
        const delay =
            Math.min(index % 5, 4) * 45;

        element.style.transitionDelay = `${delay}ms`;
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =====================================================
       09. COPY EMAIL
    ===================================================== */

    const copyButtons = $$(SELECTORS.copyEmail);

    copyButtons.forEach((button) => {

        button.addEventListener("click", async () => {

            const email =
                button.dataset.email;

            if (!email) return;

            const originalText =
                button.textContent;

            try {

                await navigator.clipboard.writeText(email);

                button.textContent = "Copied";
                button.classList.add("copied");

                window.setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove("copied");
                }, 1800);

            } catch (error) {

                /*
                 * Clipboard API may be unavailable
                 * in some browsers / contexts.
                 */

                const temporaryInput =
                    document.createElement("input");

                temporaryInput.value = email;

                document.body.appendChild(
                    temporaryInput
                );

                temporaryInput.select();

                try {
                    document.execCommand("copy");

                    button.textContent = "Copied";
                    button.classList.add("copied");

                    window.setTimeout(() => {
                        button.textContent = originalText;
                        button.classList.remove("copied");
                    }, 1800);

                } catch {
                    button.textContent = "Copy failed";

                    window.setTimeout(() => {
                        button.textContent = originalText;
                    }, 1800);
                }

                temporaryInput.remove();
            }
        });

    });


    /* =====================================================
       10. SMOOTH ANCHOR NAVIGATION
       ===================================================== */

    $$('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const header =
                $(".site-header");

            const headerHeight =
                header?.offsetHeight || 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                18;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            /*
             * Update URL without jumping.
             */
            history.replaceState(
                null,
                "",
                targetId
            );
        });

    });


    /* =====================================================
       11. HERO SYSTEM VISUAL
       Subtle movement based on pointer position.
       Disabled for touch / reduced-motion users.
    ===================================================== */

    const heroSystem = $(".hero-system");

    const supportsHover =
        window.matchMedia("(hover: hover)").matches;

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        heroSystem &&
        supportsHover &&
        !prefersReducedMotion
    ) {

        const nodes =
            $$(".system-node", heroSystem);

        let frame = null;

        heroSystem.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    heroSystem.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const moveX =
                    (x - 0.5) * 10;

                const moveY =
                    (y - 0.5) * 10;

                if (frame) {
                    cancelAnimationFrame(frame);
                }

                frame = requestAnimationFrame(() => {

                    nodes.forEach((node, index) => {

                        const strength =
                            (index + 1) * 0.35;

                        node.style.transform =
                            `translate(
                                ${moveX * strength}px,
                                ${moveY * strength}px
                            )`;
                    });

                });
            }
        );

        heroSystem.addEventListener(
            "pointerleave",
            () => {

                nodes.forEach((node) => {
                    node.style.transform = "";
                });

            }
        );
    }


    /* =====================================================
       12. PROJECT ARCHITECTURE HOVER
       Desktop-only micro interaction.
    ===================================================== */

    if (supportsHover && !prefersReducedMotion) {

        $$(".architecture-node").forEach((node) => {

            node.addEventListener(
                "mouseenter",
                () => {
                    node.setAttribute(
                        "data-hovered",
                        "true"
                    );
                }
            );

            node.addEventListener(
                "mouseleave",
                () => {
                    node.removeAttribute(
                        "data-hovered"
                    );
                }
            );

        });
    }


    /* =====================================================
       13. EXTERNAL LINK SAFETY
       Ensures target="_blank" links have
       rel="noopener noreferrer".
    ===================================================== */

    $$('a[target="_blank"]').forEach((link) => {

        const rel =
            link.getAttribute("rel") || "";

        const values =
            new Set(
                rel.split(/\s+/).filter(Boolean)
            );

        values.add("noopener");
        values.add("noreferrer");

        link.setAttribute(
            "rel",
            [...values].join(" ")
        );
    });


    /* =====================================================
       14. DYNAMIC CURRENT PROJECT YEAR
       ===================================================== */

    function updateYearReferences() {

        const year =
            new Date().getFullYear();

        $$("[data-current-year]").forEach(
            (element) => {
                element.textContent = year;
            }
        );
    }


    /* =====================================================
       15. HANDLE HASH ON INITIAL LOAD
       ===================================================== */

    function handleInitialHash() {

        const hash =
            window.location.hash;

        if (!hash) return;

        const target =
            document.querySelector(hash);

        if (!target) return;

        /*
         * Give the browser time to finish layout
         * before positioning.
         */
        window.requestAnimationFrame(() => {

            const header =
                $(".site-header");

            const offset =
                header?.offsetHeight || 0;

            window.scrollTo({
                top:
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset -
                    18,
                behavior: "instant"
            });

        });
    }


    /* =====================================================
       16. PAGE VISIBILITY
       Avoid unnecessary animation work when the
       browser tab is hidden.
    ===================================================== */

    let pageVisible =
        !document.hidden;

    document.addEventListener(
        "visibilitychange",
        () => {
            pageVisible = !document.hidden;
        }
    );


    /* =====================================================
       17. INITIALIZATION
    ===================================================== */

    updateCurrentClass();
    updateCurrentYear();
    updateYearReferences();
    updateCurrentDateLabel();

    /*
     * Run after the first layout frame so that
     * initial hash navigation doesn't fight
     * browser rendering.
     */
    window.requestAnimationFrame(() => {
        handleInitialHash();
    });


    /* =====================================================
       18. DEVELOPMENT CHECK
    ===================================================== */

    if (
        typeof window !== "undefined" &&
        window.location.hostname === "localhost"
    ) {
        console.info(
            "Shreyansh Parganiha — portfolio initialized."
        );
    }

});
