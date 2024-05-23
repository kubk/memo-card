import { theme } from "../theme.tsx";
import { Flex } from "../flex.tsx";
import { css } from "@emotion/css";
import { ReactNode } from "react";
import { RadioBoxFilled } from "./radio-box-filled.tsx";
import { RadioBoxEmpty } from "./radio-box-empty.tsx";

type RadioItemId = string | null;

type Props<T extends RadioItemId> = {
  selectedId: T;
  options: Array<{ id: T; title: ReactNode }>;
  onChange: (selectedId: T) => void;
};

export const RadioList = <T extends RadioItemId>(props: Props<T>) => {
  const { selectedId, options, onChange } = props;

  return (
    <Flex direction={"column"} gap={6}>
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        return (
          <div
            key={option.id}
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: '16px 8px',
              backgroundColor: theme.bgColor,
              outline: isSelected
                ? `2px solid ${theme.buttonColor}`
                : undefined,
              borderRadius: theme.borderRadius,
              cursor: "pointer",
            })}
            onClick={() => onChange(option.id)}
          >
            {isSelected ? <RadioBoxFilled /> : <RadioBoxEmpty />}
            <div
              className={css({
                width: "100%",
              })}
            >
              {option.title}
            </div>
          </div>
        );
      })}
    </Flex>
  );
};
