import { useState } from "react";
import { EyeIcon, TrashIcon } from "lucide-react";
import {
  notifyError,
  notifySuccess,
} from "../src/screens/shared/snackbar/snackbar.tsx";
import { SnackbarProviderWrapper } from "../src/screens/shared/snackbar/snackbar-provider-wrapper.tsx";
import { Button } from "../src/ui/button.tsx";
import { CardNumber } from "../src/ui/card-number.tsx";
import { cn } from "../src/ui/cn.ts";
import { Flex } from "../src/ui/flex.tsx";
import { List } from "../src/ui/list.tsx";
import { ProIcon } from "../src/ui/pro-icon.tsx";
import { DropdownOrVault } from "../src/ui/dropdown-or-vault.tsx";
import { RadioBoxEmpty } from "../src/ui/radio-list/radio-box-empty.tsx";
import { RadioBoxFilled } from "../src/ui/radio-list/radio-box-filled.tsx";
import { RadioList } from "../src/ui/radio-list/radio-list.tsx";
import { reset } from "../src/ui/reset.ts";

export type CatalogCountry = "de" | "fr" | "us";

const catalogCountries: Array<{
  value: CatalogCountry;
  label: string;
}> = [
  { value: "us", label: "United States" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
];

export function CatalogSelect({
  onChange,
  value,
}: {
  onChange: (value: CatalogCountry) => void;
  value: CatalogCountry;
}) {
  return (
    <DropdownOrVault
      trigger={
        <span>
          {catalogCountries.find((country) => country.value === value)?.label}
        </span>
      }
      triggerClassName="text-left text-base text-link"
      options={catalogCountries.map((country) => ({
        icon:
          country.value === value ? (
            <RadioBoxFilled />
          ) : (
            <RadioBoxEmpty />
          ),
        text: country.label,
        onClick: () => onChange(country.value),
      }))}
    />
  );
}

export function CatalogSnackbar({
  duration,
  message,
  variant,
}: {
  duration: number;
  message: string;
  variant: "error" | "success";
}) {
  const showSnackbar = () => {
    if (variant === "success") {
      notifySuccess(message);
      return;
    }

    notifyError(false, { duration, message });
  };

  return (
    <>
      <SnackbarProviderWrapper />
      <Button onClick={showSnackbar}>Show snackbar</Button>
    </>
  );
}

function createListItem(index: number, multipleIcons: boolean) {
  return {
    text: (
      <div>
        <div>
          <CardNumber number={index + 1} />
          Test title
        </div>
        <div className="text-sm text-hint">
          Test description Test description Test description Test description
        </div>
      </div>
    ),
    right: multipleIcons ? (
      <Flex gap={8}>
        <button className={cn(reset.button, "text-base")} onClick={() => {}}>
          <EyeIcon size={24} className="text-button" />
        </button>
        <button className={cn(reset.button, "text-base")} onClick={() => {}}>
          <TrashIcon size={24} className="text-danger" />
        </button>
      </Flex>
    ) : (
      <button className={cn(reset.button, "text-base")} onClick={() => {}}>
        <TrashIcon size={24} className="text-danger" />
      </button>
    ),
  };
}

export function CatalogList({ multipleIcons }: { multipleIcons: boolean }) {
  const items = Array.from({ length: 3 }, (_, index) =>
    createListItem(index, multipleIcons),
  );

  if (!multipleIcons) {
    items.push({
      text: <div>Test</div>,
      right: <ProIcon />,
    });
  }

  return <List animateTap={false} items={items} />;
}

export function CatalogRadioList({ allowNone }: { allowNone: boolean }) {
  const [selectedId, setSelectedId] = useState<null | "1" | "2">(
    allowNone ? null : "1",
  );

  return (
    <RadioList<null | "1" | "2">
      selectedId={selectedId}
      options={[
        ...(allowNone ? [{ id: null, title: "None" }] : []),
        { id: "1", title: "Option 1" },
        { id: "2", title: "Option 2" },
      ]}
      onChange={setSelectedId}
    />
  );
}
