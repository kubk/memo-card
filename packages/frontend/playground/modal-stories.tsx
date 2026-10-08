import { useState } from "preact/compat";
import { FolderOpen, LayersIcon } from "lucide-react";
import { t } from "../src/translations/t.ts";
import { BottomSheet } from "../src/ui/bottom-sheet/bottom-sheet.tsx";
import { RadioList } from "../src/ui/radio-list/radio-list.tsx";
import {
  formatCardType,
  formatCardTypeDescription,
} from "../src/screens/deck-form/card-form/format-card-type.ts";
import { Choice } from "../src/screens/deck-list/deck-or-folder-choose/choice.tsx";
import { WysiwygHelp } from "../src/ui/wysiwyg-field/wysiwyg-help.tsx";
import { ColorPicker } from "../src/ui/wysiwyg-field/color-picker.tsx";

const modalStories = [
  {
    id: "card-type",
    label: "Card type",
  },
  {
    id: "create",
    label: "Create",
  },
  {
    id: "sort",
    label: "Sort",
  },
  {
    id: "freeze-help",
    label: "Freeze help",
  },
  {
    id: "formatting-help",
    label: "Formatting help",
  },
  {
    id: "text-color",
    label: "Text color",
  },
] as const;

export type ModalStoryId = (typeof modalStories)[number]["id"];

export function CatalogModals({
  activeModalId,
  onClose,
  onOpen,
}: {
  activeModalId: ModalStoryId | null;
  onClose: () => void;
  onOpen: (modalId: ModalStoryId) => void;
}) {
  return (
    <>
      <div className="grid w-full max-w-[480px] grid-cols-2 gap-3 text-text">
        {modalStories.map((story) => (
          <button
            type="button"
            key={story.id}
            className="min-h-[74px] rounded-2xl bg-bg px-4 py-3 text-left text-sm font-semibold shadow transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            onClick={() => onOpen(story.id)}
          >
            {story.label}
          </button>
        ))}
      </div>
      <ModalStory
        modalId={activeModalId}
        isOpen={activeModalId !== null}
        onClose={onClose}
      />
    </>
  );
}

function ModalStory({
  isOpen,
  modalId,
  onClose,
}: {
  isOpen: boolean;
  modalId: ModalStoryId | null;
  onClose: () => void;
}) {
  switch (modalId) {
    case "card-type":
      return <CardTypeModalStory isOpen={isOpen} onClose={onClose} />;
    case "create":
      return <CreateModalStory isOpen={isOpen} onClose={onClose} />;
    case "sort":
      return <SortModalStory isOpen={isOpen} onClose={onClose} />;
    case "freeze-help":
      return <FreezeHelpModalStory isOpen={isOpen} onClose={onClose} />;
    case "formatting-help":
      return <FormattingHelpModalStory isOpen={isOpen} onClose={onClose} />;
    case "text-color":
      return <TextColorModalStory isOpen={isOpen} onClose={onClose} />;
    case null:
      return null;
    default:
      return modalId satisfies never;
  }
}

function CardTypeModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<"remember" | "choice_single">(
    "remember",
  );

  return (
    <BottomSheet
      title={t("review_card_type")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pb-10">
        <RadioList
          selectedId={selectedId}
          onChange={(value) => {
            setSelectedId(value);
            onClose();
          }}
          options={[
            {
              id: "remember",
              title: formatCardType("remember"),
              description: formatCardTypeDescription("remember"),
            },
            {
              id: "choice_single",
              title: formatCardType("choice_single"),
              description: formatCardTypeDescription("choice_single"),
            },
          ]}
        />
      </div>
    </BottomSheet>
  );
}

function CreateModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet title={t("create")} isOpen={isOpen} onClose={onClose}>
      <div className="mb-12 flex w-full flex-col gap-2">
        <Choice
          icon={<LayersIcon className="self-center text-text" size={18} />}
          title={t("create_deck_option")}
          description={t("deck_description")}
          onClick={onClose}
        />
        <Choice
          icon={<FolderOpen className="self-center text-text" size={18} />}
          title={t("create_folder_option")}
          description={t("folder_description")}
          onClick={onClose}
        />
      </div>
    </BottomSheet>
  );
}

function SortModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState("createdAt-desc");
  const options = [
    {
      id: "createdAt-desc",
      title: `${t("card_sort_by_date")} ↓`,
    },
    {
      id: "createdAt-asc",
      title: `${t("card_sort_by_date")} ↑`,
    },
    {
      id: "frontAlpha-desc",
      title: `${t("card_sort_by_front")} ↓`,
    },
    {
      id: "frontAlpha-asc",
      title: `${t("card_sort_by_front")} ↑`,
    },
    {
      id: "backAlpha-desc",
      title: `${t("card_sort_by_back")} ↓`,
    },
    {
      id: "backAlpha-asc",
      title: `${t("card_sort_by_back")} ↑`,
    },
  ];

  return (
    <BottomSheet title={t("sort_by")} isOpen={isOpen} onClose={onClose}>
      <RadioList
        selectedId={selectedId}
        options={options}
        onChange={(value) => {
          setSelectedId(value);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

function FreezeHelpModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet title={t("how")} isOpen={isOpen} onClose={onClose}>
      <ul className="pl-6">
        {[
          t("freeze_rule_1"),
          t("freeze_rule_2"),
          t("freeze_rule_3"),
          t("freeze_rule_4"),
        ].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </BottomSheet>
  );
}

function FormattingHelpModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      title={t("wysiwyg_help_title")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <WysiwygHelp />
    </BottomSheet>
  );
}

function TextColorModalStory({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      title={t("wysiwyg_text_color")}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ColorPicker onColorSelect={onClose} />
    </BottomSheet>
  );
}
