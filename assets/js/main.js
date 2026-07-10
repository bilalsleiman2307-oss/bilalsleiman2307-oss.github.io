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
