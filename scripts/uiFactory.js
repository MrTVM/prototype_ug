export function createUiFactory() {
  const createBulletList = (parent, items) => {
    const ul = document.createElement("ul");
    ul.className = "space-y-1";

    for (const item of items) {
      const li = document.createElement("li");
      li.className = "flex items-start gap-2";

      const dot = document.createElement("span");
      dot.className = "mt-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-slate-300";

      const text = document.createElement("span");
      text.className = "text-xs text-slate-900";
      text.textContent = item;

      li.appendChild(dot);
      li.appendChild(text);
      ul.appendChild(li);
    }

    parent.appendChild(ul);
    return ul;
  };

  const createSectionStack = (blocks) => {
    const stack = document.createElement("div");
    stack.className = "space-y-4";
    for (const block of blocks) stack.appendChild(block);
    return stack;
  };

  const createPaddedSection = (className = "p-3") => {
    const section = document.createElement("div");
    section.className = className;
    return section;
  };

  const createSectionContent = (className = "mt-3 space-y-3") => {
    const content = document.createElement("div");
    content.className = className;
    return content;
  };

  return {
    createBulletList,
    createSectionStack,
    createPaddedSection,
    createSectionContent
  };
}
