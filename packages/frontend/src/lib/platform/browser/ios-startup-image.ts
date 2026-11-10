import { isDarkTheme } from "../../color-scheme/is-dark-theme.tsx";
import { cssVariablesDark, cssVariablesLight } from "../../../ui/theme.tsx";

// logo.png has transparent padding, so the visible artwork is about 160pt tall
const logoSize = 212;

// iOS takes the launch screen from these links when the app is added to the Home Screen
export function addIosStartupImages() {
  if ((navigator as { standalone?: boolean }).standalone !== false) {
    return;
  }

  const logo = new Image();
  logo.onload = () => {
    const width = Math.min(window.screen.width, window.screen.height);
    const height = Math.max(window.screen.width, window.screen.height);
    appendStartupImage(logo, width, height, "portrait");
    appendStartupImage(logo, height, width, "landscape");
  };
  logo.src = "/img/logo.png";
}

function appendStartupImage(
  logo: HTMLImageElement,
  width: number,
  height: number,
  orientation: "portrait" | "landscape",
) {
  const scale = window.devicePixelRatio;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.scale(scale, scale);
  context.fillStyle = (isDarkTheme() ? cssVariablesDark : cssVariablesLight)[
    "--tg-theme-secondary-bg-color"
  ];
  context.fillRect(0, 0, width, height);
  context.drawImage(
    logo,
    (width - logoSize) / 2,
    (height - logoSize) / 2,
    logoSize,
    logoSize,
  );

  const link = document.createElement("link");
  link.rel = "apple-touch-startup-image";
  link.media = `(orientation: ${orientation})`;
  link.href = canvas.toDataURL();
  document.head.appendChild(link);
}
