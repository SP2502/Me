/* =========================================================
   SHREYANSH PARGANIHA — PORTFOLIO
   Browser-optimized interaction layer

   Targets:
   - Chromium / Chrome / Edge
   - Firefox
   - Safari / WebKit
   - iOS Safari

   Principles:
   - No frameworks
   - No dependencies
   - No continuous scroll calculations
   - IntersectionObserver where available
   - Native browser APIs first
   - Graceful fallbacks
   - Reduced-motion aware
   - Touch friendly
========================================================= */

"use strict";


/* =========================================================
   BROWSER / FEATURE DETECTION
========================================================= */

const root = document.documentElement;

const browser = {
  chrome:
    /Chrome|Chromium|Edg\//.test(navigator.userAgent) &&
    !/OPR\//.test(navigator.userAgent),

  firefox:
    /Firefox\//.test(navigator.userAgent),

  safari:
    /Safari\//.test(navigator.userAgent) &&
    !/Chrome|Chromium|Edg\//.test(navigator.userAgent),

  ios:
    /iPhone|iPad|iPod/.test(navigator.userAgent),

  reducedMotion:
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches ?? false,

  intersectionObserver:
    "IntersectionObserver" in window,

  clipboard:
    !!navigator.clipboard &&
    window.isSecureContext === true,

  smoothScroll:
    "scrollBehavior" in document.documentElement.style
};


/* =========================================================
   DEVICE CLASS
========================================================= */

const coarsePointer =
  window.matchMedia?.(
    "(pointer: coarse)"
  ).matches ?? false;

const smallScreen =
  window.matchMedia?.(
    "(max-width: 700px)"
  ).matches ?? false;

root.classList.toggle(
  "is-touch",
  coarsePointer
);

root.classList.toggle(
  "is-mobile",
  smallScreen
);

root.classList.toggle(
  "reduced-motion",
  browser.reducedMotion
);

root.classList.toggle(
  "browser-safari",
  browser.safari
);

root.classList.toggle(
  "browser-firefox",
  browser.firefox
);

root.classList.toggle(
  "browser-chromium",
  browser.chrome
);


/* =========================================================
   DOM REFERENCES
========================================================= */

const header =
  document.querySelector(".site-header");

const menuToggle =
  document.querySelector(".menu-toggle");

const navLinks =
  document.querySelector(".nav-links");

const emailButton =
  document.querySelector(".email-copy");

const copyLabel =
  document.querySelector("[data-copy-label]");

const yearElement =
  document.querySelector("[data-year]");


/* =========================================================
   YEAR
========================================================= */

if (yearElement) {
  yearElement.textContent =
    String(new Date().getFullYear());
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

if (menuToggle && navLinks) {

  const closeMenu = () => {
    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    navLinks.classList.remove("open");
  };


  const openMenu = () => {
    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    navLinks.classList.add("open");
  };


  menuToggle.addEventListener(
    "click",
    () => {

      const open =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";

      if (open) {
        closeMenu();
      } else {
        openMenu();
      }

    }
  );


  /*
   * Navigation links.
   */

  navLinks
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  /*
   * Escape closes the mobile menu.
   */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true"
      ) {
        closeMenu();
        menuToggle.focus();
      }

    }
  );


  /*
   * Close menu if viewport becomes desktop-sized.
   *
   * This matters when rotating an iPad/iPhone.
   */

  const navigationMedia =
    window.matchMedia(
      "(min-width: 701px)"
    );

  const handleNavigationResize =
    (event) => {

      if (event.matches) {
        closeMenu();
      }

    };


  if (navigationMedia.addEventListener) {
    navigationMedia.addEventListener(
      "change",
      handleNavigationResize
    );
  } else {
    /* Firefox ESR / older Safari fallback */
    navigationMedia.addListener(
      handleNavigationResize
    );
  }
}


/* =========================================================
   HEADER STATE
========================================================= */

/*
 * IMPORTANT:
 *
 * We deliberately do NOT run:
 *
 * window.addEventListener("scroll", ...)
 *
 * on every frame.
 *
 * IntersectionObserver lets the browser handle this efficiently.
 */

