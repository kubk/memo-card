export const copyToClipboard = async (
  text: string,
  options?: { html?: string },
) => {
  try {
    if (options?.html) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([options.html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      return;
    }

    await navigator.clipboard.writeText(text);
  } catch {
    copyToClipboardOld(text, options);
  }
};

// A hack for old android to get clipboard copy feature ready
function copyToClipboardOld(textToCopy: string, options?: { html?: string }) {
  if (options?.html && copyRichClipboardOld(textToCopy, options.html)) {
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;

  // Move the textarea outside the viewport to make it invisible
  textarea.style.position = "absolute";
  textarea.style.left = "-99999999px";

  // @ts-ignore
  document.body.prepend(textarea);

  // highlight the content of the textarea element
  textarea.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.log(err);
  } finally {
    textarea.remove();
  }
}

function copyRichClipboardOld(text: string, html: string) {
  const handleCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData("text/html", html);
    event.clipboardData?.setData("text/plain", text);
    event.preventDefault();
  };

  document.addEventListener("copy", handleCopy);
  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    document.removeEventListener("copy", handleCopy);
  }

  return copied;
}
