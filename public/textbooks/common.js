(function () {
  const root = document.documentElement;
  const storagePrefix = document.body.dataset.bookId || "textbook";

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.scrollTarget || "");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("[data-compare-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-compare-tab]");
    const panels = document.querySelectorAll(`[data-compare-panel="${group.dataset.compareGroup}"]`);

    function activate(key) {
      buttons.forEach((button) => button.classList.toggle("active", button.dataset.compareTab === key));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.compareKey === key));
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => activate(button.dataset.compareTab));
    });

    if (buttons[0]) {
      activate(buttons[0].dataset.compareTab);
    }
  });

  document.querySelectorAll("[data-roadmap-item]").forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const key = `${storagePrefix}:roadmap:${item.dataset.roadmapItem}`;
    if (!checkbox) return;

    const saved = localStorage.getItem(key) === "1";
    checkbox.checked = saved;
    item.classList.toggle("completed", saved);

    checkbox.addEventListener("change", () => {
      localStorage.setItem(key, checkbox.checked ? "1" : "0");
      item.classList.toggle("completed", checkbox.checked);
    });
  });

  const memo = document.querySelector("[data-memo]");
  const memoCopy = document.querySelector("[data-memo-copy]");
  const memoSave = document.querySelector("[data-memo-save]");
  const memoReset = document.querySelector("[data-memo-reset]");
  const memoKey = `${storagePrefix}:memo`;

  if (memo) {
    memo.value = localStorage.getItem(memoKey) || "";
  }

  if (memoSave && memo) {
    memoSave.addEventListener("click", () => {
      localStorage.setItem(memoKey, memo.value);
      memoSave.textContent = "Saved";
      setTimeout(() => {
        memoSave.textContent = memoSave.dataset.label || "Save note";
      }, 1200);
    });
  }

  if (memoCopy && memo) {
    memoCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(memo.value);
        memoCopy.textContent = "Copied";
        setTimeout(() => {
          memoCopy.textContent = memoCopy.dataset.label || "Copy note";
        }, 1200);
      } catch (_error) {
        memoCopy.textContent = "Copy failed";
      }
    });
  }

  if (memoReset && memo) {
    memoReset.addEventListener("click", () => {
      memo.value = "";
      localStorage.removeItem(memoKey);
    });
  }

  const glossarySearch = document.querySelector("[data-glossary-search]");
  if (glossarySearch) {
    glossarySearch.addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll("[data-glossary-item]").forEach((item) => {
        const content = item.textContent.toLowerCase();
        item.hidden = query ? !content.includes(query) : false;
      });
    });
  }

  const quizRoot = document.querySelector("[data-quiz]");
  if (quizRoot) {
    const submit = quizRoot.querySelector("[data-quiz-submit]");
    const result = quizRoot.querySelector("[data-quiz-result]");
    submit?.addEventListener("click", () => {
      const items = quizRoot.querySelectorAll("[data-answer]");
      let score = 0;
      items.forEach((item) => {
        const selected = item.querySelector('input[type="radio"]:checked');
        const expected = item.dataset.answer;
        if (selected && selected.value === expected) {
          score += 1;
        }
      });
      if (result) {
        result.textContent = `${score} / ${items.length}`;
      }
    });
  }

  const progress = document.querySelector("[data-progress]");
  if (progress) {
    const sections = Array.from(document.querySelectorAll("[data-track-section]"));
    const updateProgress = () => {
      const viewportMiddle = window.scrollY + window.innerHeight * 0.35;
      let current = 0;
      sections.forEach((section, index) => {
        if (section.offsetTop <= viewportMiddle) current = index + 1;
      });
      const ratio = sections.length ? Math.max(0.08, current / sections.length) : 0;
      progress.style.width = `${ratio * 100}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  document.querySelectorAll("[data-theme-accent]").forEach((node) => {
    const accent = node.getAttribute("data-theme-accent");
    if (accent) {
      root.style.setProperty("--theme-accent", accent);
    }
  });
})();
