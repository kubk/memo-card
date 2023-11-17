import { css, cx } from "@emotion/css";
import React from "react";
import { theme } from "./theme.tsx";

const config = {
  colors: {
    blueLight: theme.success,
    grayLightExtra: "#e8ecef",
    white: "#fff",
  },
  cursorSize: 19,
  transitionDuration: "0.2s",
};

type Props = {
  isOn: boolean;
  onToggle: () => void;
};

export const RadioSwitcher = (props: Props) => {
  const { isOn, onToggle } = props;

  return (
    <label
      onClick={(event) => {
        event.stopPropagation();
      }}
      className={cx(
        css({
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: config.colors.grayLightExtra,
          outline: isOn ? undefined : "1px solid white",
          borderRadius: 38,
          padding: "0px 0.5rem",
          color: config.colors.white,
          height: 26,
          width: 40,
          cursor: "pointer",
          position: "relative",
          whiteSpace: "nowrap",
          transition: `background-color ${config.transitionDuration}`,
          marginBottom: 0,
        }),
        isOn && css({ backgroundColor: config.colors.blueLight }),
      )}
    >
      <input
        type="checkbox"
        className={css({ position: "absolute", appearance: "none" })}
        checked={isOn}
        onChange={onToggle}
      />
      <div
        className={cx(
          css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            backgroundColor: config.colors.white,
            boxShadow: "0 0 8px rgba(56, 0, 107, 0.16)",
            width: config.cursorSize,
            height: config.cursorSize,
            borderRadius: "50%",
            transitionTimingFunction: "ease-in-out",
            transitionDuration: config.transitionDuration,
            transitionProperty: "left, background-color",
            left: 4,
          }),
          isOn &&
            css({
              left: `calc(100% - ${config.cursorSize}px - 4px)`,
            }),
        )}
      />
    </label>
  );
};
