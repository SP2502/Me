/* =========================================================
   SHREYANSH PARGANIHA
   Personal Website
   script.js
========================================================= */

"use strict";


/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       Elements
    ----------------------------------------------------- */

    const header =
        document.querySelector(".site-header");

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");

    const navItems =
        document.querySelectorAll(".nav-links a");

    const sections =
        document.querySelectorAll("main section[id]");

    const classElements =
        document.querySelectorAll("[data-current-class]");

    const yearElements =
        document.querySelectorAll("[data-current-year]");

    const copyEmailButton =
        document.querySelector(".copy-email");


    /* =====================================================
       02. ACADEMIC YEAR
       
       Class 11:
       Before April 1, 2027

       Class 12:
       April 1, 2027 onward
    ===================================================== */

    function getCurrentClass() {

        const now = new Date();

        const classTwelveStart =
            new Date(2027, 3, 1, 0, 0, 0);

        return now >= classTwelveStart
            ? "12"
            : "11";
    }


    function updateCurrentClass() {

        const currentClass =
            getCurrentClass();

        classElements.forEach((element) => {

            element.textContent =
                currentClass;

        });
    }


    /* =====================================================
       03. CURRENT YEAR
    ===================================================== */

    function updateCurrentYear() {

        const year =
            new Date().getFullYear();

        yearElements.forEach((element) => {

            element.textContent =
                year;

        });
    }


    updateCurrentClass();
    updateCurrentYear();


    /* =====================================================
       04. MOBILE NAVIGATION
    ===================================================== */

    function setMenuState(isOpen) {

        if (!menuToggle || !navLinks) {
            return;
        }

        menuToggle.classList.toggle(
            "is-open",
            isOpen
        );

        navLinks.classList.toggle(
            "is-open",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );
    }


    function toggleMenu() {

        const isOpen =
            navLinks?.classList.contains("is-open");

        setMenuState(!isOpen);
    }


    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleMenu
        );

    }


    /* =====================================================
       05. CLOSE MOBILE NAVIGATION
    ===================================================== */

    navItems.forEach((link) => {

        link.addEventListener(
            "click",
            () => setMenuState(false)
        );

    });


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                navLinks?.classList.contains("is-open")
            ) {

                setMenuState(false);

                menuToggle?.focus();

            }

        }
    );


    /* =====================================================
       06. CLICK OUTSIDE MENU
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (
                !navLinks ||
                !menuToggle
            ) {
                return;
            }

            if (
                !navLinks.classList.contains("is-open")
            ) {
                return;
            }

            const clickedMenu =
                menuToggle.contains(event.target);

            const clickedNavigation =
                navLinks.contains(event.target);

            if (
                !clickedMenu &&
                !clickedNavigation
            ) {

                setMenuState(false);

            }

        }
    );


    /* =====================================================
       07. HEADER SCROLL STATE
    ===================================================== */

    function updateHeader() {

        if (!header) {
            return;
        }

        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );
    }


    updateHeader();


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    /* =====================================================
       08. ACTIVE NAVIGATION
    ===================================================== */

    function updateActiveNavigation() {

        if (!sections.length) {
            return;
        }

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.30;

        let activeSection = "";


        sections.forEach((section) => {

            const top =
                section.offsetTop;

            const bottom =
                top +
                section.offsetHeight;

            if (
                scrollPosition >= top &&
                scrollPosition < bottom
            ) {

                activeSection =
                    section.id;

            }

        });


        navItems.forEach((link) => {

            const target =
                link.getAttribute("href");

            const isActive =
                target === `#${activeSection}`;

            link.classList.toggle(
                "active",
                isActive
            );

        });

    }


    updateActiveNavigation();


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        {
            passive: true
        }
    );


    /* =====================================================
       09. SMOOTH INTERNAL NAVIGATION
    ===================================================== */

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
                    document.querySelector(targetId);

                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    header?.offsetHeight || 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    18;


                const reducedMotion =
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches;


                window.scrollTo({

                    top: targetPosition,

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"

                });


                /*
                 * Update the URL without causing
                 * another browser jump.
                 */

                if (
                    history.pushState
                ) {

                    history.pushState(
                        null,
                        "",
                        targetId
                    );

                }

            }
        );

    });


    /* =====================================================
       10. SCROLL REVEAL
       
       Only subtle movement.
       No exaggerated animation.
    ===================================================== */

    const revealTargets =
        document.querySelectorAll(
            ".section-intro, " +
            ".learning-copy, " +
            ".learning-process, " +
            ".about-main, " +
            ".about-story, " +
            ".question, " +
            ".project, " +
            ".now-block, " +
            ".foundation-row, " +
            ".outside-item, " +
            ".contact-content"
        );


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        document.documentElement.classList.add(
            "reveal-ready"
        );


        revealTargets.forEach((element) => {

            element.classList.add(
                "reveal-target"
            );

        });


        /*
         * The CSS provided earlier expects:
         *
         * .is-visible
         *
         * to reveal content.
         *
         * Add the necessary initial state here
         * without requiring another CSS rewrite.
         */

        revealTargets.forEach((element) => {

            element.style.opacity = "0";
            element.style.transform =
                "translateY(18px)";
            element.style.transition =
                "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), " +
                "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)";

        });


        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.10,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        revealTargets.forEach((element) => {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       11. COPY EMAIL
    ===================================================== */

    if (copyEmailButton) {

        const email =
            copyEmailButton.dataset.email;

        const originalText =
            copyEmailButton.textContent;

        let resetTimer;


        async function copyEmail() {

            if (!email) {
                return;
            }


            try {

                /*
                 * Modern clipboard API
                 */

                await navigator.clipboard.writeText(
                    email
                );

                showCopiedState();

            } catch {

                /*
                 * Fallback for browsers that don't
                 * expose navigator.clipboard.
                 */

                fallbackCopy(email);

            }

        }


        function showCopiedState() {

            copyEmailButton.textContent =
                "Copied";

            copyEmailButton.classList.add(
                "copied"
            );

            copyEmailButton.setAttribute(
                "aria-label",
                "Email address copied"
            );


            clearTimeout(resetTimer);


            resetTimer =
                setTimeout(() => {

                    copyEmailButton.textContent =
                        originalText;

                    copyEmailButton.classList.remove(
                        "copied"
                    );

                    copyEmailButton.setAttribute(
                        "aria-label",
                        "Copy email address"
                    );

                }, 1800);

        }


        function fallbackCopy(value) {

            const input =
                document.createElement("textarea");

            input.value = value;

            input.setAttribute(
                "readonly",
                ""
            );

            input.style.position =
                "fixed";

            input.style.left =
                "-9999px";

            document.body.appendChild(input);

            input.select();

            try {

                document.execCommand(
                    "copy"
                );

                showCopiedState();

            } finally {

                input.remove();

            }

        }


        copyEmailButton.addEventListener(
            "click",
            copyEmail
        );

    }


    /* =====================================================
       12. EXTERNAL LINK SAFETY
    ===================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach((link) => {

            const existingRel =
                link.getAttribute("rel") || "";

            const relValues =
                new Set(
                    existingRel
                        .split(/\s+/)
                        .filter(Boolean)
                );

            relValues.add("noopener");
            relValues.add("noreferrer");

            link.setAttribute(
                "rel",
                Array.from(relValues).join(" ")
            );

        });


    /* =====================================================
       13. SYSTEM VISUAL INTERACTION
       
       Very subtle interaction.
       It should feel like a system visualization,
       not a flashy animation.
    ===================================================== */

    const heroSystem =
        document.querySelector(".hero-system");


    if (
        heroSystem &&
        !prefersReducedMotion
    ) {

        const nodes =
            heroSystem.querySelectorAll(
                ".system-node"
            );


        nodes.forEach((node, index) => {

            node.addEventListener(
                "mouseenter",
                () => {

                    node.style.borderColor =
                        "rgba(169, 200, 189, 0.45)";

                    node.style.color =
                        "#f1f1ee";

                    node.style.background =
                        "rgba(169, 200, 189, 0.06)";

                }
            );


            node.addEventListener(
                "mouseleave",
                () => {

                    node.style.borderColor =
                        "";

                    node.style.color =
                        "";

                    node.style.background =
                        "";

                }
            );

        });

    }


    /* =====================================================
       14. DYNAMIC YEAR REFRESH
       
       Keeps the academic class and footer year
       correct if the page remains open overnight.
    ===================================================== */

    function scheduleDailyRefresh() {

        const now =
            new Date();

        const tomorrow =
            new Date(now);

        tomorrow.setDate(
            now.getDate() + 1
        );

        tomorrow.setHours(
            0,
            0,
            5,
            0
        );


        const delay =
            tomorrow.getTime() -
            now.getTime();


        setTimeout(() => {

            updateCurrentClass();
            updateCurrentYear();

            scheduleDailyRefresh();

        }, delay);

    }


    scheduleDailyRefresh();


    /* =====================================================
       15. RESIZE HANDLING
       
       Closes mobile navigation if the viewport becomes
       desktop-sized.
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(() => {

                    if (
                        window.innerWidth > 700
                    ) {

                        setMenuState(false);

                    }

                    updateActiveNavigation();

                }, 100);

        }
    );


    /* =====================================================
       16. INITIAL STATE
    ===================================================== */

    updateCurrentClass();
    updateCurrentYear();
    updateHeader();
    updateActiveNavigation();

});
