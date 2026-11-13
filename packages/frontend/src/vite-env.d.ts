/// <reference types="vite/client" />
/// <reference types="telegram-web-app" />

interface Window {
  Rollbar?: import("rollbar");
  eruda?: import("eruda").Eruda;
}

declare const __LAST_COMMIT__: {
  hash: string;
  name: string;
};