if (header) {

  if (browser.intersectionObserver) {

    const sentinel =
      document.createElement("div");

    sentinel.setAttribute(
      "aria-hidden",
      "true"
    );

    sentinel.style.cssText = `
      position:absolute;
      top:0;
      left:0;
      width:1px;
      height:1px;
      pointer-events:none;
    `;

    document.body.prepend(sentinel);


    const headerObserver =
      new IntersectionObserver(
        ([entry]) => {

          header.classList.toggle(
            "scrolled",
            !entry.isIntersecting
          );

        },
        {
          threshold: 0
        }
      );


    headerObserver.observe(sentinel);

  } else {

    /*
     * Extremely old-browser fallback.
     *
     * Passive listener prevents blocking the
     * browser's scrolling pipeline.
     */

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

          header.classList.toggle(
            "scrolled",
            window.scrollY > 8
          );

          ticking = false;

        });

      },
      {
        passive: true
      }
    );
  }
}


/* =========================================================
   INTERNAL NAVIGATION
========================================================= */

document.addEventListener(
  "click",
  (event) => {

    /*
     * Only handle normal left-click navigation.
     */

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }


    const link =
      event.target.closest(
        'a[href^="#"]'
      );

    if (!link) return;


    const selector =
      link.getAttribute("href");

    if (
      !selector ||
      selector === "#" ||
      selector.length < 2
    ) {
      return;
    }


    let target;

    try {
      target =
        document.querySelector(selector);
    } catch {
      return;
    }


    if (!target) return;


    event.preventDefault();


    /*
     * Native scrolling is preferred.
     */

    if (
      browser.smoothScroll &&
      !browser.reducedMotion
    ) {

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } else {

      /*
       * Safari / reduced-motion fallback.
       */

      target.scrollIntoView({
        block: "start"
      });

    }


    /*
     * Update URL without triggering
     * another navigation.
     */

    try {
      history.pushState(
        null,
        "",
        selector
      );
    } catch {
      /* Ignore restricted environments. */
    }

  }
);


/* =========================================================
   EMAIL COPY
========================================================= */

if (emailButton) {

  let copyTimer = null;


  const setCopyLabel = (text) => {

    if (!copyLabel) return;

    copyLabel.textContent = text;

    clearTimeout(copyTimer);

    copyTimer = setTimeout(
      () => {
        copyLabel.textContent = "Copy";
      },
      1800
    );

  };


  const legacyCopy = (value) => {

    const textarea =
      document.createElement("textarea");

    textarea.value = value;

    textarea.setAttribute(
      "readonly",
      ""
    );

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(
      textarea
    );


    /*
     * iOS Safari requires selection in
     * a slightly different way.
     */

    textarea.focus();
    textarea.select();

    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(
        0,
        textarea.value.length
      );
    }


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
  };


  emailButton.addEventListener(
    "click",
    async () => {

      const email =
        emailButton.dataset.copyEmail;

      if (!email) return;


      /*
       * Chromium / Firefox / modern Safari.
       */

      if (browser.clipboard) {

        try {

          await navigator.clipboard.writeText(
            email
          );

          setCopyLabel("Copied");

          return;

        } catch {
          /*
           * Safari can reject clipboard writes
           * depending on context.
           *
           * Fall through to legacy method.
           */
        }
      }


      /*
       * Firefox / Safari / restricted contexts.
       */

      if (legacyCopy(email)) {
        setCopyLabel("Copied");
      } else {
        setCopyLabel("Select email");
      }

    }
  );
}


/* =========================================================
   EXTERNAL LINKS
========================================================= */

document
  .querySelectorAll(
    'a[target="_blank"]'
  )
  .forEach((link) => {

    link.setAttribute(
      "rel",
      "noopener noreferrer"
    );

  });


/* =========================================================
   REVEAL SYSTEM
========================================================= */

/*
 * No animation framework.
 *
 * No continuous scroll calculations.
 *
 * Elements are observed once and then removed
 * from observation.
 */

