// =========================================================
// SHREYANSH PARGANIHA
// Personal Website
// script.js
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ELEMENT REFERENCES
    ===================================================== */

    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navigationItems = document.querySelectorAll(".nav-links a");

    const currentClassElements =
        document.querySelectorAll("[data-current-class]");

    const currentYearElements =
        document.querySelectorAll("[data-current-year]");

    const copyEmailButton =
        document.querySelector(".copy-email");

    const sections =
        document.querySelectorAll("main section[id]");


    /* =====================================================
       02. CURRENT ACADEMIC CLASS
       
       Class 11 before:
       April 1, 2027

       Class 12 from:
       April 1, 2027
    ===================================================== */

    function getCurrentClass() {

        const now = new Date();

        const classChangeDate =
            new Date(2027, 3, 1, 0, 0, 0);

        return now >= classChangeDate ? "12" : "11";
    }

    function updateCurrentClass() {

        const currentClass = getCurrentClass();

        currentClassElements.forEach((element) => {
            element.textContent = currentClass;
        });
    }

    updateCurrentClass();


    /* =====================================================
       03. CURRENT YEAR
    ===================================================== */

    function updateCurrentYear() {

        const currentYear =
            new Date().getFullYear();

        currentYearElements.forEach((element) => {
            element.textContent = currentYear;
        });
    }

    updateCurrentYear();


    /* =====================================================
       04. MOBILE NAVIGATION
    ===================================================== */

    function openNavigation() {

        if (!menuToggle || !navLinks) {
            return;
        }

        navLinks.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );

        document.body.classList.add("menu-open");
    }

    function closeNavigation() {

        if (!menuToggle || !navLinks) {
            return;
        }

        navLinks.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        document.body.classList.remove("menu-open");
    }

    function toggleNavigation() {

        if (!navLinks) {
            return;
        }

        const isOpen =
            navLinks.classList.contains("open");

        if (isOpen) {
            closeNavigation();
        } else {
            openNavigation();
        }
    }

    if (menuToggle) {

        menuToggle.addEventListener(
            "click",
            toggleNavigation
        );
    }


    /* =====================================================
       05. CLOSE MOBILE NAVIGATION AFTER LINK CLICK
    ===================================================== */

    navigationItems.forEach((link) => {

        link.addEventListener("click", () => {
            closeNavigation();
        });

    });


    /* =====================================================
       06. CLOSE NAVIGATION WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                navLinks &&
                navLinks.classList.contains("open")
            ) {
                closeNavigation();

                menuToggle?.focus();
            }

        }
    );


    /* =====================================================
       07. CLOSE NAVIGATION WHEN CLICKING OUTSIDE
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            if (!navLinks || !menuToggle) {
                return;
            }

            if (
                !navLinks.classList.contains("open")
            ) {
                return;
            }

            const clickedInsideNavigation =
                navLinks.contains(event.target);

            const clickedMenuButton =
                menuToggle.contains(event.target);

            if (
                !clickedInsideNavigation &&
                !clickedMenuButton
            ) {
                closeNavigation();
            }

        }
    );


    /* =====================================================
       08. HEADER SCROLL STATE
    ===================================================== */

    function updateHeader() {

        if (!header) {
            return;
        }

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       09. ACTIVE NAVIGATION
    ===================================================== */

    function updateActiveNavigation() {

        if (!sections.length) {
            return;
        }

        const scrollPosition =
            window.scrollY +
            window.innerHeight * 0.35;

        let currentSection = "";

        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop;

            const sectionBottom =
                sectionTop +
                section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionBottom
            ) {
                currentSection =
                    section.getAttribute("id");
            }

        });

        navigationItems.forEach((link) => {

            const target =
                link.getAttribute("href");

            const isActive =
                target === `#${currentSection}`;

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
        { passive: true }
    );


    /* =====================================================
       10. SCROLL REVEAL
       
       Adds the data-reveal attribute automatically
       to major content elements.
    ===================================================== */

    const revealTargets = document.querySelectorAll(
        ".section-heading, " +
        ".about-content, " +
        ".curiosity-item, " +
        ".project, " +
        ".technology-group, " +
        ".interest, " +
        ".education-content, " +
        ".contact-content"
    );

    revealTargets.forEach((element) => {
        element.setAttribute(
            "data-reveal",
            ""
        );
    });


    const revealElements =
        document.querySelectorAll("[data-reveal]");

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });

    } else {

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
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach((element) => {
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

        let resetTimer = null;

        async function copyEmail() {

            if (!email) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    email
                );

                copyEmailButton.textContent =
                    "Copied";

                copyEmailButton.setAttribute(
                    "aria-label",
                    "Email copied"
                );

                clearTimeout(resetTimer);

                resetTimer =
                    setTimeout(() => {

                        copyEmailButton.textContent =
                            originalText;

                        copyEmailButton.setAttribute(
                            "aria-label",
                            "Copy email address"
                        );

                    }, 1800);

            } catch (error) {

                /*
                 * Fallback for browsers where
                 * Clipboard API is unavailable.
                 */

                const temporaryInput =
                    document.createElement("input");

                temporaryInput.value = email;

                temporaryInput.setAttribute(
                    "readonly",
                    ""
                );

                temporaryInput.style.position =
                    "fixed";

                temporaryInput.style.opacity =
                    "0";

                document.body.appendChild(
                    temporaryInput
                );

                temporaryInput.select();

                try {
                    document.execCommand("copy");

                    copyEmailButton.textContent =
                        "Copied";

                    clearTimeout(resetTimer);

                    resetTimer =
                        setTimeout(() => {

                            copyEmailButton.textContent =
                                originalText;

                        }, 1800);

                } finally {

                    temporaryInput.remove();

                }
            }
        }

        copyEmailButton.addEventListener(
            "click",
            copyEmail
        );
    }


    /* =====================================================
       12. SMOOTH ANCHOR HANDLING
       
       Keeps fixed navigation from covering
       section headings.
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

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
                        header?.offsetHeight || 0;

                    const targetPosition =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        headerHeight -
                        20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"
                    });

                }
            );

        });


    /* =====================================================
       13. KEYBOARD ACCESSIBILITY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Prevent accidental body scrolling when
             * mobile navigation is open.
             */

            if (
                event.key === "Tab" &&
                navLinks?.classList.contains("open")
            ) {
                document.body.classList.add(
                    "keyboard-navigation"
                );
            }

        }
    );


    /* =====================================================
       14. YEAR / CLASS REFRESH
       
       Keeps dynamic information correct if the page
       stays open across midnight or the academic-year
       boundary.
    ===================================================== */

    function scheduleDailyRefresh() {

        const now = new Date();

        const tomorrow =
            new Date(now);

        tomorrow.setHours(
            24,
            0,
            5,
            0
        );

        const millisecondsUntilTomorrow =
            tomorrow.getTime() -
            now.getTime();

        setTimeout(() => {

            updateCurrentClass();
            updateCurrentYear();

            scheduleDailyRefresh();

        }, millisecondsUntilTomorrow);
    }

    scheduleDailyRefresh();


    /* =====================================================
       15. EXTERNAL LINK SAFETY
       
       Ensures links opening new tabs have the expected
       relationship attributes.
    ===================================================== */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach((link) => {

            const rel =
                link.getAttribute("rel") || "";

            const values =
                new Set(
                    rel
                        .split(/\s+/)
                        .filter(Boolean)
                );

            values.add("noopener");
            values.add("noreferrer");

            link.setAttribute(
                "rel",
                Array.from(values).join(" ")
            );

        });


    /* =====================================================
       16. INITIAL STATE
    ===================================================== */

    updateCurrentClass();
    updateCurrentYear();
    updateHeader();
    updateActiveNavigation();

});
