import { Screen } from "../shared/screen.tsx";
import { useState } from "react";
import { useBackButton } from "../../lib/platform/use-back-button.ts";
import { Component, components } from "./components.tsx";

export function ComponentCatalogPage() {
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
            className="cursor-pointer text-link"
          >
            {component.name}
          </li>
        ))}
      </ul>
    </Screen>
  );
}
