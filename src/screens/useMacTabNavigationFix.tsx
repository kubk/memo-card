import { useEffect } from "react";

const isMacOS = /Mac OS X/i.test(navigator.userAgent);

// Custom hook for handling tab navigation in Safari on macOS
// It's either a bug of Telegram for Mac or some issues with Safari WebView
export const useMacTabNavigationFix = () => {
  useEffect(() => {
    if (!isMacOS) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();

        const inputs = Array.from(document.querySelectorAll("input, textarea"));
        const activeElement = document.activeElement;
        // @ts-expect-error
        const currentIndex = inputs.indexOf(activeElement);
        if (currentIndex === -1) {
          // No input is currently focused, focus the first input
          if (inputs.length > 0) {
            // @ts-expect-error
            inputs[0].focus();
          }
        } else {
          if (event.shiftKey && currentIndex > 0) {
            // Shift + Tab was pressed
            // @ts-expect-error
            inputs[currentIndex - 1].focus();
          } else if (!event.shiftKey && currentIndex >= 0 && currentIndex < inputs.length - 1) {
            // Only Tab was pressed
            // @ts-expect-error
            inputs[currentIndex + 1].focus();
          }
        }
      }
    };

    // Only keyup works here, events like keydown and keypress don't
    document.addEventListener("keyup", handleKeyDown);
    return () => {
      document.removeEventListener("keyup", handleKeyDown);
    };
  }, []);
};
