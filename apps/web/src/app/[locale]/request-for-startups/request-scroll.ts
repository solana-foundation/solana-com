export function scrollRequestIntoView(value: string) {
  if (!value) return;

  window.requestAnimationFrame(() => {
    const request = document.getElementById(`request-item-${value}`);
    const headerHeight = document
      .querySelector("header")
      ?.getBoundingClientRect().height;

    if (!request) return;

    window.scrollTo({
      top: Math.max(
        0,
        request.getBoundingClientRect().top +
          window.scrollY -
          (headerHeight ?? 0) -
          24,
      ),
      behavior: "auto",
    });
  });
}
