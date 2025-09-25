function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function browserGetSafeAreaInset() {
  if (isStandaloneMode()) {
    return {
      top: 0,
      bottom: 6,
    };
  }

  return { top: 0, bottom: 0 };
}
