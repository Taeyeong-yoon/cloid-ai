(function () {
  const body = document.body;
  const bookId = body.dataset.bookId || "textbook";
  const stateKey = `${bookId}:state`;
  const sections = Array.from(document.querySelectorAll(".section"));
  const navButtons = Array.from(document.querySelectorAll(".nav-btn[data-section]"));
  const progressBar = document.getElementById("progressBarTop");
  const localeButtons = Array.from(document.querySelectorAll(".lang-btn"));
  let currentSection = "hero";
  let locale = localStorage.getItem(`${bookId}:locale`) || "en";

  function setProgress() {
    if (!progressBar || sections.length === 0) return;
    const index = Math.max(
      0,
      sections.findIndex((section) => section.id === `sec-${currentSection}`),
    );
    const ratio = Math.max(0.08, (index + 1) / sections.length);
    progressBar.style.width = `${ratio * 100}%`;
  }

  function saveState(extra) {
    const state = {
      section: currentSection,
      locale,
      ...(extra || {}),
    };
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  function goSec(id) {
    sections.forEach((section) => section.classList.toggle("active", section.id === `sec-${id}`));
    navButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === id));
    currentSection = id;
    setProgress();
    window.scrollTo({ top: 0, behavior: "smooth" });
    saveState();
  }

  window.goSec = goSec;

  navButtons.forEach((button) => {
    button.addEventListener("click", () => goSec(button.dataset.section));
  });

  document.querySelectorAll("[data-start-section]").forEach((button) => {
    button.addEventListener("click", () => goSec(button.dataset.startSection));
  });

  document.querySelectorAll("[data-concept]").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.concept;
      document.querySelectorAll("[data-concept]").forEach((node) => node.classList.toggle("selected", node === card));
      document.querySelectorAll("[data-concept-detail]").forEach((detail) => {
        detail.classList.toggle("hidden-locale", detail.dataset.conceptDetail !== key);
      });
    });
  });

  document.querySelectorAll("[data-doctor]").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.doctor;
      document.querySelectorAll("[data-doctor]").forEach((node) => node.classList.toggle("selected", node === card));
      document.querySelectorAll("[data-doctor-detail]").forEach((detail) => {
        detail.classList.toggle("hidden-locale", detail.dataset.doctorDetail !== key);
      });
    });
  });

  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.toggle || "");
      if (!target) return;
      target.classList.toggle("open");
    });
  });

  document.querySelectorAll("[data-roadmap]").forEach((row) => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    const key = `${bookId}:check:${row.dataset.roadmap}`;
    if (!checkbox) return;
    const saved = localStorage.getItem(key) === "1";
    checkbox.checked = saved;
    row.classList.toggle("done", saved);
    checkbox.addEventListener("change", () => {
      localStorage.setItem(key, checkbox.checked ? "1" : "0");
      row.classList.toggle("done", checkbox.checked);
    });
  });

  const quizRoot = document.querySelector("[data-quiz]");
  if (quizRoot) {
    const result = quizRoot.querySelector("[data-quiz-result]");
    quizRoot.querySelector("[data-quiz-submit]")?.addEventListener("click", () => {
      const items = quizRoot.querySelectorAll("[data-answer]");
      let score = 0;
      items.forEach((item) => {
        const selected = item.querySelector('input[type="radio"]:checked');
        if (selected && selected.value === item.dataset.answer) score += 1;
      });
      if (result) result.textContent = `${score} / ${items.length}`;
    });
  }

  const memo = document.querySelector("[data-memo]");
  const memoKey = `${bookId}:memo`;
  if (memo) {
    memo.value = localStorage.getItem(memoKey) || "";
    document.querySelector("[data-memo-save]")?.addEventListener("click", (event) => {
      localStorage.setItem(memoKey, memo.value);
      const button = event.currentTarget;
      const original = button.textContent;
      button.textContent = locale === "ko" ? "저장됨" : "Saved";
      setTimeout(() => {
        button.textContent = original;
      }, 1000);
    });
    document.querySelector("[data-memo-copy]")?.addEventListener("click", async (event) => {
      const button = event.currentTarget;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(memo.value);
        button.textContent = locale === "ko" ? "복사됨" : "Copied";
      } catch (_error) {
        button.textContent = locale === "ko" ? "실패" : "Failed";
      }
      setTimeout(() => {
        button.textContent = original;
      }, 1000);
    });
    document.querySelector("[data-memo-reset]")?.addEventListener("click", () => {
      memo.value = "";
      localStorage.removeItem(memoKey);
    });
  }

  const glossarySearch = document.querySelector("[data-glossary-search]");
  if (glossarySearch) {
    glossarySearch.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll("[data-glossary-item]").forEach((item) => {
        item.hidden = query ? !item.textContent.toLowerCase().includes(query) : false;
      });
    });
  }

  function applyLocale(nextLocale) {
    locale = nextLocale;
    document.querySelectorAll("[data-ko]").forEach((node) => {
      node.innerHTML = locale === "ko" ? node.dataset.ko : node.dataset.en;
    });
    document.querySelectorAll("[data-ko-placeholder]").forEach((node) => {
      node.placeholder = locale === "ko" ? node.dataset.koPlaceholder : node.dataset.enPlaceholder;
    });
    localeButtons.forEach((button) => button.classList.toggle("active", button.dataset.locale === locale));
    saveState();
  }

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => applyLocale(button.dataset.locale));
  });

  try {
    const savedState = JSON.parse(localStorage.getItem(stateKey) || "{}");
    if (savedState.section) currentSection = savedState.section;
    if (savedState.locale) locale = savedState.locale;
  } catch (_error) {
    currentSection = "hero";
  }

  applyLocale(locale);
  goSec(currentSection);

  const defaultConcept = document.querySelector("[data-concept]");
  if (defaultConcept) defaultConcept.click();
  const defaultDoctor = document.querySelector("[data-doctor]");
  if (defaultDoctor) defaultDoctor.click();
})();
