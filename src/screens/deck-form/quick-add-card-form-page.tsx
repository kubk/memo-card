import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { QuickAddCardFormStore } from "./store/quick-add-card-form-store.ts";
import { CardPreview } from "./card-preview.tsx";
import { QuickAddForm } from "./quick-add-form.tsx";

export const QuickAddCardFormPage = observer(() => {
  const [quickAddCardStore] = useState(() => new QuickAddCardFormStore());

  if (quickAddCardStore.isCardPreviewSelected.value) {
    return (
      <CardPreview
        form={quickAddCardStore.form}
        onBack={quickAddCardStore.isCardPreviewSelected.setFalse}
      />
    );
  }

  return <QuickAddForm quickAddCardStore={quickAddCardStore} />;
});
