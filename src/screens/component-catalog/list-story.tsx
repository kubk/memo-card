import { CardNumber } from "../../ui/card-number.tsx";
import { css, cx } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { reset } from "../../ui/reset.ts";
import { List } from "../../ui/list.tsx";
import React from "react";

export const ListStory = () => {
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
          ),
        }))}
    />
  );
};
