import { screenStore } from "../../store/screen-store.ts";
import { Label } from "../../ui/label.tsx";
import { Input } from "../../ui/input.tsx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { TextField } from "mobx-form-lite";
import { css } from "@emotion/css";
import { useBackButton } from "../../lib/platform/use-back-button.ts";

export const Debug = observer(() => {
  const store = useLocalObservable(() => ({
    field1: new TextField(""),
    field2: new TextField(""),
  }));

  useBackButton(() => {
    screenStore.back();
  });

  return (
    <div>
      <Label text={"Поле ввода 1"}>
        <div className={css({ fontSize: 16, padding: 8 })}>
          <input />
        </div>
      </Label>

      <label>
        Поле ввода 2
        <div className={css({ fontSize: 16, padding: 8 })}>
          <input />
        </div>
      </label>

      <Label text={"Поле ввода 3"}>
        <Input field={store.field1} noAutoSize />
      </Label>

      <Label text={"Поле ввода 4"}>
        <Input field={store.field2} />
      </Label>
    </div>
  );
});
