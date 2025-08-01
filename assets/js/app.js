// DARK MODE TOGGLE
function initDarkMode() {
  // Always default to light theme if no preference is saved
  if (localStorage.theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light"; // Set light theme as default
  }

  // Theme toggle buttons
  const themeToggles = ["theme-toggle", "theme-toggle-mobile"];

  themeToggles.forEach((id) => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        console.log("Theme toggled to:", localStorage.theme);
      });
    }
  });
}

// MOBILE MENU NAVIGATION
function initMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  const drawerContent = drawer.querySelector(".absolute.right-0");
  const backdrop = drawer.querySelector(".absolute.inset-0.bg-black");
  const openButton = document.getElementById("mobile-menu-button");
  const closeButton = document.getElementById("close-drawer");

  function openDrawer() {
    drawer.classList.remove("invisible");
    document.body.style.overflow = "hidden"; // Prevent scrolling when drawer is open
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      drawerContent.classList.remove("translate-x-full");
    });
  }

  function closeDrawer() {
    backdrop.classList.add("opacity-0");
    drawerContent.classList.add("translate-x-full");
    document.body.style.overflow = ""; // Re-enable scrolling
    setTimeout(() => {
      drawer.classList.add("invisible");
    }, 300);
  }

  // Event Listeners
  openButton?.addEventListener("click", openDrawer);
  closeButton?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  // Close drawer when pressing escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  // Close drawer when clicking navigation links
  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

// Smooth scrolling functionality
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      // Close mobile drawer if open
      const drawer = document.getElementById("mobile-drawer");
      if (drawer && !drawer.classList.contains("invisible")) {
        drawer.querySelector(".absolute.right-0").classList.add("translate-x-full");
        drawer.querySelector(".absolute.inset-0").classList.add("opacity-0");
        setTimeout(() => {
          drawer.classList.add("invisible");
        }, 300);
      }

      // Scroll to target
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80; // Adjust based on your header height
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}
// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initMobileDrawer();
  initSmoothScroll();
});

// SWEAPER TECH STACK TOOLS
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".tech-swiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: true,
    allowTouchMove: true,
    speed: 5000,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      reverseDirection: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 20,
      },
      480: {
        spaceBetween: 30,
      },
      640: {
        spaceBetween: 40,
      },
    },
    on: {
      beforeInit: function () {
        // Duplicate slides for smoother infinite loop
        const slides = this.el.querySelectorAll(".swiper-slide");
        slides.forEach((slide) => {
          this.el.querySelector(".swiper-wrapper").appendChild(slide.cloneNode(true));
        });
      },
    },
  });

  // Force start autoplay
  swiper.autoplay.start();
});

// FLATPICKR DATE ADD EXPERIECNE
function setCalendarWidth(instance) {
  const inputRect = instance.input.getBoundingClientRect();
  if (instance.calendarContainer) {
    const targetWidth = Math.max(inputRect.width, 310); // minimal 260px biar grid muat
    instance.calendarContainer.style.width = targetWidth + "px";
    instance.calendarContainer.style.minWidth = "";
  }
}

function attachResizeSync(instance) {
  if (!instance.calendarContainer) return;

  const ro = new ResizeObserver(() => {
    setCalendarWidth(instance);
  });
  ro.observe(instance.input);
  instance._resizeObserver = ro;
}
function cleanupResizeSync(instance) {
  if (instance._resizeObserver) {
    instance._resizeObserver.disconnect();
    delete instance._resizeObserver;
  }
}
function abbreviateWeekdays(instance) {
  if (window.innerWidth <= 480) {
    instance.calendarContainer.querySelectorAll(".flatpickr-weekday").forEach((el) => {
      el.textContent = el.textContent.trim()[0]; // S, M, T, W, T, F, S
    });
  }
}
flatpickr("#startDate", {
  dateFormat: "d/m/Y",
  position: "below",
  appendTo: document.body,
  onOpen: function (selectedDates, dateStr, instance) {
    setCalendarWidth(instance);
    attachResizeSync(instance);
    abbreviateWeekdays(instance);
  },
  onChange: function (selectedDates, dateStr, instance) {
    if (dateStr !== "") instance.input.classList.add("filled");
  },
  onReady: function (selectedDates, dateStr, instance) {
    if (instance.input.value !== "") instance.input.classList.add("filled");
    setCalendarWidth(instance);
    abbreviateWeekdays(instance);
  },
  onClose: function (_, __, instance) {
    cleanupResizeSync(instance);
  },
});

flatpickr("#endDate", {
  dateFormat: "d/m/Y",
  position: "below",
  appendTo: document.body,
  onOpen: function (selectedDates, dateStr, instance) {
    setCalendarWidth(instance);
    attachResizeSync(instance);
    abbreviateWeekdays(instance);
  },
  onChange: function (selectedDates, dateStr, instance) {
    if (dateStr !== "") instance.input.classList.add("filled");
  },
  onReady: function (selectedDates, dateStr, instance) {
    if (instance.input.value !== "") instance.input.classList.add("filled");
    setCalendarWidth(instance);
    abbreviateWeekdays(instance);
  },
  onClose: function (_, __, instance) {
    cleanupResizeSync(instance);
  },
});

// INPUT TYPE FILE BORDER GLOW
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".tech-container, .experience-container, .project-container");

  containers.forEach((container) => {
    const inputs = container.querySelectorAll('input[type="text"], input[type="file"]');

    function updateState() {
      let isFilled = false;

      inputs.forEach((input) => {
        if ((input.type === "file" && input.files.length > 0) || (input.type === "text" && input.value.trim() !== "")) {
          isFilled = true;
        }
      });

      if (isFilled) {
        container.classList.add("active");
      } else {
        container.classList.remove("active");
      }

      // khusus file input di dalam container
      const fileInput = container.querySelector('input[type="file"]');
      if (fileInput && fileInput.files.length > 0) {
        fileInput.classList.add("filled");
      } else if (fileInput) {
        fileInput.classList.remove("filled");
      }
    }

    // bind event listeners per container
    inputs.forEach((input) => {
      input.addEventListener("input", updateState);
      input.addEventListener("change", updateState); // untuk file
    });

    // inisialisasi awal
    updateState();
  });
});

// INPUT BORDER GLOW
document
  .querySelectorAll(".input-group input, .input-experience input, .input-date input, .group-job input, .group-tech input, .input-project input, .input-project textarea, .group-project input")
  .forEach((el) => {
    const update = () => {
      if (el.value.trim()) {
        el.classList.add("filled");
      } else {
        el.classList.remove("filled");
      }
    };
    el.addEventListener("input", update);
    el.addEventListener("blur", update);
    // init on load
    update();
  });

// TO TOP
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      btn.classList.remove("hidden");
      btn.classList.add("flex");
    } else {
      btn.classList.add("hidden");
      btn.classList.remove("flex");
    }
  });

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// SPINNER LOADING
const overlay = document.getElementById("overlaySpinner");
const forms = document.querySelectorAll(".with-spinner");

forms.forEach((form) => {
  form.addEventListener("submit", () => {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex"); // kalau awalnya hidden, pastikan flex ditambahkan

    // Optional: disable submit button dalam form ini
    const submitButton = form.querySelector("button[type='submit']");
    if (submitButton) submitButton.disabled = true;
  });
});
