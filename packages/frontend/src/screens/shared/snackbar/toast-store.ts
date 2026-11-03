import { makeAutoObservable, observableRef } from "mobx";
import type { ReactNode } from "preact/compat";

export type ToastVariant = "success" | "error" | "loading";

export type Toast = {
  id: number;
  variant: ToastVariant;
  title?: string;
  message: ReactNode;
  duration: number;
};

class ToastStore {
  toasts: Toast[] = [];
  lastId = 0;

  constructor() {
    makeAutoObservable(this, { toasts: observableRef }, { autoBind: true });
  }

  show(toast: Omit<Toast, "id">) {
    this.lastId += 1;
    const id = this.lastId;
    this.toasts = [...this.toasts, { ...toast, id }];
    return id;
  }

  close(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  }
}

export const toastStore = new ToastStore();
