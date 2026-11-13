import { webAppStartParamKey } from "api";
import { Platform } from "../platform.ts";
import { action, makeAutoObservable } from "mobx";
import { BooleanToggle } from "mobx-form-lite";
import { localUserIdPrefix, PlatformSchemaType } from "api";
import {
  isDarkTheme,
  listenDarkThemeChange,
} from "../../color-scheme/is-dark-theme.tsx";
import { UserSource } from "api";
import {
  browserPlatformLangKey,
  browserTokenKey,
} from "./local-storage-keys.ts";
import { cssVariablesDark, cssVariablesLight } from "../../../ui/theme.tsx";
import { LanguageShared } from "api";
import { api } from "../../../api/trpc-api.ts";
import { applyColorScheme } from "../../color-scheme/apply-color-scheme.ts";
import { env } from "../../../env.ts";
import { normalizeLanguage } from "api";
import { overlayStore } from "../../../store/overlay-store.ts";

const formFieldTags = ["INPUT", "TEXTAREA", "SELECT"];

export class BrowserPlatform implements Platform {
  isMobile = false;

  mainButtonInfo?: {
    text: string;
    onClick: () => void;
    condition?: () => boolean;
    isAboveBottomSheet?: boolean;
  };
  isMainButtonLoading = new BooleanToggle(false);
  backButtonInfo?: {
    onClick: () => void;
  };

  languageCached = normalizeLanguage(
    localStorage.getItem(browserPlatformLangKey),
  );

  constructor() {
    makeAutoObservable(
      this,
      {
        getInitData: false,
        initialize: false,
        openInternalLink: false,
        getStartParam: false,
        openExternalLink: false,
      },
      {
        autoBind: true,
      },
    );

    this.listenIsMobile();
  }

  private getCssVariables() {
    return isDarkTheme() ? cssVariablesDark : cssVariablesLight;
  }

  private applyTheme() {
    applyColorScheme(isDarkTheme() ? "dark" : "light");

    const cssVariables = this.getCssVariables();
    for (const [variable, value] of Object.entries(cssVariables)) {
      document.documentElement.style.setProperty(variable, value);
    }
  }

  getStartParam(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get(webAppStartParamKey);
    if (typeof start === "string") {
      return start;
    }
    return undefined;
  }

  getClientData(): PlatformSchemaType {
    return {
      platform: navigator.userAgent,
      userAgent: navigator.userAgent,
      colorScheme: isDarkTheme() ? "dark" : "light",
    };
  }

  getUserAvatarUrl(): string | null {
    return null;
  }

  showMainButton(
    text: string,
    onClick: () => void,
    condition?: () => boolean,
    isAboveBottomSheet?: boolean,
  ) {
    this.mainButtonInfo = {
      text,
      onClick,
      condition,
      isAboveBottomSheet,
    };
  }

  hideMainButton() {
    this.mainButtonInfo = undefined;
  }

  get isMainButtonVisible() {
    return this.mainButtonInfo !== undefined;
  }

  showBackButton(onClick: () => void) {
    this.backButtonInfo = {
      onClick,
    };
  }

  hideBackButton() {
    this.backButtonInfo = undefined;
  }

  get isBackButtonVisible() {
    return this.backButtonInfo !== undefined;
  }

  getInitData(): string | null {
    if (env.VITE_STAGE === "local" && env.VITE_USER_ID) {
      return `${localUserIdPrefix}${env.VITE_USER_ID}`;
    }

    return localStorage.getItem(browserTokenKey) || null;
  }

  handleTelegramOidcLogin(token: string, nonce: string) {
    return api.telegramSignin.mutate({ token, nonce }).then((response) => {
      localStorage.setItem(
        browserTokenKey,
        `${UserSource.Api} ${response.browserToken}`,
      );
      window.location.href = "/";
    });
  }

  handleGoogleAuth(credential: string) {
    api.googleSignin
      .mutate({ token: credential })
      .then((response) => {
        localStorage.setItem(
          browserTokenKey,
          `${UserSource.Google} ${response.browserToken}`,
        );
        window.location.href = "/";
      })
      .catch(console.error);
  }

  initialize() {
    this.applyTheme();
    listenDarkThemeChange(() => this.applyTheme());
    this.listenHotkeys({ enter: this.pressMainButton });
  }

  // Keys match by position too, so digits work on layouts like AZERTY
  listenHotkeys(hotkeys: Partial<Record<string, () => void>>) {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        // Chrome autofill dispatches keydown events without a key
        !event.key ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        target.isContentEditable ||
        formFieldTags.includes(target.tagName)
      ) {
        return;
      }

      const position = event.code
        .toLowerCase()
        .replace(/^(key|digit|numpad)/, "");
      const onPress = hotkeys[position] ?? hotkeys[event.key.toLowerCase()];
      onPress?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }

  private pressMainButton() {
    const info = this.mainButtonInfo;
    if (
      !info ||
      this.isMainButtonLoading.value ||
      overlayStore.isHidingMainButton(info.isAboveBottomSheet) ||
      (info.condition && !info.condition())
    ) {
      return;
    }

    info.onClick();
  }

  openInternalLink(link: string) {
    window.location.href = link;
  }

  openExternalLink(link: string) {
    window.open(link, "_blank");
  }

  listenIsMobile() {
    if (!window.matchMedia) {
      return;
    }
    const isMobileQuery = window.matchMedia(`(max-width: 600px)`);
    this.isMobile = isMobileQuery.matches;
    isMobileQuery.addEventListener(
      "change",
      action((e) => {
        this.isMobile = e.matches;
      }),
    );
  }

  openInvoiceLink(link: string) {
    this.openExternalLink(link);
  }

  logout() {
    localStorage.removeItem(browserTokenKey);
    window.location.href = "/";
  }

  getLanguageCached(): LanguageShared {
    return this.languageCached;
  }

  setLanguageCached(language: LanguageShared) {
    this.languageCached = language;
    localStorage.setItem(browserPlatformLangKey, language);
  }

  // Only the Telegram Mini App has haptic feedback
  haptic() {}
}
