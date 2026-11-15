// ===== Config: put your real email here so the contact form reaches you =====
const CONTACT_EMAIL = "you@example.com";

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.querySelectorAll(".nav__links a");

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // ----- Sticky nav background on scroll -----
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ----- Mobile menu -----
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  links.forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ----- Scroll reveal with stagger -----
  const reveals = document.querySelectorAll(".reveal");
  // Stagger siblings that share a parent
  const groups = new Map();
  reveals.forEach((el) => {
    const list = groups.get(el.parentElement) || [];
    list.push(el);
    groups.set(el.parentElement, list);
  });
  groups.forEach((list) => list.forEach((el, i) => el.style.setProperty("--delay", `${i * 0.1}s`)));

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  // ----- Counters animate up from 0 -----
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  // ----- Active nav link while scrolling -----
  const sections = document.querySelectorAll("main section[id]");
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => activeObserver.observe(s));

  // ----- Skill card spotlight follows the cursor -----
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  // ----- Contact form: inline validation + mailto -----
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const success = document.getElementById("formSuccess");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (emailRe.test(v.trim()) ? "" : "Please enter a valid email address."),
    message: (v) => (v.trim().length >= 10 ? "" : "Your message should be at least 10 characters."),
  };

  const validateField = (input, shake = false) => {
    const field = input.closest(".field");
    const error = rules[input.name](input.value);
    field.querySelector(".field__error").textContent = error;
    field.classList.toggle("has-error", Boolean(error));
    input.setAttribute("aria-invalid", String(Boolean(error)));
    if (error && shake) {
      field.classList.remove("shake");
      void field.offsetWidth; // restart animation
      field.classList.add("shake");
    }
    return !error;
  };

  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("blur", () => input.value && validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("input, textarea")];
    const valid = inputs.map((i) => validateField(i, true)).every(Boolean);
    if (!valid) {
      inputs.find((i) => i.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("is-loading");

    const { name, email, message } = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    setTimeout(() => {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      submitBtn.disabled = false;
      submitBtn.classList.remove("is-loading");
      success.hidden = false;
      setTimeout(() => {
        success.hidden = true;
        form.reset();
      }, 5000);
    }, 600);
  });
});
