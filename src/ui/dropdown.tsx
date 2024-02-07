import React, { ReactNode, useEffect, useState } from "react";
import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";

type Props = {
  items: Array<{
    text: ReactNode;
    onClick: () => void;
  }>;
};

export const Dropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = props;

  // Toggle dropdown open state
  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    // TODO: rewrite to refs
    // @ts-ignore
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-content") &&
        !event.target.closest(".dropdown-icon")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      className={css({
        position: "absolute",
        display: "inline-block",
      })}
    >
      <div
        onClick={toggleDropdown}
        className={cx("dropdown-icon", css({ cursor: "pointer" }))}
      >
        ...
      </div>
      {isOpen && (
        <div
          className={cx(
            "dropdown-content",
            css({
              display: "block",
              position: "absolute",
              backgroundColor: theme.bgColor,
              minWidth: "160px",
              borderRadius: theme.borderRadius,
              boxShadow: "0 0 8px rgba(56, 0, 107, 0.16)",
              right: 0,
              zIndex: 1,
              color: theme.textColor,
            }),
          )}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={css({
                padding: "12px 16px",
                borderRadius: theme.borderRadius,
                ...tapScale,
              })}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
