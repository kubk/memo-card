import { useState } from "react";
import { BottomSheet } from "../../ui/bottom-sheet/bottom-sheet.tsx";

export function BottomSheetStory() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Bottom Sheet
      </button>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <h2>Bottom Sheet Content</h2>
        <p>This is the content of the bottom sheet.</p>
        <p>This is the content of the bottom sheet.</p>
        <p>This is the content of the bottom sheet.</p>
        <p>This is the content of the bottom sheet.</p>
        <p>This is the content of the bottom sheet.</p>
        <p>This is the content of the bottom sheet.</p>
      </BottomSheet>
    </div>
  );
}
