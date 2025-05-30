export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    copyToClipboardOld(text);
  }
};

// A hack for old android to get clipboard copy feature ready
function copyToClipboardOld(textToCopy: string) {
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
