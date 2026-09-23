/* ============================================================
   SHREYANSH PARGANIHA
   Personal Engineering Website
   Interaction layer
   ============================================================ */

"use strict";


/* ============================================================
   01. DOM READY
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    document.documentElement.classList.add("js-enhanced");

    initMobileNavigation();
    initHeaderScroll();
    initRevealAnimations();
    initActiveNavigation();
    initSmoothScrolling();
    initExternalLinks();
    initCurrentYear();
    initProjectCards();
});


/* ============================================================
   02. MOBILE NAVIGATION
   ============================================================ */

function initMobileNavigation() {

    const toggle =
        document.querySelector(".mobile-menu-toggle");

    const navigation =
        document.querySelector(".mobile-navigation");

    if (!toggle || !navigation) {
        return;
    }


    const navigationLinks =
        navigation.querySelectorAll("a");


    function openMenu() {

        toggle.setAttribute(
            "aria-expanded",
            "true"
        );

        toggle.setAttribute(
            "aria-label",
            "Close navigation"
        );

        navigation.classList.add("open");

        navigation.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "mobile-menu-open"
        );
    }


    function closeMenu() {

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

        toggle.setAttribute(
            "aria-label",
            "Open navigation"
        );

        navigation.classList.remove("open");

        navigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "mobile-menu-open"
        );
    }


    toggle.addEventListener("click", () => {

        const isOpen =
            toggle.getAttribute("aria-expanded")
            === "true";

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

    });


    navigationLinks.forEach(link => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    document.addEventListener("click", event => {

        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedToggle =
            toggle.contains(event.target);

        const isOpen =
            toggle.getAttribute("aria-expanded")
            === "true";

        if (
            isOpen &&
            !clickedInsideNavigation &&
            !clickedToggle
        ) {
            closeMenu();
        }

    });


    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    /*
     * If the screen becomes desktop-sized while
     * the mobile menu is open, reset it.
     */

    window.addEventListener(
        "resize",
        debounce(() => {

            if (window.innerWidth > 900) {
                closeMenu();
            }

        }, 100)
    );

}


/* ============================================================
   03. HEADER SCROLL STATE
   ============================================================ */

function initHeaderScroll() {

    const header =
        document.querySelector(".site-header");

    if (!header) {
        return;
    }


    let ticking = false;


    function updateHeader() {

        if (window.scrollY > 12) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

        ticking = false;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateHeader
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    updateHeader();

}


/* ============================================================
   04. SCROLL REVEAL
   ============================================================ */

function initRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");

    if (!elements.length) {
        return;
    }


    /*
     * Respect reduced-motion preferences.
     */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reducedMotion) {

        elements.forEach(element => {

            element.classList.add(
                "revealed"
            );

        });

        return;
    }


    /*
     * Initial state.
     *
     * CSS keeps everything visible by default.
     * We only hide elements after JS has successfully loaded.
     */

    elements.forEach(element => {

        element.classList.add(
            "reveal-pending"
        );

    });


    /*
     * IntersectionObserver is used only as
     * progressive enhancement.
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.remove(
                "reveal-pending"
            );

            element.classList.add(
                "revealed"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.remove(
                        "reveal-pending"
                    );

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
                rootMargin: "0px 0px -45px 0px"
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });


    /*
     * Safety fallback.
     *
     * If something prevents an observer callback,
     * content will never remain hidden indefinitely.
     */

    window.setTimeout(() => {

        elements.forEach(element => {

            element.classList.remove(
                "reveal-pending"
            );

            element.classList.add(
                "revealed"
            );

        });

    }, 2500);

}


/* ============================================================
   05. ACTIVE NAVIGATION
   ============================================================ */

function initActiveNavigation() {

    const navigationLinks =
        document.querySelectorAll(
            ".desktop-nav a[href^='#']"
        );

    if (!navigationLinks.length) {
        return;
    }


    const sections = [];


    navigationLinks.forEach(link => {

        const id =
            link.getAttribute("href");

        if (!id || id === "#") {
            return;
        }


        const section =
            document.querySelector(id);

        if (section) {
            sections.push({
                link,
                section
            });
        }

    });


    if (!sections.length) {
        return;
    }


    function setActiveLink(activeLink) {

        navigationLinks.forEach(link => {

            link.classList.remove(
                "active"
            );

        });


        if (activeLink) {

            activeLink.classList.add(
                "active"
            );

        }

    }


    /*
     * Home is active at the top.
     */

    if (window.scrollY < 200) {

        const homeLink =
            document.querySelector(
                '.desktop-nav a[href="#top"]'
            );

        setActiveLink(homeLink);

    }


    if (!("IntersectionObserver" in window)) {
        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                const visible =
                    entries
                        .filter(
                            entry =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        );


                if (!visible.length) {
                    return;
                }


                const current =
                    sections.find(
                        item =>
                            item.section ===
                            visible[0].target
                    );


                if (current) {

                    setActiveLink(
                        current.link
                    );

                }

            },
            {
                rootMargin:
                    "-25% 0px -60% 0px",

                threshold:
                    [0.05, 0.15, 0.3]
            }
        );


    sections.forEach(
        ({ section }) =>
            observer.observe(section)
    );

}


