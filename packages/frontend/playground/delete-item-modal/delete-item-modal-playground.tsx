import { type RouterOutput } from "api";
import { makeAutoObservable } from "mobx";
import { BooleanField, BooleanToggle } from "mobx-form-lite";
import { useState } from "react";
import { DeleteItemModal } from "../../src/screens/shared/delete-item-modal.tsx";
import { Button } from "../../src/ui/button.tsx";
import { ShadcnButton } from "../../src/ui/shadcn/button.tsx";
import {
  BooleanProp,
  PreviewFrame,
  PropGroup,
  PropsPanel,
} from "../playground-components.tsx";

type LibraryItemDeletionInfo = RouterOutput["libraryItem"]["deletionInfo"];

function getDeleteModalTarget(itemName: "deck" | "folder") {
  switch (itemName) {
    case "deck":
      return { type: "deck", deckId: 1 } as const;
    case "folder":
      return { type: "folder", folderId: 1 } as const;
    default:
      return itemName satisfies never;
  }
}

function makeDeleteItemModalForm(itemName: "deck" | "folder") {
  return {
    target: getDeleteModalTarget(itemName),
    removeForOtherUsers: new BooleanField(false),
    removeFromPublicCatalog: new BooleanField(false),
  };
}

class DeleteItemModalPlaygroundStore {
  itemName: "deck" | "folder" = "deck";
  isOwner = new BooleanToggle(true);
  isUsedByOthers = new BooleanToggle(true);
  isPublic = new BooleanToggle(false);
  isDeletingToggle = new BooleanToggle(false);
  form: ReturnType<typeof makeDeleteItemModalForm> | null =
    makeDeleteItemModalForm("deck");
  lastAction: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isOpen() {
    return !!this.form;
  }

  get isDeleting() {
    return this.isDeletingToggle.value;
  }

  get info(): LibraryItemDeletionInfo {
    return {
      ...getDeleteModalTarget(this.itemName),
      canRemoveForOtherUsers: this.isOwner.value && this.isUsedByOthers.value,
      canRemoveFromPublicCatalog: this.isOwner.value && this.isPublic.value,
      otherUserCount: this.isUsedByOthers.value ? 3 : 0,
    };
  }

  get infoError() {
    return null;
  }

  setItemName(itemName: "deck" | "folder") {
    this.itemName = itemName;
    if (this.form) {
      this.form = makeDeleteItemModalForm(itemName);
    }
  }

  open() {
    this.form = makeDeleteItemModalForm(this.itemName);
  }

  close() {
    this.form = null;
  }

  async submit() {
    this.lastAction = `Deleted ${this.itemName}`;
    this.form = null;
  }
}

export function DeleteItemModalPlayground() {
  const [store] = useState(() => new DeleteItemModalPlaygroundStore());

  return (
    <>
      <PreviewFrame>
        <div className="flex w-full flex-col gap-3">
          <Button type="button" onClick={store.open}>
            Open delete modal
          </Button>
          {store.lastAction ? (
            <p className="m-0 text-center text-sm text-hint">
              {store.lastAction}
            </p>
          ) : null}
        </div>
      </PreviewFrame>

      {store.isOpen ? (
        <DeleteItemModal key={store.info.type} store={store} />
      ) : null}

      <PropsPanel>
        <PropGroup label="Item">
          <div className="flex gap-1.5">
            {(["deck", "folder"] as const).map((value) => (
              <ShadcnButton
                type="button"
                size="sm"
                variant={store.itemName === value ? "default" : "outline"}
                key={value}
                onClick={() => store.setItemName(value)}
              >
                {value}
              </ShadcnButton>
            ))}
          </div>
        </PropGroup>
        <PropGroup label="Eligibility">
          <BooleanProp
            id="delete-modal-owner"
            label="Owner"
            checked={store.isOwner.value}
            onCheckedChange={store.isOwner.setValue}
          />
          <BooleanProp
            id="delete-modal-used-by-others"
            label="Used by other people"
            checked={store.isUsedByOthers.value}
            onCheckedChange={store.isUsedByOthers.setValue}
          />
          <BooleanProp
            id="delete-modal-public"
            label="Public catalog"
            checked={store.isPublic.value}
            onCheckedChange={store.isPublic.setValue}
          />
        </PropGroup>
        <PropGroup label="State">
          <BooleanProp
            id="delete-modal-loading"
            label="Deleting"
            checked={store.isDeleting}
            onCheckedChange={store.isDeletingToggle.setValue}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}
