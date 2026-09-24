/* =========================================================
   SHREYANSH PARGANIHA — SITE INTERACTIONS
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const header = document.getElementById("site-header");

    const menuButton =
        document.querySelector(".mobile-menu-toggle");

    const mobileNavigation =
        document.getElementById("mobile-navigation");

    const currentYear =
        document.getElementById("current-year");

    const navigationLinks =
        document.querySelectorAll(
            '.desktop-nav a[href^="#"]'
        );

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    /* =====================================================
       CURRENT YEAR
    ====================================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       HEADER SCROLL STATE
    ====================================================== */

    const updateHeader = () => {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       MOBILE NAVIGATION
    ====================================================== */

    const openMenu = () => {

        if (!menuButton || !mobileNavigation) {
            return;
        }

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.setAttribute(
            "aria-label",
            "Close navigation"
        );

        mobileNavigation.hidden = false;

        document.body.classList.add(
            "menu-open"
        );

    };


    const closeMenu = () => {

        if (!menuButton || !mobileNavigation) {
            return;
        }

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Open navigation"
        );

        mobileNavigation.hidden = true;

        document.body.classList.remove(
            "menu-open"
        );

    };


    const toggleMenu = () => {

        const isOpen =
            menuButton.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    };


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            toggleMenu
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU AFTER NAVIGATION
    ====================================================== */

    if (mobileNavigation) {

        mobileNavigation
            .querySelectorAll('a[href^="#"]')
            .forEach(link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });

    }


    /* =====================================================
       ESCAPE KEY
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeMenu();

        }
    );


    /* =====================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ====================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !mobileNavigation ||
                !menuButton
            ) {
                return;
            }

            const isOpen =
                menuButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (!isOpen) return;

            const clickedInsideMenu =
                mobileNavigation.contains(
                    event.target
                );

            const clickedButton =
                menuButton.contains(
                    event.target
                );

            if (
                !clickedInsideMenu &&
                !clickedButton
            ) {
                closeMenu();
            }

        }
    );


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
    ====================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                const headerOffset =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerOffset -
                    18;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

                /*
                 * Keep the URL useful without
                 * forcing an immediate browser jump.
                 */
                history.pushState(
                    null,
                    "",
                    targetId
                );

            }
        );

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ====================================================== */

    if (
        sections.length &&
        navigationLinks.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        const id =
                            entry.target.id;

                        navigationLinks.forEach(
                            link => {

                                const isActive =
                                    link.getAttribute(
                                        "href"
                                    ) === `#${id}`;

                                link.classList.toggle(
                                    "active",
                                    isActive
                                );

                            }
                        );

                    });

                },
                {
                    root: null,

                    rootMargin:
                        "-35% 0px -55% 0px",

                    threshold: 0
                }
            );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* =====================================================
       REVEAL ANIMATIONS
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".section-header, " +
            ".project-featured, " +
            ".project-card, " +
            ".now-primary, " +
            ".now-item, " +
            ".engineering-group, " +
            ".beyond-card, " +
            ".process-list li, " +
            ".about-copy, " +
            ".contact-inner"
        );


    /*
     * Respect reduced-motion preferences.
     */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        !reduceMotion &&
        "IntersectionObserver" in window
    ) {

        revealElements.forEach(
            (element, index) => {

                element.classList.add(
                    "reveal"
                );

                element.style.setProperty(
                    "--reveal-delay",
                    `${Math.min(index * 35, 240)}ms`
                );

            }
        );


        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(
                element
            );

        });

    } else {

        /*
         * No animation = immediately visible.
         */

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* =====================================================
       PROJECT CARD POINTER EFFECT
    ====================================================== */

    const projectCards =
        document.querySelectorAll(
            ".project-card, .project-featured"
        );


    projectCards.forEach(card => {

        card.addEventListener(
            "pointermove",
            event => {

                if (
                    window.matchMedia(
                        "(max-width: 700px)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) *
                    100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) *
                    100;

                card.style.setProperty(
                    "--mouse-x",
                    `${x}%`
                );

                card.style.setProperty(
                    "--mouse-y",
                    `${y}%`
                );

            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                card.style.removeProperty(
                    "--mouse-x"
                );

                card.style.removeProperty(
                    "--mouse-y"
                );

            }
        );

    });


    /* =====================================================
       EXTERNAL LINKS
    ====================================================== */

    document.querySelectorAll(
        'a[href^="http"]'
    ).forEach(link => {

        /*
         * Don't modify links that already have
         * an explicit target.
         */

        if (!link.hasAttribute("target")) {

            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });


    /* =====================================================
       KEYBOARD SHORTCUT
       Home → top of page
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const activeElement =
                document.activeElement;

            const typing =
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.isContentEditable
                );

            if (
                event.key === "Home" &&
                !typing &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {

                window.scrollTo({
                    top: 0,
                    behavior: reduceMotion
                        ? "auto"
                        : "smooth"
                });

            }

        }
    );


    /* =====================================================
       RESIZE HANDLING
    ====================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(
                () => {

                    /*
                     * If the viewport becomes desktop-sized,
                     * make sure the mobile menu is closed.
                     */

                    if (
                        window.innerWidth > 700
                    ) {
                        closeMenu();
                    }

                },
                120
            );

        },
        { passive: true }
    );


    /* =====================================================
       PAGE READY
    ====================================================== */

    document.documentElement.classList.add(
        "js-enabled"
    );

})();
