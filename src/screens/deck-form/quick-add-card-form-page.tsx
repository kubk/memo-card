import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { QuickAddCardFormStore } from "./store/quick-add-card-form-store.ts";
import { CardFormWrapper } from "./card-form-wrapper.tsx";

export const QuickAddCardFormPage = observer(() => {
  const [quickAddCardStore] = useState(() => new QuickAddCardFormStore());

  return <CardFormWrapper cardFormStore={quickAddCardStore} />;
});
