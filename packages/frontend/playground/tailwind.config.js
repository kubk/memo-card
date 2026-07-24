import frontendConfig from "../tailwind.config.js";
import { extendThemeWithShadcn } from "../src/ui/shadcn/tailwind-theme.js";

export default {
  ...frontendConfig,
  content: {
    relative: true,
    files: [
      "./index.html",
      "./**/*.{js,ts,jsx,tsx}",
      "../src/**/*.{js,ts,jsx,tsx}",
    ],
  },
  theme: extendThemeWithShadcn(frontendConfig.theme),
};
