import { act } from "preact/test-utils";
import { createRoot } from "preact/compat/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createButton, Editor, EditorProvider, Toolbar } from "./index.ts";

const Bold = createButton("Bold", "B", "bold");
const Italic = createButton("Italic", "I", "italic");
const Heading = createButton("Heading", "H1", "h1");
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let block = "";
let bold = false;
let italic = false;
const execCommand = vi.fn(
  (command: string, _showUi?: boolean, value?: string) => {
    if (command === "formatBlock") block = value!;
    return true;
  },
);

beforeEach(() => {
  block = "";
  bold = false;
  italic = false;
  execCommand.mockClear();
  Object.defineProperty(document, "queryCommandState", {
    configurable: true,
    value: (command: string) =>
      command === "bold" ? bold : command === "italic" && italic,
  });
  Object.defineProperty(document, "queryCommandValue", {
    configurable: true,
    value: () => block,
  });
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    value: execCommand,
  });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  delete (document as Partial<Document>).queryCommandState;
  delete (document as Partial<Document>).queryCommandValue;
  delete (document as Partial<Document>).execCommand;
});

async function selectContent(html: string) {
  await act(async () => {
    root.render(
      <EditorProvider>
        <Editor value={html} onChange={() => undefined}>
          <Toolbar>
            <Bold />
            <Italic />
            <Heading />
          </Toolbar>
        </Editor>
      </EditorProvider>,
    );
  });
  const editor = container.querySelector<HTMLElement>(".rsw-ce")!;
  const selected =
    editor.querySelector("b, strong, i") ??
    editor.querySelector("h1") ??
    editor;
  editor.focus();
  const range = document.createRange();
  range.selectNodeContents(selected);
  const selection = window.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  await act(async () => {
    document.dispatchEvent(new Event("selectionchange"));
  });
}

it.each([
  {
    html: "<h1>Word</h1>",
    block: "h1",
    bold: true,
    italic: false,
    active: ["false", "false", "true"],
  },
  {
    html: "<h1><b>Word</b></h1>",
    block: "h1",
    bold: true,
    italic: false,
    active: ["true", "false", "true"],
  },
  {
    html: "<h1><i>Word</i></h1>",
    block: "h1",
    bold: true,
    italic: true,
    active: ["false", "true", "true"],
  },
  {
    html: "<b>Word</b>",
    block: "div",
    bold: true,
    italic: false,
    active: ["true", "false", "false"],
  },
])("tracks semantic formatting independently for $html", async (format) => {
  block = format.block;
  bold = format.bold;
  italic = format.italic;
  await selectContent(format.html);
  expect(
    Array.from(
      container.querySelectorAll("button"),
      (button) => button.dataset.active,
    ),
  ).toEqual(format.active);
});

it("toggles H1 back to a normal paragraph", async () => {
  block = "h1";
  bold = true;
  await selectContent("<h1>Word</h1>");
  const heading = container.querySelector<HTMLButtonElement>(
    'button[title="Heading"]',
  )!;
  await act(async () => {
    heading.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true }),
    );
  });
  expect(execCommand).toHaveBeenCalledWith("formatBlock", false, "div");
  expect(heading.dataset.active).toBe("false");
});
