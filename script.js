/* =========================================================
   SHREYANSH PARGANIHA
   Personal Website — Main JavaScript
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     01. DOM READY
  ======================================================= */

  document.addEventListener("DOMContentLoaded", init);


  function init() {

    /* =====================================================
       02. ELEMENTS
    ===================================================== */

    const html = document.documentElement;
    const header = document.querySelector(".site-header");

    const menuToggle =
      document.querySelector(".menu-toggle");

    const navLinks =
      document.querySelector(".nav-links");

    const currentClassElements =
      document.querySelectorAll(
        "[data-current-class]"
      );

    const currentYearElements =
      document.querySelectorAll(
        "[data-current-year]"
      );

    const navItems =
      document.querySelectorAll(
        '.nav-links a[href^="#"]'
      );

    const sections =
      document.querySelectorAll(
        "main section[id]"
      );

    const copyButtons =
      document.querySelectorAll(
        "[data-copy-email]"
      );


    /* =====================================================
       03. DYNAMIC CLASS
       
       Class 11 until:
       April 1, 2027

       Then automatically:
       Class 12
    ===================================================== */

    function updateCurrentClass() {
      const now = new Date();

      const class12Start =
        new Date("2027-04-01T00:00:00");

      const currentClass =
        now >= class12Start ? "12" : "11";

      currentClassElements.forEach(
        (element) => {
          element.textContent =
            currentClass;
        }
      );
    }


    /* =====================================================
       04. DYNAMIC YEAR
    ===================================================== */

    function updateYear() {
      const year =
        new Date().getFullYear();

      currentYearElements.forEach(
        (element) => {
          element.textContent = year;
        }
      );
    }


    /* =====================================================
       05. HEADER SCROLL STATE
    ===================================================== */

    function updateHeader() {
      if (!header) return;

      header.classList.toggle(
        "scrolled",
        window.scrollY > 20
      );
    }

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );


    /* =====================================================
       06. MOBILE NAVIGATION
    ===================================================== */

    function closeMenu() {
      if (!menuToggle || !navLinks) {
        return;
      }

      navLinks.classList.remove(
        "is-open"
      );

      menuToggle.classList.remove(
        "is-open"
      );

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

      html.classList.remove(
        "menu-open"
      );
    }


    function openMenu() {
      if (!menuToggle || !navLinks) {
        return;
      }

      navLinks.classList.add(
        "is-open"
      );

      menuToggle.classList.add(
        "is-open"
      );

      menuToggle.setAttribute(
        "aria-expanded",
        "true"
      );

      menuToggle.setAttribute(
        "aria-label",
        "Close navigation"
      );

      html.classList.add(
        "menu-open"
      );
    }


    if (menuToggle && navLinks) {

      menuToggle.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          const isOpen =
            navLinks.classList.contains(
              "is-open"
            );

          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        }
      );


      navLinks.addEventListener(
        "click",
        (event) => {

          const link =
            event.target.closest("a");

          if (link) {
            closeMenu();
          }
        }
      );


      document.addEventListener(
        "click",
        (event) => {

          if (
            !navLinks.classList.contains(
              "is-open"
            )
          ) {
            return;
          }

          if (
            !navLinks.contains(
              event.target
            ) &&
            !menuToggle.contains(
              event.target
            )
          ) {
            closeMenu();
          }
        }
      );


      document.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Escape"
          ) {
            closeMenu();
          }
        }
      );


      window.addEventListener(
        "resize",
        () => {

          if (
            window.innerWidth > 700
          ) {
            closeMenu();
          }
        }
      );
    }


    /* =====================================================
       07. ACTIVE NAVIGATION
    ===================================================== */

    function updateActiveNavigation() {

      if (
        !sections.length ||
        !navItems.length
      ) {
        return;
      }

      const position =
        window.scrollY + 180;

      let activeSection = "";

      sections.forEach(
        (section) => {

          const top =
            section.offsetTop;

          const bottom =
            top + section.offsetHeight;

          if (
            position >= top &&
            position < bottom
          ) {
            activeSection =
              section.id;
          }
        }
      );


      navItems.forEach(
        (link) => {

          const target =
            link.getAttribute("href");

          link.classList.toggle(
            "active",
            target ===
              `#${activeSection}`
          );
        }
      );
    }

    updateActiveNavigation();

    window.addEventListener(
      "scroll",
      updateActiveNavigation,
      { passive: true }
    );


    /* =====================================================
       08. SMOOTH NAVIGATION
    ===================================================== */

    navItems.forEach(
      (link) => {

        link.addEventListener(
          "click",
          (event) => {

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
              18;

            window.scrollTo({
              top: Math.max(
                0,
                targetPosition
              ),
              behavior: "smooth"
            });


            /*
             * Update URL without causing
             * a second browser jump.
             */

            try {
              history.pushState(
                null,
                "",
                targetId
              );
            } catch {
              /* Ignore unsupported history API */
            }
          }
        );
      }
    );


    /* =====================================================
       09. COPY EMAIL
    ===================================================== */

    copyButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          async () => {

            const email =
              button.getAttribute(
                "data-copy-email"
              );

            if (!email) {
              return;
            }

            const originalText =
              button.querySelector(
                "span:last-child"
              );

            if (!originalText) {
              return;
            }

            const previousText =
              originalText.textContent;


            try {

              if (
                navigator.clipboard &&
                window.isSecureContext
              ) {

                await navigator.clipboard
                  .writeText(email);

              } else {

                /*
                 * Legacy fallback.
                 */

                const textarea =
                  document.createElement(
                    "textarea"
                  );

                textarea.value = email;

                textarea.setAttribute(
                  "readonly",
                  ""
                );

                textarea.style.position =
                  "fixed";

                textarea.style.opacity =
                  "0";

                document.body.appendChild(
                  textarea
                );

                textarea.select();

                document.execCommand(
                  "copy"
                );

                textarea.remove();
              }


              button.classList.add(
                "copied"
              );

              originalText.textContent =
                "Email copied";


              window.setTimeout(
                () => {

                  button.classList.remove(
                    "copied"
                  );

                  originalText.textContent =
                    previousText;

                },
                1800
              );

            } catch {

              originalText.textContent =
                "Copy failed";

              window.setTimeout(
                () => {
                  originalText.textContent =
                    previousText;
                },
                1800
              );
            }
          }
        );
      }
    );


    /* =====================================================
       10. EXTERNAL LINK SECURITY
    ===================================================== */

    document
      .querySelectorAll(
        'a[target="_blank"]'
      )
      .forEach(
        (link) => {

          const rel =
            new Set(
              (
                link.getAttribute(
                  "rel"
                ) || ""
              )
                .split(/\s+/)
                .filter(Boolean)
            );

          rel.add("noopener");
          rel.add("noreferrer");

          link.setAttribute(
            "rel",
            [...rel].join(" ")
          );
        }
      );


    /* =====================================================
       11. HERO SYSTEM INTERACTION
       
       Extremely subtle.
       No cursor-following effects.
       No expensive animation.
    ===================================================== */

    const heroSystem =
      document.querySelector(
        ".hero-system"
      );

    if (heroSystem) {

      const nodes =
        heroSystem.querySelectorAll(
          ".system-node"
        );

      nodes.forEach(
        (node) => {

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
        }
      );
    }


    /* =====================================================
       12. NO SCROLL-REVEAL SYSTEM
       
       IMPORTANT:
       
       We deliberately do NOT add:
       
       .reveal-ready
       .reveal-target
       .is-visible
       
       The website must remain visible even if
       JavaScript loads late or fails.
    ===================================================== */


    /* =====================================================
       13. INITIALIZE
    ===================================================== */

    updateCurrentClass();
    updateYear();
    updateHeader();
    updateActiveNavigation();


    /* =====================================================
       14. HANDLE BACK/FORWARD NAVIGATION
    ===================================================== */

    window.addEventListener(
      "popstate",
      () => {

        const hash =
          window.location.hash;

        if (!hash) {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

          return;
        }

        const target =
          document.querySelector(hash);

        if (!target) {
          return;
        }

        const headerHeight =
          header
            ? header.offsetHeight
            : 0;

        window.scrollTo({
          top:
            target.offsetTop -
            headerHeight -
            18,

          behavior: "smooth"
        });

      }
    );


    /* =====================================================
       15. REFRESH CLASS/YEAR PERIODICALLY
    ===================================================== */

    window.setInterval(
      () => {
        updateCurrentClass();
        updateYear();
      },
      60 * 60 * 1000
    );

  }


  /* =======================================================
     16. CACHE / SERVICE WORKER CLEANUP
     
     This does NOT control the browser's normal HTTP cache.
     
     It does:
       - remove existing service workers
       - delete CacheStorage entries
     
     This prevents an old service worker/cache from
     unexpectedly serving an old version of the site.
  ======================================================= */

  async function cleanRuntimeCaches() {

    try {

      if (
        "serviceWorker" in navigator
      ) {

        const registrations =
          await navigator.serviceWorker
            .getRegistrations();

        for (
          const registration
          of registrations
        ) {

          await registration.unregister();
        }
      }


      if (
        "caches" in window
      ) {

        const cacheNames =
          await caches.keys();

        await Promise.all(
          cacheNames.map(
            (cacheName) =>
              caches.delete(
                cacheName
              )
          )
        );
      }

    } catch {
      /*
       * Cache cleanup is best-effort.
       * Never allow it to break the website.
       */
    }
  }


  /*
   * Run cleanup independently.
   * It does not block page rendering.
   */

  cleanRuntimeCaches();

})();
