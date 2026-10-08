export function normalizeInlineFormatting(element: HTMLElement) {
  const selection = window.getSelection();
  const anchorNode = selection?.anchorNode;
  const anchorOffset = selection?.anchorOffset ?? 0;
  const focusNode = selection?.focusNode;
  const focusOffset = selection?.focusOffset ?? 0;
  let movedNodes = false;

  for (const node of element.querySelectorAll<HTMLElement>(
    "font[style], span[style]",
  )) {
    const tags: string[] = [];
    if (node.style.color === "inherit") node.style.removeProperty("color");
    if (
      node.style.fontWeight === "bold" ||
      Number(node.style.fontWeight) >= 600
    ) {
      tags.push("b");
      node.style.removeProperty("font-weight");
    }
    if (node.style.fontStyle === "italic") {
      tags.push("i");
      node.style.removeProperty("font-style");
    }
    for (const tag of tags) {
      const wrapper = document.createElement(tag);
      node.parentNode?.insertBefore(wrapper, node);
      wrapper.appendChild(node);
      movedNodes = true;
    }
    if (!node.getAttribute("style")) {
      node.removeAttribute("style");
      if (node.tagName === "SPAN") {
        node.replaceWith(...node.childNodes);
        movedNodes = true;
      }
    }
  }

  if (
    movedNodes &&
    anchorNode &&
    focusNode &&
    element.contains(anchorNode) &&
    element.contains(focusNode)
  ) {
    selection?.setBaseAndExtent(
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    );
  }
}