/* ============================================================
   06. SMOOTH INTERNAL LINKS
   ============================================================ */

function initSmoothScrolling() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    if (!links.length) {
        return;
    }


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute("href");


                if (
                    !href ||
                    href === "#" ||
                    href.length <= 1
                ) {
                    return;
                }


                const target =
                    document.querySelector(href);


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth",

                    block:
                        "start"
                });


                /*
                 * Update URL without causing
                 * another browser jump.
                 */

                if (
                    window.history &&
                    window.history.replaceState
                ) {

                    window.history.replaceState(
                        null,
                        "",
                        href
                    );

                }

            }
        );

    });

}


/* ============================================================
   07. EXTERNAL LINKS
   ============================================================ */

function initExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="http"]'
        );


    links.forEach(link => {

        /*
         * Do not modify links that already
         * explicitly define their behavior.
         */

        if (!link.hasAttribute("target")) {

            link.setAttribute(
                "target",
                "_blank"
            );

        }


        if (!link.hasAttribute("rel")) {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });

}


/* ============================================================
   08. CURRENT YEAR
   ============================================================ */

function initCurrentYear() {

    const elements =
        document.querySelectorAll(
            "[data-current-year]"
        );

    if (!elements.length) {
        return;
    }


    const year =
        new Date().getFullYear();


    elements.forEach(element => {

        element.textContent =
            String(year);

    });

}


/* ============================================================
   09. PROJECT CARD INTERACTION
   ============================================================ */

function initProjectCards() {

    const cards =
        document.querySelectorAll(
            ".project-card"
        );


    cards.forEach(card => {

        const primaryLink =
            card.querySelector(
                ".project-arrow"
            );


        if (!primaryLink) {
            return;
        }


        /*
         * Keyboard support is handled naturally
         * by the actual anchor.
         *
         * We intentionally don't make the entire
         * card a fake button because that creates
         * accessibility problems with nested links.
         */


        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add(
                    "is-hovered"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove(
                    "is-hovered"
                );

            }
        );

    });

}


/* ============================================================
   10. EXTERNAL LINK SAFETY
   ============================================================ */

window.addEventListener(
    "error",
    event => {

        /*
         * Prevent an individual resource error
         * from affecting the rest of the page.
         */

        if (
            event.target &&
            event.target.tagName === "IMG"
        ) {

            event.target.classList.add(
                "image-load-error"
            );

        }

    },
    true
);


/* ============================================================
   11. KEYBOARD SCROLL SUPPORT
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        /*
         * Don't interfere with typing.
         */

        const active =
            document.activeElement;

        const isTyping =
            active &&
            (
                active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA" ||
                active.isContentEditable
            );


        if (isTyping) {
            return;
        }


        /*
         * Pressing Home returns to the top.
         */

        if (
            event.key === "Home" &&
            !event.ctrlKey &&
            !event.metaKey
        ) {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior:
                    getScrollBehavior()
            });

        }

    }
);


/* ============================================================
   12. PAGE VISIBILITY
   ============================================================ */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
         * Nothing heavy runs while the tab
         * isn't visible.
         *
         * This is intentionally lightweight because
         * the website doesn't need a continuous loop.
         */

        if (document.hidden) {
            document.body.classList.add(
                "page-hidden"
            );
        } else {
            document.body.classList.remove(
                "page-hidden"
            );
        }

    }
);


/* ============================================================
   13. UTILITIES
   ============================================================ */

function getScrollBehavior() {

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    return reducedMotion
        ? "auto"
        : "smooth";

}


function debounce(
    callback,
    delay = 100
) {

    let timeout;


    return (...args) => {

        window.clearTimeout(
            timeout
        );


        timeout =
            window.setTimeout(
                () => {
                    callback(...args);
                },
                delay
            );

    };

}


/* ============================================================
   14. FINAL INITIALIZATION MARK
   ============================================================ */

/*
 * This class lets CSS know that JavaScript
 * successfully initialized.
 *
 * The HTML therefore remains usable even if
 * JavaScript is disabled or fails to load.
 */

document.documentElement.classList.add(
    "site-ready"
);
