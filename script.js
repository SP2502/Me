/* =========================================================
   SHREYANSH PARGANIHA — PERSONAL SITE
   Interaction + Navigation
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     01. CONFIG
     ======================================================= */

  const CLASS_12_DATE = new Date("2027-04-01T00:00:00");
  const DEFAULT_CLASS = 11;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     02. HELPERS
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =======================================================
     03. CURRENT CLASS
     ======================================================= */

  function updateCurrentClass() {
    const currentClass =
      new Date() >= CLASS_12_DATE ? 12 : DEFAULT_CLASS;

    $$("[data-current-class]").forEach((element) => {
      element.textContent = currentClass;
    });
  }


  /* =======================================================
     04. CURRENT YEAR
     ======================================================= */

  function updateCurrentYear() {
    const year = new Date().getFullYear();

    $$("[data-current-year]").forEach((element) => {
      element.textContent = year;
    });
  }


  /* =======================================================
     05. CURRENT MONTH / YEAR
     ======================================================= */

  function updateCurrentDate() {
    const dateElement = $(".now .eyebrow");

    if (!dateElement) return;

    const now = new Date();

    const formatted = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(now);

    dateElement.textContent = formatted;
  }


  /* =======================================================
     06. MOBILE NAVIGATION
     ======================================================= */

  const menuButton = $(".menu-toggle");
  const navigation = $(".site-nav");

  function setMenu(open) {
    if (!menuButton || !navigation) return;

    document.body.classList.toggle("menu-open", open);
    navigation.classList.toggle("is-open", open);

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation"
    );
  }

  function toggleMenu() {
    if (!navigation) return;

    const isOpen =
      navigation.classList.contains("is-open");

    setMenu(!isOpen);
  }

  if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
  }


  /* Close menu when navigation link is clicked */

  $$(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
    });
  });


  /* Close with Escape */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });


  /* Close if resized to desktop */

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 720) {
        setMenu(false);
      }
    },
    { passive: true }
  );


  /* =======================================================
     07. ACTIVE NAVIGATION
     ======================================================= */

  const navLinks = $$(".site-nav a");
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;

          navLinks.forEach((link) => {
            const target = link.getAttribute("href");

            link.classList.toggle(
              "is-active",
              target === `#${id}`
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
      navObserver.observe(section);
    });
  }


  /* =======================================================
     08. SCROLL REVEAL
     ======================================================= */

  const revealSelectors = [
    ".section-header",
    ".thinking-description",
    ".learning-process li",
    ".about-block",
    ".question-item",
    ".project",
    ".technical-row",
    ".now-item",
    ".outside-item",
    ".contact-content"
  ];

  const revealElements = $$(revealSelectors.join(","));

  revealElements.forEach((element) => {
    element.classList.add("js-reveal");
  });

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            const siblings = [
              ...element.parentElement.children
            ];

            const index = siblings.indexOf(element);

            const delay =
              Math.min(Math.max(index, 0), 5) * 55;

            element.style.transitionDelay =
              `${delay}ms`;

            element.classList.add("is-visible");

            observer.unobserve(element);
          });
        },
        {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.05
        }
      );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* =======================================================
     09. SMOOTH ANCHOR NAVIGATION
     ======================================================= */

  const header = $(".site-header");

  function getHeaderHeight() {
    return header
      ? header.getBoundingClientRect().height
      : 0;
  }

  function scrollToTarget(target) {
    if (!target) return;

    const headerHeight = getHeaderHeight();

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      20;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      setMenu(false);

      scrollToTarget(target);

      try {
        history.replaceState(
          null,
          "",
          href
        );
      } catch {
        /* Ignore history API errors */
      }
    });
  });


  /* =======================================================
     10. INITIAL HASH
     ======================================================= */

  function handleInitialHash() {
    const hash = window.location.hash;

    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);

    if (!target) return;

    setTimeout(() => {
      scrollToTarget(target);
    }, 80);
  }


  /* =======================================================
     11. COPY EMAIL
     ======================================================= */

  const copyButtons = $$(".copy-email");

  async function copyText(text) {
    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea =
      document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    let success = false;

    try {
      success =
        document.execCommand("copy");
    } catch {
      success = false;
    }

    textarea.remove();

    return success;
  }

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const email =
        button.dataset.email ||
        button.textContent.trim();

      const originalText =
        button.textContent;

      try {
        const success =
          await copyText(email);

        if (!success) return;

        button.classList.add("copied");

        button.textContent = "Copied";

        setTimeout(() => {
          button.textContent =
            originalText;

          button.classList.remove(
            "copied"
          );
        }, 1500);

      } catch {
        /* Clipboard unavailable */
      }
    });
  });


  /* =======================================================
     12. EXTERNAL LINKS
     ======================================================= */

  $$("a[target='_blank']").forEach((link) => {
    const existing =
      link.getAttribute("rel") || "";

    const values =
      new Set(existing.split(/\s+/).filter(Boolean));

    values.add("noopener");
    values.add("noreferrer");

    link.setAttribute(
      "rel",
      [...values].join(" ")
    );
  });


  /* =======================================================
     13. HERO SYSTEM VISUAL
     ======================================================= */

  const systemVisual =
    $(".system-visual");

  /*
   * Subtle pointer interaction only on devices
   * that actually have a fine pointer.
   *
   * This prevents Android touch devices from
   * receiving unnecessary mouse calculations.
   */

  const hasFinePointer =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

  if (
    systemVisual &&
    hasFinePointer &&
    !reducedMotion
  ) {
    systemVisual.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          systemVisual.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const rotateX =
          (0.5 - y) * 4;

        const rotateY =
          (x - 0.5) * 4;

        systemVisual.style.transform =
          `perspective(800px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)`;
      }
    );

    systemVisual.addEventListener(
      "pointerleave",
      () => {
        systemVisual.style.transform =
          "perspective(800px) rotateX(0deg) rotateY(0deg)";
      }
    );
  }


  /* =======================================================
     14. ARCHITECTURE NODE INTERACTION
     ======================================================= */

  $$(".architecture-node").forEach((node) => {
    node.addEventListener("mouseenter", () => {
      node.style.borderColor =
        "rgba(185, 214, 200, 0.45)";
    });

    node.addEventListener("mouseleave", () => {
      node.style.borderColor = "";
    });
  });


  /* =======================================================
     15. PAGE VISIBILITY
     ======================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        setMenu(false);
      }
    }
  );


  /* =======================================================
     16. SAFER MOBILE HEIGHT HANDLING
     ======================================================= */

  /*
   * Some Android browsers report viewport changes
   * when their browser controls appear/disappear.
   *
   * We expose the actual viewport height as a CSS
   * variable without forcing the layout to depend
   * on it.
   */

  function updateViewportUnit() {
    const viewportHeight =
      window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

    document.documentElement.style.setProperty(
      "--app-height",
      `${viewportHeight}px`
    );
  }

  updateViewportUnit();

  window.addEventListener(
    "resize",
    updateViewportUnit,
    { passive: true }
  );

  if (window.visualViewport) {
    window.visualViewport.addEventListener(
      "resize",
      updateViewportUnit,
      { passive: true }
    );
  }


  /* =======================================================
     17. INITIALIZE
     ======================================================= */

  updateCurrentClass();
  updateCurrentYear();
  updateCurrentDate();

  handleInitialHash();

});
