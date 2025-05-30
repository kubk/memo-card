import { useState } from "react";
import { RadioList } from "../../ui/radio-list/radio-list.tsx";
import { Flex } from "../../ui/flex.tsx";

export function RadioListStory() {
  const [selectedId, setSelectedId] = useState<"1" | "2">("1");
  const [inputModeId, setInputModeId] = useState<null | "1" | "2">(null);

  return (
    <Flex direction={"column"} gap={48}>
      <RadioList<"1" | "2">
        selectedId={selectedId}
        options={[
          { id: "1", title: "Option 1" },
          { id: "2", title: "Option 2" },
        ]}
        onChange={setSelectedId}
      />

      <RadioList<null | "1" | "2">
        selectedId={inputModeId}
        options={[
          { id: null, title: "None" },
          { id: "1", title: "Option 1" },
          { id: "2", title: "Option 2" },
        ]}
        onChange={setInputModeId}
      />
    </Flex>
  );
}
