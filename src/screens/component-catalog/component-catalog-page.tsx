import { Screen } from "../shared/screen.tsx";
import { useState } from "react";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { Component, components } from "./components.tsx";

export const ComponentCatalogPage = () => {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null,
  );
  useBackButton(() => {
    setSelectedComponent(null);
  });

  if (selectedComponent) {
    return selectedComponent.component;
  }

  return (
    <Screen title={"Component catalog"}>
      <ul>
        {components.map((component) => (
          <li
            key={component.name}
            onClick={() => setSelectedComponent(component)}
            className={css({
              cursor: "pointer",
              color: theme.linkColor,
            })}
          >
            {component.name}
          </li>
        ))}
      </ul>
    </Screen>
  );
};
