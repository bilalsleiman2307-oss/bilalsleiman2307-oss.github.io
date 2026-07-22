const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileSubmenuButton = document.querySelector("[data-mobile-submenu-button]");
const mobileSubmenu = document.querySelector("[data-mobile-submenu]");
const locksmithMenuButton = document.querySelector(".menu-toggle");
const locksmithMenu = document.querySelector(".main-nav");

if (locksmithMenuButton && locksmithMenu) {
  locksmithMenuButton.addEventListener("click", () => {
    const isOpen = locksmithMenuButton.getAttribute("aria-expanded") === "true";
    locksmithMenuButton.setAttribute("aria-expanded", String(!isOpen));
    locksmithMenu.classList.toggle("is-open", !isOpen);
  });
  locksmithMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      locksmithMenuButton.setAttribute("aria-expanded", "false");
      locksmithMenu.classList.remove("is-open");
    }
  });
}

document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
  const toggle = switcher.querySelector(".language-toggle");
  const menu = switcher.querySelector(".language-menu");
  const links = [...switcher.querySelectorAll(".language-menu a")];
  if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement) || links.length === 0) return;

  const open = (focusIndex = null) => {
    switcher.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    if (focusIndex !== null) window.requestAnimationFrame(() => links.at(focusIndex)?.focus());
  };

  const close = (returnFocus = false) => {
    switcher.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") close();
    else open();
  });

  switcher.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") open();
  });

  switcher.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && !switcher.contains(document.activeElement)) close();
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      open(0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      open(-1);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    }
  });

  menu.addEventListener("keydown", (event) => {
    const currentIndex = links.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      links[(currentIndex + 1) % links.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      links[(currentIndex - 1 + links.length) % links.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      links[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      links.at(-1)?.focus();
    }
  });

  switcher.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!switcher.contains(document.activeElement)) close();
    }, 0);
  });

  document.addEventListener("click", (event) => {
    if (!switcher.contains(event.target)) close();
  });
});

window.addEventListener("load", () => {
  if (!document.documentElement.lang.toLowerCase().startsWith("de")) return;
  if (/bot|crawler|spider/i.test(navigator.userAgent)) return;

  const storageKey = "trust-language-suggestion-dismissed";
  try {
    if (window.localStorage.getItem(storageKey) === "true") return;
  } catch {
    // The notice can still be used when storage is unavailable.
  }

  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  const preferredLanguage = browserLanguages
    .map((language) => String(language).toLowerCase().split("-")[0])
    .find((language) => ["de", "en", "es", "pt"].includes(language));

  if (!preferredLanguage || preferredLanguage === "de") return;

  const suggestions = {
    en: {
      text: "This page is also available in English.",
      linkText: "View English version",
      stayText: "Stay in German",
      href: "/en/locksmith-berlin/",
      label: "English language suggestion"
    },
    es: {
      text: "Esta página también está disponible en español.",
      linkText: "Ver la versión en español",
      stayText: "Continuar en alemán",
      href: "/es/cerrajero-berlin/",
      label: "Sugerencia de idioma español"
    },
    pt: {
      text: "Esta página também está disponível em português.",
      linkText: "Ver versão em português",
      stayText: "Continuar em alemão",
      href: "/pt/chaveiro-berlim/",
      label: "Sugestão de idioma português"
    }
  };
  const suggestion = suggestions[preferredLanguage];
  if (!suggestion) return;

  const notice = document.createElement("aside");
  notice.className = "language-suggestion";
  notice.setAttribute("role", "region");
  notice.setAttribute("aria-label", suggestion.label);
  notice.innerHTML = `<p>${suggestion.text}</p><div class="language-suggestion-actions"><a href="${suggestion.href}">${suggestion.linkText}</a><button type="button">${suggestion.stayText}</button></div>`;

  const rememberAndClose = () => {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch {
      // Closing the current notice must still work without storage.
    }
    notice.remove();
  };

  notice.querySelector("a")?.addEventListener("click", () => {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch {
      // Navigation remains explicitly user initiated.
    }
  });
  notice.querySelector("button")?.addEventListener("click", rememberAndClose);
  document.body.append(notice);
});

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  });
}

if (mobileSubmenuButton && mobileSubmenu) {
  mobileSubmenuButton.addEventListener("click", () => {
    const isOpen = mobileSubmenuButton.getAttribute("aria-expanded") === "true";
    mobileSubmenuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileSubmenu.classList.toggle("is-open", !isOpen);
  });
}

const animatedItems = document.querySelectorAll("main > section, .card, .area-card, .method-item, .step, .cost-factor, .info-box");

if ("IntersectionObserver" in window) {
  animatedItems.forEach((item) => item.setAttribute("data-animate", ""));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedItems.forEach((item) => observer.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("is-visible"));
}
