import { useState } from "react";
import { copyToClipboard } from "../../lib/copy-to-clipboard/copy-to-clipboard.ts";
import { notifySuccess } from "../../screens/shared/snackbar/snackbar.tsx";
import { t } from "../../translations/t.ts";
import { wysiwygTableStyle } from "../wysiwyg-table-style.ts";
import { css, cx } from "@emotion/css";
import { theme } from "../theme.tsx";
import { ButtonGrid } from "../button-grid.tsx";
import { ButtonSideAligned } from "../button-side-aligned.tsx";
import { CopyIcon, MinusIcon, PlusIcon } from "lucide-react";

type TableData = {
  headers: string[];
  rows: string[][];
};

export function HtmlTableEditor() {
  const [tableData, setTableData] = useState<TableData>({
    headers: ["Head 1", "Head 2", "Head 3"],
    rows: [
      ["A", "B", "C"],
      ["D", "F", "G"],
    ],
  });

  const addColumn = () => {
    setTableData((prevData) => ({
      headers: [...prevData.headers, `Head ${prevData.headers.length + 1}`],
      rows: prevData.rows.map((row) => [...row, ""]),
    }));
  };

  const removeColumn = () => {
    if (tableData.headers.length > 1) {
      setTableData((prevData) => ({
        headers: prevData.headers.slice(0, -1),
        rows: prevData.rows.map((row) => row.slice(0, -1)),
      }));
    }
  };

  const addRow = () => {
    setTableData((prevData) => ({
      ...prevData,
      rows: [...prevData.rows, Array(prevData.headers.length).fill("")],
    }));
  };

  const removeRow = () => {
    if (tableData.rows.length > 1) {
      setTableData((prevData) => ({
        ...prevData,
        rows: prevData.rows.slice(0, -1),
      }));
    }
  };

  const generateHtmlCode = () => {
    return `
<table>
  <thead>
    <tr>${tableData.headers.map((header) => `<th>${header}</th>`).join("")}</tr>
  </thead>
  <tbody>
    ${tableData.rows
      .map(
        (row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join("\n    ")}
  </tbody>
</table>
    `.trim();
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    setTableData((prevData) => {
      const newRows = [...prevData.rows];
      newRows[rowIndex][colIndex] = value;
      return { ...prevData, rows: newRows };
    });
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    setTableData((prevData) => {
      const newHeaders = [...prevData.headers];
      newHeaders[colIndex] = value;
      return { ...prevData, headers: newHeaders };
    });
  };

  return (
    <div
      className={cx(
        css({ display: "flex", flexDirection: "column", gap: 8 }),
        wysiwygTableStyle,
        css`
          input {
            width: 100%;
            border: none;
            outline: none;
            &:focus {
              outline: 1px solid ${theme.buttonColor};
            }
          }
        `,
      )}
    >
      <ButtonGrid>
        <ButtonSideAligned
          outline
          icon={<PlusIcon size={18} />}
          onClick={addColumn}
        >
          {t("html_column")}
        </ButtonSideAligned>
        <ButtonSideAligned
          outline
          icon={<PlusIcon size={18} />}
          onClick={addRow}
        >
          {t("html_row")}
        </ButtonSideAligned>
        <ButtonSideAligned
          outline
          icon={<MinusIcon size={18} />}
          onClick={removeColumn}
        >
          {t("html_column")}
        </ButtonSideAligned>
        <ButtonSideAligned
          outline
          icon={<MinusIcon size={18} />}
          onClick={removeRow}
        >
          {t("html_row")}
        </ButtonSideAligned>
      </ButtonGrid>
      <table>
        <thead>
          <tr>
            {tableData.headers.map((header, colIndex) => (
              <th key={colIndex}>
                <input
                  value={header}
                  onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    value={cell}
                    onChange={(e) =>
                      handleCellChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <ButtonSideAligned
          outline
          onClick={() => {
            copyToClipboard(generateHtmlCode());
            notifySuccess(t("copied"));
          }}
          icon={<CopyIcon size={18} />}
        >
          {t("copy_code")}
        </ButtonSideAligned>
      </div>
    </div>
  );
}
