/* =========================================================
   SHREYANSH PARGANIHA
   Premium Portfolio Runtime
   ---------------------------------------------------------
   Goals:
   - Minimal runtime overhead
   - No framework
   - No animation library
   - Progressive enhancement
   - Chromium / Firefox / Safari compatible
   - macOS / Windows / iOS / Android friendly
   - Accessible keyboard + touch navigation
   - Automatic academic-year updates
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIG
  ======================================================== */

  const CONFIG = {
    classSwitchDate: new Date("2027-04-01T00:00:00"),
    headerScrollThreshold: 24,
    copyResetDelay: 1600,
    mobileBreakpoint: 680
  };


  /* =======================================================
     DOM CACHE
  ======================================================== */

  const dom = {
    document: document,
    html: document.documentElement,
    body: document.body,

    header: document.querySelector(".site-header"),

    menuToggle: document.querySelector(".menu-toggle"),
    nav: document.querySelector(".nav-links"),
    navLinks: Array.from(
      document.querySelectorAll(".nav-links a")
    ),

    sections: Array.from(
      document.querySelectorAll("main section[id]")
    ),

    classElements: Array.from(
      document.querySelectorAll("[data-class-year]")
    ),

    yearElements: Array.from(
      document.querySelectorAll("[data-year]")
    ),

    copyButtons: Array.from(
      document.querySelectorAll("[data-copy-email]")
    )
  };


  /* =======================================================
     UTILITIES
  ======================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  const isMobile = () =>
    window.matchMedia(
      `(max-width: ${CONFIG.mobileBreakpoint}px)`
    ).matches;


  /* =======================================================
     ACADEMIC CLASS
     -------------------------------------------------------
     Class 11 until March 31, 2027.
     Class 12 from April 1, 2027.
  ======================================================== */

  function updateClassYear() {
    if (!dom.classElements.length) return;

    const currentClass =
      new Date() >= CONFIG.classSwitchDate
        ? "12"
        : "11";

    dom.classElements.forEach((element) => {
      if (element.textContent !== currentClass) {
        element.textContent = currentClass;
      }
    });
  }


  /* =======================================================
     CURRENT YEAR
  ======================================================== */

  function updateYear() {
    if (!dom.yearElements.length) return;

    const year = String(new Date().getFullYear());

    dom.yearElements.forEach((element) => {
      if (element.textContent !== year) {
        element.textContent = year;
      }
    });
  }


  /* =======================================================
     HEADER STATE
     -------------------------------------------------------
     Uses requestAnimationFrame to avoid excessive layout
     work during scrolling.
  ======================================================== */

  let headerTicking = false;

  function updateHeader() {
    if (!dom.header) {
      headerTicking = false;
      return;
    }

    const shouldBeScrolled =
      window.scrollY > CONFIG.headerScrollThreshold;

    dom.header.classList.toggle(
      "scrolled",
      shouldBeScrolled
    );

    headerTicking = false;
  }


  function requestHeaderUpdate() {
    if (headerTicking) return;

    headerTicking = true;

    window.requestAnimationFrame(updateHeader);
  }


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================== */

  function setMenuState(open) {
    if (!dom.menuToggle || !dom.nav) return;

    dom.nav.classList.toggle("is-open", open);

    dom.menuToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    dom.menuToggle.setAttribute(
      "aria-label",
      open
        ? "Close navigation"
        : "Open navigation"
    );

    /*
     * Prevent background scrolling while the mobile
     * navigation is open.
     */
    if (isMobile()) {
      dom.body.classList.toggle(
        "menu-open",
        open
      );
    } else {
      dom.body.classList.remove(
        "menu-open"
      );
    }
  }


  function toggleMenu() {
    if (!dom.nav) return;

    const isOpen =
      dom.nav.classList.contains("is-open");

    setMenuState(!isOpen);
  }


  function closeMenu() {
    setMenuState(false);
  }


  /* =======================================================
     MOBILE NAV EVENTS
  ======================================================== */

  function initMobileNavigation() {
    if (!dom.menuToggle || !dom.nav) return;

    dom.menuToggle.addEventListener(
      "click",
      toggleMenu
    );

    dom.navLinks.forEach((link) => {
      link.addEventListener(
        "click",
        closeMenu
      );
    });

    /*
     * Escape closes the menu.
     */
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      }
    );

    /*
     * If the device changes from mobile to desktop,
     * reset the mobile state.
     */
    window.addEventListener(
      "resize",
      () => {
        if (!isMobile()) {
          closeMenu();
        }
      },
      { passive: true }
    );
  }


  /* =======================================================
     BODY SCROLL LOCK
     -------------------------------------------------------
     Only active while mobile menu is open.
  ======================================================== */

  function injectScrollLockStyle() {
    /*
     * Keep this tiny and only add it when necessary.
     */
    if (
      document.getElementById(
        "portfolio-runtime-style"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "portfolio-runtime-style";

    style.textContent = `
      body.menu-open {
        overflow: hidden;
        overscroll-behavior: contain;
      }

      @media (min-width: 681px) {
        body.menu-open {
          overflow: auto;
        }
      }
    `;

    document.head.appendChild(style);
  }


  /* =======================================================
     SMOOTH INTERNAL NAVIGATION
  ======================================================== */

  function getTargetFromLink(link) {
    const href =
      link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return null;
    }

    const id =
      href.slice(1);

    if (!id) return null;

    return document.getElementById(id);
  }


  function getHeaderOffset() {
    if (!dom.header) return 0;

    return dom.header.offsetHeight + 16;
  }


  function scrollToTarget(target) {
    if (!target) return;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth"
    });
  }


  function initSmoothNavigation() {
    dom.navLinks.forEach((link) => {
      link.addEventListener(
        "click",
        (event) => {
          const target =
            getTargetFromLink(link);

          if (!target) return;

          event.preventDefault();

          closeMenu();

          scrollToTarget(target);

          /*
           * Keep the URL shareable without causing
           * an additional browser jump.
           */
          const id =
            target.getAttribute("id");

          if (id) {
            history.pushState(
              null,
              "",
              `#${id}`
            );
          }
        }
      );
    });


    /*
     * Handle the brand/home link too.
     */
    const brand =
      document.querySelector(".brand");

    if (brand) {
      brand.addEventListener(
        "click",
        (event) => {
          const target =
            getTargetFromLink(brand);

          if (!target) return;

          event.preventDefault();

          closeMenu();

          scrollToTarget(target);

          history.pushState(
            null,
            "",
            "#home"
          );
        }
      );
    }
  }


  /* =======================================================
     ACTIVE NAVIGATION
     -------------------------------------------------------
     IntersectionObserver avoids a continuous scroll loop.
  ======================================================== */

  let activeSectionId = "";


  function setActiveNav(id) {
    if (!id || id === activeSectionId) {
      return;
    }

    activeSectionId = id;

    dom.navLinks.forEach((link) => {
      const targetId =
        link.getAttribute("href");

      const isActive =
        targetId === `#${id}`;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {
        link.setAttribute(
          "aria-current",
          "page"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }


  function initActiveNavigation() {
    if (
      !dom.sections.length ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          /*
           * Find the visible section with the greatest
           * intersection ratio.
           */
          const visibleSections =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              );

          if (!visibleSections.length) {
            return;
          }

          setActiveNav(
            visibleSections[0]
              .target
              .id
          );
        },
        {
          root: null,
          rootMargin:
            "-20% 0px -65% 0px",
          threshold: [0.1, 0.25, 0.5, 0.75]
        }
      );

    dom.sections.forEach((section) => {
      observer.observe(section);
    });
  }


  /* =======================================================
     COPY EMAIL
  ======================================================== */

  async function copyWithClipboardAPI(text) {
    if (
      !navigator.clipboard ||
      !window.isSecureContext
    ) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }


  function copyWithFallback(text) {
    const textarea =
      document.createElement("textarea");

    textarea.value = text;

    textarea.setAttribute(
      "readonly",
      ""
    );

    textarea.style.position =
      "fixed";

    textarea.style.opacity = "0";
    textarea.style.pointerEvents =
      "none";

    document.body.appendChild(
      textarea
    );

    textarea.select();
    textarea.setSelectionRange(
      0,
      textarea.value.length
    );

    let successful = false;

    try {
      successful =
        document.execCommand(
          "copy"
        );
    } catch {
      successful = false;
    }

    textarea.remove();

    return successful;
  }


  async function copyEmail(button) {
    if (!button) return;

    const email =
      button.dataset.copyEmail;

    if (!email) return;

    const label =
      button.querySelector(
        "[data-copy-label]"
      );

    const originalLabel =
      label
        ? label.textContent
        : "";

    let successful =
      await copyWithClipboardAPI(
        email
      );

    if (!successful) {
      successful =
        copyWithFallback(email);
    }

    if (!label) return;

    label.textContent =
      successful
        ? "Copied"
        : "Copy failed";

    if (successful) {
      window.setTimeout(() => {
        label.textContent =
          originalLabel || "Copy";
      }, CONFIG.copyResetDelay);
    }
  }


  function initClipboard() {
    dom.copyButtons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          copyEmail(button);
        }
      );
    });
  }


  /* =======================================================
     EXTERNAL LINK SAFETY
  ======================================================== */

  function secureExternalLinks() {
    const links =
      document.querySelectorAll(
        'a[target="_blank"]'
      );

    links.forEach((link) => {
      const rel =
        new Set(
          (
            link.getAttribute("rel") ||
            ""
          ).split(/\s+/).filter(Boolean)
        );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute(
        "rel",
        Array.from(rel).join(" ")
      );
    });
  }


  /* =======================================================
     HASH NAVIGATION
     -------------------------------------------------------
     Allows direct URLs such as:
     /#projects
  ======================================================== */

  function handleInitialHash() {
    const hash =
      window.location.hash;

    if (!hash || hash === "#") {
      return;
    }

    const id =
      decodeURIComponent(
        hash.slice(1)
      );

    const target =
      document.getElementById(id);

    if (!target) return;

    /*
     * Wait until layout has stabilised.
     * This prevents jumping to the wrong position
     * before fonts/images/layout have settled.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToTarget(target);
      });
    });
  }


  /* =======================================================
     BROWSER BACK / FORWARD
  ======================================================== */

  function initHistoryNavigation() {
    window.addEventListener(
      "popstate",
      () => {
        const hash =
          window.location.hash;

        if (!hash) {
          window.scrollTo({
            top: 0,
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth"
          });

          return;
        }

        const id =
          decodeURIComponent(
            hash.slice(1)
          );

        const target =
          document.getElementById(id);

        if (target) {
          scrollToTarget(target);
        }
      }
    );
  }


  /* =======================================================
     PAGE VISIBILITY
     -------------------------------------------------------
     If the user switches tabs, avoid doing unnecessary
     work. No animation loops run anyway, but this keeps
     future enhancements safe.
  ======================================================== */

  function initVisibilityHandling() {
    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
          "hidden"
        ) {
          closeMenu();
        }
      }
    );
  }


  /* =======================================================
     DATE CHANGE MONITOR
     -------------------------------------------------------
     The class only changes once per academic year.
     We don't need a timer every second.

     The next midnight is checked using a very low-frequency
     timeout so a long-open tab can update naturally.
  ======================================================== */

  function scheduleDateRefresh() {
    const now = new Date();

    const tomorrow =
      new Date(now);

    tomorrow.setHours(
      24,
      0,
      0,
      50
    );

    const delay =
      Math.max(
        1000,
        tomorrow.getTime() -
          now.getTime()
      );

    window.setTimeout(() => {
      updateClassYear();
      updateYear();
      scheduleDateRefresh();
    }, delay);
  }


  /* =======================================================
     RESIZE STATE
  ======================================================== */

  let resizeTimer = 0;

  function initResizeHandling() {
    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(
          resizeTimer
        );

        resizeTimer =
          window.setTimeout(() => {
            if (!isMobile()) {
              closeMenu();
            }
          }, 120);
      },
      {
        passive: true
      }
    );
  }


  /* =======================================================
     SCROLL
  ======================================================== */

  function initScrollHandling() {
    window.addEventListener(
      "scroll",
      requestHeaderUpdate,
      {
        passive: true
      }
    );

    /*
     * Set initial header state immediately.
     */
    updateHeader();
  }


  /* =======================================================
     INITIALIZATION
  ======================================================== */

  function init() {

    /*
     * Content
     */
    updateClassYear();
    updateYear();

    /*
     * Navigation
     */
    initMobileNavigation();
    initSmoothNavigation();
    initActiveNavigation();
    initHistoryNavigation();

    /*
     * Utility
     */
    initClipboard();
    secureExternalLinks();

    /*
     * Browser state
     */
    initScrollHandling();
    initVisibilityHandling();
    initResizeHandling();

    /*
     * Accessibility / mobile scroll lock.
     */
    injectScrollLockStyle();

    /*
     * Date-sensitive content.
     */
    scheduleDateRefresh();

    /*
     * Handle direct links such as #projects.
     */
    handleInitialHash();
  }


  /* =======================================================
     START
  ======================================================== */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }

})();
