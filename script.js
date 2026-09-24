/* =========================================================
   SHREYANSH PARGANIHA — PORTFOLIO
   Organic interaction layer
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     ELEMENTS
  ======================================================== */

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const copyButton = document.querySelector("[data-copy-email]");
  const yearElement = document.querySelector("[data-current-year]");


  /* =======================================================
     UTILITIES
  ======================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     DYNAMIC YEAR
  ======================================================== */

  const updateYear = () => {
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  updateYear();


  /* =======================================================
     HEADER DEPTH
     
     The header becomes slightly more defined after the user
     begins moving through the page.
  ======================================================== */

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 24
    );
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================== */

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("is-open");
    navigation.classList.remove("is-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation"
    );

    document.body.classList.remove("menu-open");
  };


  const openMenu = () => {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.add("is-open");
    navigation.classList.add("is-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute(
      "aria-label",
      "Close navigation"
    );

    document.body.classList.add("menu-open");
  };


  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      isOpen ? closeMenu() : openMenu();
    });
  }


  /* =======================================================
     ORGANIC INTERNAL NAVIGATION
     
     Uses native smooth scrolling instead of hijacking the
     browser's scrolling behaviour.
  ======================================================== */

  const scrollToTarget = (target) => {
    if (!target) return;

    const headerHeight =
      header?.getBoundingClientRect().height || 0;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      18;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth"
    });
  };


  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      closeMenu();

      scrollToTarget(target);

      /*
       * Update the URL without causing a browser jump.
       */
      if (history.replaceState) {
        history.replaceState(
          null,
          "",
          href
        );
      }
    });
  });


  /* =======================================================
     HERO / PROJECT / INTERNAL LINKS
  ======================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      /*
       * Navigation links are already handled above.
       */
      if (link.closest(".nav-links")) return;

      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        event.preventDefault();

        scrollToTarget(target);

        if (history.replaceState) {
          history.replaceState(
            null,
            "",
            href
          );
        }
      });
    });


  /* =======================================================
     SECTION AWARE NAVIGATION
     
     The navigation quietly follows the section currently
     occupying the reading area.
  ======================================================== */

  const sections = [
    ...document.querySelectorAll(
      "#about, #questions, #projects, #contact"
    )
  ];

  if (sections.length && navLinks.length) {

    const sectionObserver = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          navLinks.forEach((link) => {
            const active =
              link.getAttribute("href") === `#${id}`;

            link.classList.toggle(
              "is-active",
              active
            );
          });
        });

      },
      {
        root: null,

        /*
         * The active state changes when a section enters
         * roughly the middle of the viewport.
         */
        rootMargin: "-38% 0px -52% 0px",

        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =======================================================
     ORGANIC CONTENT REVEALS
     
     Small reveals only. No giant slide-ins, no dramatic
     animation. Content should feel like it is settling into
     place rather than performing.
  ======================================================== */

  const revealGroups = [
    ".learning-step",
    ".question-item",
    ".project",
    ".foundation-item",
    ".outside-item",
    ".exploring-list p",
    ".contact-link"
  ];

  if (!prefersReducedMotion) {

    const revealItems = document.querySelectorAll(
      revealGroups.join(", ")
    );

    revealItems.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform =
        "translate3d(0, 18px, 0)";
      element.style.transition =
        "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), " +
        "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)";
      element.style.transitionDelay =
        `${Math.min(index % 5, 4) * 45}ms`;
      element.style.willChange =
        "opacity, transform";
    });


    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            requestAnimationFrame(() => {
              element.style.opacity = "1";
              element.style.transform =
                "translate3d(0, 0, 0)";
            });

            element.addEventListener(
              "transitionend",
              () => {
                element.style.willChange = "auto";
              },
              { once: true }
            );

            observer.unobserve(element);
          });

        },
        {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.08
        }
      );


    revealItems.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* =======================================================
     PROJECT MICRO-INTERACTION
     
     Very subtle horizontal movement on larger screens.
     Disabled on touch/reduced-motion environments.
  ======================================================== */

  const canHover =
    window.matchMedia("(hover: hover) and (pointer: fine)")
      .matches;

  if (canHover && !prefersReducedMotion) {

    document
      .querySelectorAll(".project")
      .forEach((project) => {

        const story =
          project.querySelector(".project-story");

        if (!story) return;

        project.addEventListener(
          "pointermove",
          (event) => {

            const rect =
              project.getBoundingClientRect();

            const relativeX =
              (event.clientX - rect.left) /
              rect.width;

            /*
             * Extremely restrained movement.
             * Maximum ~2px.
             */
            const offset =
              (relativeX - 0.5) * 4;

            story.style.transform =
              `translate3d(${offset}px, 0, 0)`;
          }
        );

        project.addEventListener(
          "pointerleave",
          () => {
            story.style.transform =
              "translate3d(0, 0, 0)";
          }
        );
      });
  }


  /* =======================================================
     COPY EMAIL
  ======================================================== */

  if (copyButton) {

    const email =
      copyButton.dataset.copyEmail;

    const originalText =
      copyButton.textContent;

    const setCopiedState = () => {

      copyButton.textContent =
        "Copied";

      copyButton.classList.add("is-copied");

      window.setTimeout(() => {

        copyButton.textContent =
          originalText;

        copyButton.classList.remove(
          "is-copied"
        );

      }, 1800);
    };


    copyButton.addEventListener(
      "click",
      async () => {

        if (!email) return;

        try {

          if (
            navigator.clipboard &&
            window.isSecureContext
          ) {
            await navigator.clipboard.writeText(
              email
            );
          } else {

            const textarea =
              document.createElement("textarea");

            textarea.value = email;

            textarea.setAttribute(
              "readonly",
              ""
            );

            textarea.style.position =
              "fixed";

            textarea.style.opacity = "0";

            document.body.appendChild(
              textarea
            );

            textarea.select();

            document.execCommand(
              "copy"
            );

            textarea.remove();
          }

          setCopiedState();

        } catch {
          copyButton.textContent =
            "Select email manually";

          window.setTimeout(() => {
            copyButton.textContent =
              originalText;
          }, 1800);
        }
      }
    );
  }


  /* =======================================================
     EXTERNAL LINK SAFETY
  ======================================================== */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {

      const rel =
        new Set(
          (link.getAttribute("rel") || "")
            .split(/\s+/)
            .filter(Boolean)
        );

      rel.add("noopener");
      rel.add("noreferrer");

      link.setAttribute(
        "rel",
        [...rel].join(" ")
      );
    });


  /* =======================================================
     KEYBOARD ESCAPE
  ======================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        navigation?.classList.contains("is-open")
      ) {
        closeMenu();
        menuToggle?.focus();
      }
    }
  );


  /* =======================================================
     CLOSE MOBILE MENU WHEN RESIZING
  ======================================================== */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 640 &&
        navigation?.classList.contains("is-open")
      ) {
        closeMenu();
      }

    },
    { passive: true }
  );


  /* =======================================================
     PAGE LOAD STATE
     
     Prevents a flash of unfinished interaction while keeping
     the actual hero immediately visible.
  ======================================================== */

  requestAnimationFrame(() => {
    document.documentElement.classList.add(
      "page-ready"
    );
  });


  /* =======================================================
     PERIODIC DATE UPDATE
     
     Handles a page left open across midnight/year changes.
  ======================================================== */

  window.setInterval(
    updateYear,
    60 * 60 * 1000
  );

});
