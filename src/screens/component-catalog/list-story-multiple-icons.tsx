import { CardNumber } from "../../ui/card-number.tsx";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { reset } from "../../ui/reset.ts";
import { List } from "../../ui/list.tsx";
import React from "react";
import { Flex } from "../../ui/flex.tsx";

export const ListStoryMultipleIcons = () => {
  return (
    <List
      animateTap={false}
      items={Array(3)
        .fill(null)
        .map((card, i) => ({
          text: (
            <div>
              <div>
                <CardNumber number={i + 1} />
                Test title
              </div>
              <div
                className={css({
                  color: theme.hintColor,
                  fontSize: 14,
                })}
              >
                Test description Test description Test description Test
                description Test description
              </div>
            </div>
          ),
          right: (
            <Flex gap={8}>
              <button
                className={cx(reset.button, css({ fontSize: 16 }))}
                onClick={() => {}}
              >
                <i
                  className={cx(
                    "mdi mdi-eye-check-outline mdi-24px",
                    css({ color: theme.buttonColor }),
                  )}
                />
              </button>
              <button
                className={cx(reset.button, css({ fontSize: 16 }))}
                onClick={() => {}}
              >
                <i
                  className={cx(
                    "mdi mdi-delete-circle mdi-24px",
                    css({ color: theme.danger }),
                  )}
                />
              </button>
            </Flex>
          ),
        }))}
    />
  );
};
