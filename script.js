/* =========================================================
   SHREYANSH PARGANIHA — PORTFOLIO
   Lightweight navigation + interaction system
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
     DOM
  ======================================================== */

  const body = document.body;

  const header = document.getElementById("site-header");

  const menuToggle = document.querySelector(".menu-toggle");

  const nav = document.getElementById("primary-navigation");

  const navLinks = nav
    ? Array.from(nav.querySelectorAll('a[href^="#"]'))
    : [];

  const sections = Array.from(
    document.querySelectorAll("main section[id]")
  );


  /* =======================================================
     REDUCED MOTION
  ======================================================== */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     CLASS YEAR
     Automatically changes 11 → 12 on April 1, 2027
  ======================================================== */

  function updateClassYear() {
    const currentYear = document.querySelectorAll(
      "[data-class-year]"
    );

    const year = new Date() >= CONFIG.classSwitchDate
      ? "12"
      : "11";

    currentYear.forEach((element) => {
      element.textContent = year;
    });
  }


  /* =======================================================
     FOOTER YEAR
  ======================================================== */

  function updateYear() {
    const yearElements = document.querySelectorAll(
      "[data-year]"
    );

    const year = new Date().getFullYear();

    yearElements.forEach((element) => {
      element.textContent = year;
    });
  }


  /* =======================================================
     HEADER SCROLL STATE
  ======================================================== */

  let scrollTicking = false;

  function updateHeader() {
    if (!header) return;

    const scrolled =
      window.scrollY > CONFIG.headerScrollThreshold;

    header.classList.toggle("scrolled", scrolled);

    scrollTicking = false;
  }


  function requestHeaderUpdate() {
    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(updateHeader);
  }


  window.addEventListener(
    "scroll",
    requestHeaderUpdate,
    { passive: true }
  );


  /* =======================================================
     MOBILE MENU
  ======================================================== */

  function openMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.classList.add("active");

    nav.classList.add("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

    body.classList.add("menu-open");
  }


  function closeMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.classList.remove("active");

    nav.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    body.classList.remove("menu-open");
  }


  function toggleMenu() {
    if (!menuToggle || !nav) return;

    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }


  if (menuToggle && nav) {

    menuToggle.addEventListener(
      "click",
      toggleMenu
    );

  }


  /* =======================================================
     CLOSE MENU WITH ESCAPE
  ======================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key !== "Escape") return;

      if (
        menuToggle &&
        menuToggle.getAttribute("aria-expanded") === "true"
      ) {
        closeMenu();

        menuToggle.focus();
      }

    }
  );


  /* =======================================================
     ACTIVE NAVIGATION
     
     Instead of relying entirely on IntersectionObserver,
     determine the section closest to the navigation line.
     
     This makes the underline reliably follow:
     About → Questions → Projects → Contact
  ======================================================== */

  function setActiveNav(id) {
    if (!id) return;

    navLinks.forEach((link) => {

      const href = link.getAttribute("href");

      const isActive =
        href === `#${id}`;

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


  function updateActiveNav() {

    if (!sections.length || !navLinks.length) {
      return;
    }

    const headerHeight =
      header?.getBoundingClientRect().height || 0;

    /*
      This is the virtual horizontal line used to determine
      which section is currently active.

      Slightly below the header prevents the header itself
      from causing incorrect section changes.
    */

    const marker =
      window.scrollY +
      headerHeight +
      Math.min(
        window.innerHeight * 0.28,
        220
      );


    let currentSection = sections[0];

    for (const section of sections) {

      if (
        section.offsetTop <= marker
      ) {
        currentSection = section;
      } else {
        break;
      }

    }


    if (currentSection) {
      setActiveNav(currentSection.id);
    }

  }


  let navTicking = false;

  function requestNavUpdate() {

    if (navTicking) return;

    navTicking = true;

    window.requestAnimationFrame(() => {

      updateActiveNav();

      navTicking = false;

    });

  }


  window.addEventListener(
    "scroll",
    requestNavUpdate,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    requestNavUpdate,
    { passive: true }
  );


  /* =======================================================
     NAVIGATION CLICK
  ======================================================== */

  navLinks.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const href =
          link.getAttribute("href");

        if (
          !href ||
          !href.startsWith("#")
        ) {
          return;
        }

        const target =
          document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        /*
          Close mobile menu first.
        */

        closeMenu();


        /*
          Update URL without jumping.
        */

        if (
          window.location.hash !== href
        ) {

          history.pushState(
            null,
            "",
            href
          );

        }


        /*
          Respect reduced motion.
        */

        target.scrollIntoView({
          behavior: reducedMotion
            ? "auto"
            : "smooth",

          block: "start"
        });


        /*
          Immediately update underline.
        */

        setActiveNav(
          target.id
        );

      }
    );

  });


  /* =======================================================
     BROWSER BACK / FORWARD
  ======================================================== */

  window.addEventListener(
    "popstate",
    () => {

      const hash =
        window.location.hash;

      if (!hash) {
        setActiveNav("home");
        return;
      }

      const target =
        document.querySelector(hash);

      if (!target) return;

      target.scrollIntoView({
        behavior: reducedMotion
          ? "auto"
          : "smooth",

        block: "start"
      });

      setActiveNav(
        target.id
      );

    }
  );


  /* =======================================================
     INITIAL HASH
  ======================================================== */

  function handleInitialHash() {

    const hash =
      window.location.hash;

    if (!hash) {
      updateActiveNav();
      return;
    }

    const target =
      document.querySelector(hash);

    if (!target) return;

    /*
      Wait until layout is ready.
    */

    window.requestAnimationFrame(() => {

      target.scrollIntoView({
        behavior: "auto",
        block: "start"
      });

      setActiveNav(
        target.id
      );

    });

  }


  /* =======================================================
     EXTERNAL LINK SAFETY
  ======================================================== */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {

      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );

    });


  /* =======================================================
     COPY EMAIL
     
     Supports:
       data-copy="email@example.com"
     
     Optional button:
       <button data-copy="...">Copy email</button>
  ======================================================== */

  async function copyText(text) {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(text);

      return true;

    }


    /*
      Legacy fallback for older browsers.
    */

    const textarea =
      document.createElement("textarea");

    textarea.value = text;

    textarea.setAttribute(
      "readonly",
      ""
    );

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";

    document.body.appendChild(
      textarea
    );

    textarea.select();

    let successful = false;

    try {

      successful =
        document.execCommand("copy");

    } catch {

      successful = false;

    }

    textarea.remove();

    return successful;
  }


  document
    .querySelectorAll("[data-copy]")
    .forEach((element) => {

      element.addEventListener(
        "click",
        async () => {

          const text =
            element.dataset.copy;

          if (!text) return;

          const originalText =
            element.textContent;

          try {

            const copied =
              await copyText(text);

            if (!copied) return;

            element.textContent =
              "Copied";

            window.setTimeout(() => {

              element.textContent =
                originalText;

            }, CONFIG.copyResetDelay);

          } catch {

            /* Ignore clipboard failure. */

          }

        }
      );

    });


  /* =======================================================
     MIDNIGHT REFRESH
     
     Ensures class year changes automatically if the page
     remains open across April 1, 2027.
  ======================================================== */

  function scheduleMidnightUpdate() {

    const now = new Date();

    const tomorrow =
      new Date(now);

    tomorrow.setDate(
      now.getDate() + 1
    );

    tomorrow.setHours(
      0,
      0,
      1,
      0
    );

    const delay =
      tomorrow.getTime() -
      now.getTime();

    window.setTimeout(() => {

      updateClassYear();
      updateYear();

      scheduleMidnightUpdate();

    }, delay);

  }


  /* =======================================================
     VISIBILITY CHANGE
  ======================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState === "visible"
      ) {

        updateClassYear();
        updateYear();
        updateHeader();
        updateActiveNav();

      }

    }
  );


  /* =======================================================
     INITIALIZE
  ======================================================== */

  updateClassYear();

  updateYear();

  updateHeader();

  updateActiveNav();

  handleInitialHash();

  scheduleMidnightUpdate();

})();
