import React from "react";
import { observer } from "mobx-react-lite";
import { Modal } from "../../ui/modal.tsx";
import { css } from "@emotion/css";
import { useReviewStore } from "../../store/review-store-context.tsx";
import { random } from "../../lib/array/random.ts";
import WebApp from "@twa-dev/sdk";
import { useMount } from "../../lib/react/use-mount.ts";
import { screenStore } from "../../store/screen-store.ts";

const encouragingMessages = [
  "Consistency is the key to mastery, and each step you take brings you closer to your learning goals",
  "Remember, the journey of knowledge is endless, and every session counts",
  "Keep up the momentum, and see you in the next review!",
  "While you've made it through all the cards for now, remember that the magic of spaced repetition means you'll see these words pop up in the future.",
  "It's all part of ensuring these nuggets of knowledge stick with you for the long run.",
  "Keep up the fantastic work, and we'll see you in the next review!",
];

export const DeckFinished = observer(() => {
  const reviewStore = useReviewStore();

  useMount(() => {
    WebApp.MainButton.show();
    WebApp.MainButton.setText("Go back");
    WebApp.MainButton.showProgress();
    const onClick = () => {
      screenStore.navigateToMain();
    };
    WebApp.MainButton.onClick(onClick);

    reviewStore.submit().finally(() => {
      WebApp.MainButton.hideProgress();
    });

    return () => {
      WebApp.MainButton.hide();
      WebApp.MainButton.offClick(onClick);
    };
  });

  return (
    <Modal marginTop={"32px"}>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        })}
      >
        <p>You have finished this deck for now 🎉</p>

        <p>{random(encouragingMessages)} 😊</p>
      </div>
    </Modal>
  );
});
