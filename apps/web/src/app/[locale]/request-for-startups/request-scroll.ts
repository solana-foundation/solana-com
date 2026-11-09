// Layout offset from the document top. Unlike getBoundingClientRect, this
// ignores ancestor transforms, so a request measured while its section is
// still mid-entrance animation lands in the same place once it settles.
const documentTop = (element: HTMLElement) => {
  let top = 0;
  let current: HTMLElement | null = element;

  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return top;
};

export function scrollRequestIntoView(value: string) {
  if (!value) return;

  window.requestAnimationFrame(() => {
    const request = document.getElementById(value);
    const headerHeight = document
      .querySelector("header")
      ?.getBoundingClientRect().height;

    if (!request) return;

    window.scrollTo({
      top: Math.max(0, documentTop(request) - (headerHeight ?? 0) - 24),
      behavior: "auto",
    });
  });
}

export function updateRequestHash(value: string) {
  const url = `${window.location.pathname}${window.location.search}${
    value ? `#${value}` : ""
  }`;

  window.history.replaceState(null, "", url);
}
