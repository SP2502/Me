/* =========================================================
   SHREYANSH PARGANIHA — PERSONAL SITE
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     01. ELEMENTS
  ======================================================= */

  const root = document.documentElement;
  const header = document.querySelector(".site-header");

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  const currentClassElements =
    document.querySelectorAll("[data-current-class]");

  const currentYearElements =
    document.querySelectorAll("[data-current-year]");

  const navItems =
    document.querySelectorAll(".nav-links a[href^='#']");

  const sections =
    document.querySelectorAll("main section[id]");

  const revealTargets =
    document.querySelectorAll(".section, .project");

  /* =======================================================
     02. CURRENT CLASS
     Class 11 → Class 12 on April 1, 2027
  ======================================================= */

  function updateCurrentClass() {
    const now = new Date();

    const class12Start = new Date(
      "2027-04-01T00:00:00"
    );

    const currentClass =
      now >= class12Start ? "12" : "11";

    currentClassElements.forEach((element) => {
      element.textContent = currentClass;
    });
  }

  updateCurrentClass();


  /* =======================================================
     03. CURRENT YEAR
  ======================================================= */

  function updateCurrentYear() {
    const year = new Date().getFullYear();

    currentYearElements.forEach((element) => {
      element.textContent = year;
    });
  }

  updateCurrentYear();


  /* =======================================================
     04. MOBILE NAVIGATION
  ======================================================= */

  function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    root.classList.remove("menu-open");
  }

  function openMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.add("is-open");
    menuToggle.classList.add("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

    root.classList.add("menu-open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen =
        navLinks.classList.contains("is-open");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navLinks.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (link) {
        closeMobileMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("is-open")) {
        return;
      }

      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMobileMenu();
      }
    });
  }


  /* =======================================================
     05. HEADER SCROLL STATE
  ======================================================= */

  function updateHeader() {
    if (!header) return;

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


  /* =======================================================
     06. ACTIVE NAVIGATION
  ======================================================= */

  function updateActiveNavigation() {
    if (!sections.length || !navItems.length) {
      return;
    }

    const scrollPosition =
      window.scrollY + 180;

    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section.id;
      }
    });

    navItems.forEach((item) => {
      const target =
        item.getAttribute("href");

      item.classList.toggle(
        "active",
        target === `#${currentSection}`
      );
    });
  }

  updateActiveNavigation();

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );


  /* =======================================================
     07. SMOOTH INTERNAL NAVIGATION
  ======================================================= */

  navItems.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#" ||
        !targetId.startsWith("#")
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight =
        header?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth"
      });

      /*
       * Update the URL without forcing
       * a browser jump.
       */
      try {
        history.pushState(
          null,
          "",
          targetId
        );
      } catch {
        // Ignore unsupported history behavior.
      }
    });
  });


  /* =======================================================
     08. SCROLL REVEAL
     
     IMPORTANT:
     - Nothing is globally hidden.
     - Elements become reveal targets only here.
     - Hero is deliberately excluded.
     - If JS fails, CSS keeps the site visible.
  ======================================================= */

  if (
    "IntersectionObserver" in window &&
    revealTargets.length
  ) {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.08,
          rootMargin:
            "0px 0px -40px 0px"
        }
      );

    revealTargets.forEach((element) => {
      /*
       * Hero is never included because
       * the hero is not given the .reveal-target
       * class in this script.
       */
      if (
        element.classList.contains("hero")
      ) {
        return;
      }

      element.classList.add(
        "reveal-target"
      );

      revealObserver.observe(element);
    });
  } else {
    /*
     * Older browsers:
     * make everything visible immediately.
     */
    revealTargets.forEach((element) => {
      element.classList.add(
        "is-visible"
      );
    });
  }


  /* =======================================================
     09. COPY EMAIL
  ======================================================= */

  const copyEmailButtons =
    document.querySelectorAll(
      "[data-copy-email]"
    );

  copyEmailButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const email =
        button.getAttribute(
          "data-copy-email"
        );

      if (!email) return;

      const originalText =
        button.textContent;

      try {
        if (
          navigator.clipboard &&
          window.isSecureContext
        ) {
          await navigator.clipboard.writeText(
            email
          );
        } else {
          /*
           * Fallback for older browsers.
           */
          const textarea =
            document.createElement("textarea");

          textarea.value = email;

          textarea.style.position =
            "fixed";
          textarea.style.opacity = "0";
          textarea.style.pointerEvents =
            "none";

          document.body.appendChild(
            textarea
          );

          textarea.focus();
          textarea.select();

          document.execCommand(
            "copy"
          );

          textarea.remove();
        }

        button.classList.add(
          "copied"
        );

        button.textContent =
          "Email copied";

        window.setTimeout(() => {
          button.classList.remove(
            "copied"
          );

          button.textContent =
            originalText;
        }, 1800);
      } catch {
        /*
         * Do not break the page if clipboard
         * access is unavailable.
         */
        button.textContent =
          "Copy failed";

        window.setTimeout(() => {
          button.textContent =
            originalText;
        }, 1800);
      }
    });
  });


  /* =======================================================
     10. EXTERNAL LINK SAFETY
  ======================================================= */

  const externalLinks =
    document.querySelectorAll(
      'a[target="_blank"]'
    );

  externalLinks.forEach((link) => {
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
      [...relValues].join(" ")
    );
  });


  /* =======================================================
     11. HERO SYSTEM INTERACTION
     
     Very subtle interaction only.
     No cursor-following effects.
  ======================================================= */

  const heroSystem =
    document.querySelector(
      ".hero-system"
    );

  if (heroSystem) {
    const systemNodes =
      heroSystem.querySelectorAll(
        ".system-node"
      );

    systemNodes.forEach((node) => {
      node.addEventListener(
        "mouseenter",
        () => {
          node.style.transform =
            "scale(1.45)";
        }
      );

      node.addEventListener(
        "mouseleave",
        () => {
          node.style.transform =
            "";
        }
      );
    });
  }


  /* =======================================================
     12. DYNAMIC YEAR / CLASS REFRESH
     
     Useful if the page remains open across
     midnight or the April 1 class transition.
  ======================================================= */

  window.setInterval(
    () => {
      updateCurrentClass();
      updateCurrentYear();
    },
    60 * 60 * 1000
  );


  /* =======================================================
     13. INITIAL STATE
  ======================================================= */

  /*
   * Force the browser to evaluate the initial
   * navigation state after layout is ready.
   */
  window.requestAnimationFrame(() => {
    updateHeader();
    updateActiveNavigation();
  });

});
