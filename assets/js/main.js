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