const revealElements =
  document.querySelectorAll(
    [
      ".process-item",
      ".question",
      ".project",
      ".foundation-grid article",
      ".outside-grid article"
    ].join(",")
  );


if (
  revealElements.length &&
  !browser.reducedMotion
) {

  const style =
    document.createElement("style");

  style.textContent = `
    html.js-enabled .js-reveal {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }

    html.js-enabled .js-reveal.is-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);

      transition:
        opacity .7s cubic-bezier(.22,1,.36,1),
        transform .7s cubic-bezier(.22,1,.36,1);

      will-change: opacity, transform;
    }

    @media (prefers-reduced-motion: reduce) {
      html.js-enabled .js-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);


  revealElements.forEach(
    (element) => {
      element.classList.add(
        "js-reveal"
      );
    }
  );


  if (browser.intersectionObserver) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                "is-visible"
              );


              /*
               * Once visible, stop observing.
               *
               * This is important for long pages.
               */

              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.06,
          rootMargin:
            "0px 0px -35px 0px"
        }
      );


    revealElements.forEach(
      (element) => {
        revealObserver.observe(
          element
        );
      }
    );

  } else {

    /*
     * If IntersectionObserver is unavailable,
     * show everything rather than running an
     * expensive scroll animation system.
     */

    revealElements.forEach(
      (element) => {
        element.classList.add(
          "is-visible"
        );
      }
    );

  }

} else {

  /*
   * Reduced-motion users should never get
   * invisible content waiting for animation.
   */

  revealElements.forEach(
    (element) => {
      element.classList.add(
        "is-visible"
      );
  });

}


/* =========================================================
   HORIZONTAL SYSTEM DIAGRAMS
========================================================= */

const horizontalFlows =
  document.querySelectorAll(
    ".architecture-flow, .content-flow"
  );


/*
 * Desktop trackpad / mouse wheel support.
 *
 * IMPORTANT:
 * Do not install this behavior on touch devices.
 *
 * Native horizontal scrolling is significantly better
 * on iOS Safari and Android browsers.
 */

if (!coarsePointer) {

  horizontalFlows.forEach(
    (container) => {

      container.addEventListener(
        "wheel",
        (event) => {

          if (
            container.scrollWidth <=
            container.clientWidth
          ) {
            return;
          }


          /*
           * If the user is already using horizontal
           * scrolling, don't interfere.
           */

          if (
            Math.abs(event.deltaX) >
            Math.abs(event.deltaY)
          ) {
            return;
          }


          event.preventDefault();


          container.scrollLeft +=
            event.deltaY;

        },
        {
          passive: false
        }
      );

    }
  );
}


/* =========================================================
   PREVENT DRAGGING OF UI NODES
========================================================= */

document
  .querySelectorAll(
    ".architecture-node, .content-flow-item"
  )
  .forEach(
    (element) => {

      element.setAttribute(
        "draggable",
        "false"
      );

    }
  );


/* =========================================================
   IMAGE / MEDIA OPTIMIZATION
========================================================= */

/*
 * Your current HTML does not contain images,
 * but this makes future additions safer.
 */

document
  .querySelectorAll("img")
  .forEach((image, index) => {

    /*
     * Never lazy-load the first visual.
     */

    if (index === 0) {
      image.loading = "eager";
      image.fetchPriority = "high";
    } else {
      image.loading = "lazy";
      image.decoding = "async";
    }


    /*
     * Safari / Chromium / Firefox all understand
     * async image decoding.
     */

    image.decoding = "async";

  });


/* =========================================================
   PAGE VISIBILITY
========================================================= */

/*
 * Don't run unnecessary visual work when the
 * browser has put the tab in the background.
 *
 * This is mainly useful for future extensions.
 */

document.addEventListener(
  "visibilitychange",
  () => {

    root.classList.toggle(
      "page-hidden",
      document.hidden
    );

  }
);


/* =========================================================
   BROWSER READY
========================================================= */

root.classList.add(
  "js-enabled"
);
