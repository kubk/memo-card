/// <reference types="vite/client" />
/// <reference types="telegram-web-app" />

declare module "react-lines-ellipsis";

interface Window {
  Rollbar?: import("rollbar");
  eruda?: import("eruda").Eruda;
}

declare const __LAST_COMMIT__: {
  hash: string;
  name: string;
};
