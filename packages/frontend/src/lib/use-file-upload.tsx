import type * as React from "preact/compat";
import { useRef, useState } from "preact/compat";

export function useFileUpload({
  onFileUpload,
}: {
  onFileUpload: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await onFileUpload(file);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (file) {
      await handleUpload(file);
    }
    input.value = "";
  };

  return {
    isUploading,
    openFilePicker: () => {
      fileInputRef.current?.click();
    },
    renderInput: () => (
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    ),
  };
}
