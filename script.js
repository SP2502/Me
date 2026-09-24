"use strict";

/* =========================================================
   SITE CONFIG
   ========================================================= */

const SITE = {
  email: "shreyansh2502@outlook.com",
  github: "https://github.com/SP2502",
  argus: "https://argus-website-nu.vercel.app/"
};


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   CURRENT YEAR
   ========================================================= */

const yearElement = $("[data-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   CLASS AUTO-UPDATE
   Class 11 → Class 12 on April 1, 2027
   ========================================================= */

const classElements = $$("[data-class]");

if (classElements.length) {
  const promotionDate = new Date(2027, 3, 1);
  const currentClass =
    new Date() >= promotionDate ? "12" : "11";

  classElements.forEach((element) => {
    element.textContent = currentClass;
  });
}


/* =========================================================
   HEADER SCROLL STATE
   ========================================================= */

const header = $(".site-header");

const updateHeader = () => {
  if (!header) return;

  header.classList.toggle(
    "scrolled",
    window.scrollY > 16
  );
};

updateHeader();

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton = $(".menu-toggle");
const mobileNavigation = $(".mobile-navigation");

const openMenu = () => {
  if (!menuButton || !mobileNavigation) return;

  mobileNavigation.hidden = false;
  menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
};

const closeMenu = () => {
  if (!menuButton || !mobileNavigation) return;

  mobileNavigation.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

const toggleMenu = () => {
  if (!mobileNavigation) return;

  if (mobileNavigation.hidden) {
    openMenu();
  } else {
    closeMenu();
  }
};

menuButton?.addEventListener(
  "click",
  toggleMenu
);


/* Close mobile menu after navigation */

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});


/* Close with Escape */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  }
);


/* Close when clicking outside */

document.addEventListener(
  "click",
  (event) => {
    if (
      !mobileNavigation ||
      mobileNavigation.hidden ||
      !menuButton
    ) {
      return;
    }

    const clickedInsideMenu =
      mobileNavigation.contains(event.target);

    const clickedButton =
      menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMenu();
    }
  }
);


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
   ========================================================= */

$$('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
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

    if (!target) return;

    event.preventDefault();

    const headerOffset =
      header?.offsetHeight || 0;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffset -
      12;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });

    history.replaceState(
      null,
      "",
      targetId
    );
  });
});


/* =========================================================
   ACTIVE NAVIGATION / SCROLLSPY
   ========================================================= */

const sections = $$(
  "main section[id]"
);

const navigationLinks = $$(
  '.desktop-navigation a[href^="#"], .mobile-navigation a[href^="#"]'
);

const setActiveNavigation = (id) => {
  navigationLinks.forEach((link) => {
    const linkTarget =
      link.getAttribute("href");

    const active =
      linkTarget === `#${id}`;

    link.classList.toggle(
      "active",
      active
    );

    if (active) {
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
};

if (sections.length) {
  const sectionObserver =
    new IntersectionObserver(
      (entries) => {
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

        if (visibleSections.length) {
          setActiveNavigation(
            visibleSections[0].target.id
          );
        }
      },
      {
        rootMargin:
          "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.5]
      }
    );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

document.documentElement.classList.add(
  "js-enabled"
);

const revealElements = $$(
  ".reveal, .project-card, .engineering-card"
);

if (
  "IntersectionObserver" in window &&
  revealElements.length
) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        });
      },
      {
        threshold: 0.12,
        rootMargin:
          "0px 0px -40px 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add(
      "is-visible"
    );
  });
}


/* =========================================================
   PROJECT CARD POINTER EFFECT
   ========================================================= */

const supportsHover =
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

if (supportsHover) {
  $$(".project-card").forEach((card) => {
    card.addEventListener(
      "pointermove",
      (event) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          ((event.clientX - rect.left) /
            rect.width) *
          100;

        const y =
          ((event.clientY - rect.top) /
            rect.height) *
          100;

        card.style.setProperty(
          "--pointer-x",
          `${x}%`
        );

        card.style.setProperty(
          "--pointer-y",
          `${y}%`
        );
      }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.removeProperty(
          "--pointer-x"
        );

        card.style.removeProperty(
          "--pointer-y"
        );
      }
    );
  });
}


/* =========================================================
   COPY EMAIL
   ========================================================= */

const copyEmailButton =
  $("[data-copy-email]");

const copyEmail = async () => {
  if (!copyEmailButton) return;

  try {
    await navigator.clipboard.writeText(
      SITE.email
    );

    const originalText =
      copyEmailButton.textContent;

    copyEmailButton.textContent =
      "Copied";

    copyEmailButton.classList.add(
      "copied"
    );

    window.setTimeout(() => {
      copyEmailButton.textContent =
        originalText;

      copyEmailButton.classList.remove(
        "copied"
      );
    }, 1600);
  } catch {
    window.location.href =
      `mailto:${SITE.email}`;
  }
};

copyEmailButton?.addEventListener(
  "click",
  copyEmail
);


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

$$('a[href^="http"]').forEach((link) => {
  link.setAttribute(
    "target",
    "_blank"
  );

  link.setAttribute(
    "rel",
    "noopener noreferrer"
  );
});


/* =========================================================
   KEYBOARD SHORTCUT
   Home → scroll to top
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    const tag =
      document.activeElement?.tagName;

    const isTyping =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      document.activeElement?.isContentEditable;

    if (isTyping) return;

    if (
      event.key === "Home" &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
);


/* =========================================================
   RESIZE HANDLING
   ========================================================= */

let resizeTimer;

window.addEventListener(
  "resize",
  () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (
        window.innerWidth > 760
      ) {
        closeMenu();
      }
    }, 120);
  },
  { passive: true }
);


/* =========================================================
   REDUCED MOTION
   ========================================================= */

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

if (prefersReducedMotion) {
  document.documentElement.classList.add(
    "reduced-motion"
  );
}
