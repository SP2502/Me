/* ============================================================
   SHREYANSH — PERSONAL ENGINEERING WEBSITE
   Lightweight interaction layer
   ============================================================ */

(() => {
    "use strict";


    /* ========================================================
       01. DOM
    ======================================================== */

    const documentRoot = document.documentElement;
    const body = document.body;

    const header = document.querySelector("#site-header");

    const menuToggle = document.querySelector(
        ".mobile-menu-toggle"
    );

    const mobileNavigation = document.querySelector(
        "#mobile-navigation"
    );

    const mobileNavigationLinks = mobileNavigation
        ? mobileNavigation.querySelectorAll("a[href^='#']")
        : [];

    const desktopNavigationLinks = document.querySelectorAll(
        ".desktop-nav a[href^='#']"
    );

    const revealElements = document.querySelectorAll(
        ".reveal"
    );

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const currentYearElements = document.querySelectorAll(
        "[data-current-year]"
    );


    /* ========================================================
       02. JAVASCRIPT READY
    ======================================================== */

    documentRoot.classList.add("js-ready");


    /* ========================================================
       03. MOBILE NAVIGATION
    ======================================================== */

    const setMobileMenuState = (isOpen) => {

        if (!menuToggle || !mobileNavigation) {
            return;
        }

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation"
                : "Open navigation"
        );

        mobileNavigation.classList.toggle(
            "open",
            isOpen
        );

        mobileNavigation.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        body.classList.toggle(
            "mobile-menu-open",
            isOpen
        );
    };


    if (menuToggle && mobileNavigation) {

        menuToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    menuToggle.getAttribute(
                        "aria-expanded"
                    ) === "true";

                setMobileMenuState(!isOpen);
            }
        );


        mobileNavigationLinks.forEach((link) => {

            link.addEventListener(
                "click",
                () => {
                    setMobileMenuState(false);
                }
            );

        });


        document.addEventListener(
            "click",
            (event) => {

                const isOpen =
                    menuToggle.getAttribute(
                        "aria-expanded"
                    ) === "true";

                if (!isOpen) {
                    return;
                }

                const clickedInsideMenu =
                    mobileNavigation.contains(event.target);

                const clickedToggle =
                    menuToggle.contains(event.target);

                if (
                    !clickedInsideMenu &&
                    !clickedToggle
                ) {
                    setMobileMenuState(false);
                }
            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    setMobileMenuState(false);
                    menuToggle.focus();
                }
            }
        );

    }


    /* ========================================================
       04. CLOSE MOBILE MENU WHEN SCREEN BECOMES DESKTOP
    ======================================================== */

    const desktopBreakpoint = window.matchMedia(
        "(min-width: 901px)"
    );


    const handleDesktopChange = (event) => {

        if (event.matches) {
            setMobileMenuState(false);
        }
    };


    if (desktopBreakpoint.addEventListener) {

        desktopBreakpoint.addEventListener(
            "change",
            handleDesktopChange
        );

    } else {

        desktopBreakpoint.addListener(
            handleDesktopChange
        );

    }


    /* ========================================================
       05. HEADER SCROLL STATE
    ======================================================== */

    let ticking = false;


    const updateHeader = () => {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "scrolled",
            window.scrollY > 12
        );

        ticking = false;
    };


    const requestHeaderUpdate = () => {

        if (!ticking) {

            window.requestAnimationFrame(
                updateHeader
            );

            ticking = true;
        }
    };


    window.addEventListener(
        "scroll",
        requestHeaderUpdate,
        {
            passive: true
        }
    );


    updateHeader();


    /* ========================================================
       06. SCROLL REVEAL
    ======================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    if (
        !reducedMotion &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "revealed"
                        );

                        observer.unobserve(
                            entry.target
                        );

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

    } else {

        revealElements.forEach((element) => {

            element.classList.add(
                "revealed"
            );

        });

    }


    /* ========================================================
       07. ACTIVE DESKTOP NAVIGATION
    ======================================================== */

    const setActiveNavigation = (id) => {

        desktopNavigationLinks.forEach(
            (link) => {

                const href =
                    link.getAttribute("href");

                const isActive =
                    href === `#${id}`;

                link.classList.toggle(
                    "active",
                    isActive
                );

            }
        );

    };


    if (
        sections.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const navigationObserver =
            new IntersectionObserver(
                (entries) => {

                    const visibleSections =
                        Array.from(entries)
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );

                    if (
                        visibleSections.length > 0
                    ) {

                        setActiveNavigation(
                            visibleSections[0]
                                .target
                                .id
                        );

                    }

                },
                {
                    rootMargin:
                        "-20% 0px -65% 0px",
                    threshold: [
                        0,
                        0.1,
                        0.25,
                        0.5
                    ]
                }
            );


        sections.forEach((section) => {

            navigationObserver.observe(
                section
            );

        });

    }


    /* ========================================================
       08. SMOOTH INTERNAL LINKS
    ======================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

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

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight -
                    16;

                window.scrollTo({
                    top: Math.max(
                        targetPosition,
                        0
                    ),
                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });


                /*
                 * Update URL without causing
                 * another jump.
                 */
                if (
                    window.history &&
                    window.history.replaceState
                ) {

                    window.history.replaceState(
                        null,
                        "",
                        targetId
                    );

                }

            }
        );

    });


    /* ========================================================
       09. EXTERNAL LINKS
    ======================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[href^="http://"], a[href^="https://"]'
        );


    externalLinks.forEach((link) => {

        const url =
            new URL(
                link.href,
                window.location.href
            );

        if (
            url.origin !==
            window.location.origin
        ) {

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


    /* ========================================================
       10. CURRENT YEAR
    ======================================================== */

    const currentYear =
        new Date().getFullYear();


    currentYearElements.forEach(
        (element) => {

            element.textContent =
                String(currentYear);

        }
    );


    /* ========================================================
       11. PROJECT CARD KEYBOARD SUPPORT
    ======================================================== */

    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    projectCards.forEach((card) => {

        const primaryLink =
            card.querySelector(
                "a[href]"
            );

        if (!primaryLink) {
            return;
        }


        card.addEventListener(
            "keydown",
            (event) => {

                /*
                 * Allow Enter/Space when the user
                 * focuses the card itself.
                 */

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }


                /*
                 * Don't interfere with an actual
                 * focused link/button.
                 */

                if (
                    event.target.closest(
                        "a, button"
                    )
                ) {
                    return;
                }


                event.preventDefault();

                primaryLink.click();

            }
        );

    });


    /* ========================================================
       12. EXTERNAL PAGE VISIBILITY
    ======================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                updateHeader();

            }

        }
    );


    /* ========================================================
       13. IMAGE SAFETY
       ======================================================== */

    /*
     * If images are added later, prevent broken-image
     * layout surprises from producing unnecessary
     * visual noise.
     */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-load-error"
                );

            },
            {
                once: true
            }
        );

    });


    /* ========================================================
       14. INITIAL STATE
    ======================================================== */

    /*
     * Mark the first visible navigation area when
     * the page loads near the top.
     */

    if (
        window.scrollY <
        window.innerHeight * 0.45
    ) {

        setActiveNavigation("projects");

    }


})();
