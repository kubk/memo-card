import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { Choice } from "./choice.tsx";
import { screenStore } from "../../store/screen-store.ts";
import { useBackButton } from "../../lib/telegram/use-back-button.tsx";

export const DeckOrFolderChoose = observer(() => {
  useBackButton(() => {
    screenStore.back();
  });

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        gap: 12,
      })}
    >
      <h3>Choose what to create</h3>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: 8,
        })}
      >
        <Choice
          icon={"mdi mdi-cards-outline mdi-36px"}
          title={"Deck"}
          description={"A collection of cards"}
          onClick={() => {
            screenStore.go({ type: "deckForm" });
          }}
        />
        <Choice
          icon={"mdi mdi-folder-open-outline mdi-36px"}
          title={"Folder"}
          description={"A collection of decks"}
          onClick={() => {
            screenStore.go({ type: "folderForm" });
          }}
        />
      </div>
    </div>
  );
});
