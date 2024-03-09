import React, { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const UserSettingsStoreProvider = lazy(() =>
  import("./store/user-settings-store-context.tsx").then((module) => ({
    default: module.UserSettingsStoreProvider,
  })),
);

const UserSettingsMain = lazy(() =>
  import("./user-settings-main.tsx").then((module) => ({
    default: module.UserSettingsMain,
  })),
);

export const UserSettingsLazy = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <UserSettingsStoreProvider>
        <UserSettingsMain />
      </UserSettingsStoreProvider>
    </Suspense>
  );
};
