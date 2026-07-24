import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { House, RotateCcw } from "lucide-react";
import { Badge } from "../src/ui/badge.tsx";
import { Button } from "../src/ui/button.tsx";
import { Chip } from "../src/ui/chip.tsx";
import { ProgressBar } from "../src/ui/progress-bar.tsx";
import { cn } from "../src/ui/cn.ts";
import { theme } from "../src/ui/theme.tsx";
import { ShadcnButton } from "./ui/button.tsx";
import { ShadcnCheckbox } from "./ui/checkbox.tsx";
import { ShadcnInput } from "./ui/input.tsx";
import { ShadcnLabel } from "./ui/label.tsx";
import {
  type CatalogCountry,
  CatalogList,
  CatalogRadioList,
  CatalogSelect,
  CatalogSnackbar,
  catalogCountries,
} from "./catalog-stories.tsx";
import { CatalogModals, type ModalStoryId } from "./modal-stories.tsx";

const PLAYGROUND_COMPONENTS = [
  {
    id: "button",
    label: "Button",
  },
  {
    id: "select",
    label: "Select",
  },
  {
    id: "snackbar",
    label: "Snackbar",
  },
  {
    id: "list",
    label: "List",
  },
  {
    id: "radio-list",
    label: "Radio list",
  },
  {
    id: "modals",
    label: "Modals",
    propsPanel: false,
  },
  {
    id: "chip",
    label: "Chip",
  },
  {
    id: "badge",
    label: "Badge",
  },
  {
    id: "progress-bar",
    label: "Progress bar",
  },
] as const;

type PlaygroundComponentId = (typeof PLAYGROUND_COMPONENTS)[number]["id"];

function isPlaygroundComponentId(
  value: string | null,
): value is PlaygroundComponentId {
  return PLAYGROUND_COMPONENTS.some((component) => component.id === value);
}

function getSelectedComponentId(): PlaygroundComponentId {
  const value = new URLSearchParams(window.location.search).get("component");
  return isPlaygroundComponentId(value) ? value : "button";
}

const PropsPanelContext = createContext<HTMLDivElement | null>(null);

function PropsPanel({ children }: { children: ReactNode }) {
  const container = useContext(PropsPanelContext);
  return container ? createPortal(children, container) : null;
}

export function Playground() {
  const [selectedId, setSelectedId] = useState(getSelectedComponentId);
  const [propsPanelContainer, setPropsPanelContainer] =
    useState<HTMLDivElement | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);

  const selectedComponent = PLAYGROUND_COMPONENTS.find(
    (component) => component.id === selectedId,
  )!;
  const showPropsPanel =
    !("propsPanel" in selectedComponent) || selectedComponent.propsPanel;

  useEffect(() => {
    const syncSelection = () => setSelectedId(getSelectedComponentId());
    window.addEventListener("popstate", syncSelection);
    return () => window.removeEventListener("popstate", syncSelection);
  }, []);

  const selectComponent = (componentId: PlaygroundComponentId) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("component", componentId);
    window.history.pushState(null, "", nextUrl);
    setSelectedId(componentId);
    setPreviewVersion(0);
  };

  return (
    <div
      className={cn(
        "grid h-screen min-w-[760px] overflow-hidden font-sans",
        showPropsPanel
          ? "grid-cols-[200px_minmax(320px,1fr)_280px]"
          : "grid-cols-[200px_minmax(320px,1fr)]",
      )}
    >
      <aside className="flex min-h-0 flex-col border-r border-border bg-background">
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4 text-[15px] font-semibold">
          <img
            className="size-[30px] object-contain"
            src="/img/logo.png"
            alt=""
          />
          <span>Playground</span>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          {PLAYGROUND_COMPONENTS.map((component) => (
            <button
              type="button"
              key={component.id}
              className={cn(
                "h-9 rounded-md px-2.5 text-left text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                component.id === selectedId &&
                  "bg-accent font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => selectComponent(component.id)}
            >
              {component.label}
            </button>
          ))}
        </nav>
        <a
          className="flex h-14 shrink-0 items-center gap-2.5 border-t border-border px-[18px] text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          href="/"
        >
          <House size={16} />
          App
        </a>
      </aside>

      <section className="flex min-h-0 min-w-0 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b border-border bg-background px-5">
          <h1 className="m-0 text-base font-semibold leading-none text-foreground">
            {selectedComponent.label}
          </h1>
        </header>

        <main className="grid min-h-0 min-w-0 flex-1 place-items-center overflow-auto bg-[var(--tg-theme-secondary-bg-color)] p-8">
          <PropsPanelContext.Provider
            value={showPropsPanel ? propsPanelContainer : null}
          >
            <ComponentPreview
              key={`${selectedId}-${previewVersion}`}
              componentId={selectedId}
            />
          </PropsPanelContext.Provider>
        </main>
      </section>

      {showPropsPanel && (
        <aside className="flex min-h-0 flex-col border-l border-border bg-background">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border py-0 pr-3 pl-4">
            <h2 className="m-0 text-base font-semibold leading-none text-foreground">
              Props
            </h2>
            <ShadcnButton
              type="button"
              variant="ghost"
              size="icon"
              title="Reset props"
              onClick={() => setPreviewVersion((version) => version + 1)}
            >
              <RotateCcw size={15} />
            </ShadcnButton>
          </header>
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 pb-6"
            ref={setPropsPanelContainer}
          />
        </aside>
      )}
    </div>
  );
}

function ComponentPreview({
  componentId,
}: {
  componentId: PlaygroundComponentId;
}) {
  switch (componentId) {
    case "button":
      return <ButtonPlayground />;
    case "select":
      return <SelectPlayground />;
    case "snackbar":
      return <SnackbarPlayground />;
    case "list":
      return <ListPlayground />;
    case "radio-list":
      return <RadioListPlayground />;
    case "modals":
      return <ModalsPlayground />;
    case "chip":
      return <ChipPlayground />;
    case "badge":
      return <BadgePlayground />;
    case "progress-bar":
      return <ProgressBarPlayground />;
    default:
      return componentId satisfies never;
  }
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full max-w-[320px] place-items-center text-[var(--tg-theme-text-color)]">
      {children}
    </div>
  );
}

function PropGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <section className="border-t border-border py-[18px] first:border-t-0">
      <h3 className="mb-3.5 text-xs font-semibold text-muted-foreground">
        {label}
      </h3>
      <div className="space-y-3.5">{children}</div>
    </section>
  );
}

function TextProp({
  id,
  label,
  onChange,
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ShadcnLabel htmlFor={id}>{label}</ShadcnLabel>
      <ShadcnInput
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function BooleanProp({
  checked,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-4">
      <ShadcnLabel htmlFor={id}>{label}</ShadcnLabel>
      <ShadcnCheckbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
    </div>
  );
}

function ButtonPlayground() {
  const [label, setLabel] = useState("Review cards");
  const [outline, setOutline] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [mainColor, setMainColor] = useState(theme.buttonColorComputed);

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <Button outline={outline} disabled={disabled} mainColor={mainColor}>
            {label || "Button"}
          </Button>
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Content">
          <TextProp
            id="button-label"
            label="children"
            value={label}
            onChange={setLabel}
          />
        </PropGroup>
        <PropGroup label="Appearance">
          <div className="flex flex-col gap-2">
            <ShadcnLabel htmlFor="button-color">mainColor</ShadcnLabel>
            <div className="grid grid-cols-[38px_minmax(0,1fr)] items-center gap-2.5">
              <ShadcnInput
                className="w-[38px] p-1"
                id="button-color"
                type="color"
                value={mainColor}
                onChange={(event) => setMainColor(event.target.value)}
              />
              <code className="font-mono text-[11px] text-muted-foreground">
                {mainColor}
              </code>
            </div>
          </div>
          <BooleanProp
            id="button-outline"
            label="outline"
            checked={outline}
            onCheckedChange={setOutline}
          />
          <BooleanProp
            id="button-disabled"
            label="disabled"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function SelectPlayground() {
  const [value, setValue] = useState<CatalogCountry>("us");

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <CatalogSelect value={value} onChange={setValue} />
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Value">
          <div className="flex flex-wrap gap-1.5">
            {catalogCountries.map((country) => (
              <ShadcnButton
                type="button"
                size="sm"
                variant={value === country.value ? "default" : "outline"}
                key={country.value}
                onClick={() => setValue(country.value)}
              >
                {country.value.toUpperCase()}
              </ShadcnButton>
            ))}
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function SnackbarPlayground() {
  const [message, setMessage] = useState("This is a success message");
  const [variant, setVariant] = useState<"error" | "success">("success");
  const [duration, setDuration] = useState(10000);

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <CatalogSnackbar
            duration={duration}
            message={message}
            variant={variant}
          />
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Content">
          <TextProp
            id="snackbar-message"
            label="message"
            value={message}
            onChange={setMessage}
          />
        </PropGroup>
        <PropGroup label="Behavior">
          <div className="flex flex-col gap-2">
            <ShadcnLabel>variant</ShadcnLabel>
            <div className="flex gap-1.5">
              {(["success", "error"] as const).map((value) => (
                <ShadcnButton
                  type="button"
                  size="sm"
                  variant={variant === value ? "default" : "outline"}
                  key={value}
                  onClick={() => setVariant(value)}
                >
                  {value}
                </ShadcnButton>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ShadcnLabel htmlFor="snackbar-duration">duration</ShadcnLabel>
            <ShadcnInput
              id="snackbar-duration"
              type="number"
              min="0"
              value={duration}
              onChange={(event) =>
                setDuration(Math.max(0, Number(event.target.value)))
              }
            />
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function ListPlayground() {
  const [multipleIcons, setMultipleIcons] = useState(false);

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <CatalogList multipleIcons={multipleIcons} />
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Appearance">
          <BooleanProp
            id="list-multiple-icons"
            label="multipleIcons"
            checked={multipleIcons}
            onCheckedChange={setMultipleIcons}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function RadioListPlayground() {
  const [allowNone, setAllowNone] = useState(false);

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <CatalogRadioList key={String(allowNone)} allowNone={allowNone} />
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Options">
          <BooleanProp
            id="radio-list-allow-none"
            label="allowNone"
            checked={allowNone}
            onCheckedChange={setAllowNone}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function ModalsPlayground() {
  const [selectedModalId, setSelectedModalId] =
    useState<ModalStoryId>("card-type");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (modalId: ModalStoryId) => {
    setSelectedModalId(modalId);
    setIsOpen(true);
  };

  return (
    <CatalogModals
      activeModalId={isOpen ? selectedModalId : null}
      onClose={() => setIsOpen(false)}
      onOpen={openModal}
    />
  );
}

function ChipPlayground() {
  const [label, setLabel] = useState("Difficult");
  const [isSelected, setIsSelected] = useState(true);
  const [fullWidth, setFullWidth] = useState(false);

  return (
    <>
      <PreviewFrame>
        <div className={cn("w-full", !fullWidth && "w-fit")}>
          <Chip
            isSelected={isSelected}
            fullWidth={fullWidth}
            onClick={() => setIsSelected((selected) => !selected)}
          >
            {label || "Chip"}
          </Chip>
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Content">
          <TextProp
            id="chip-label"
            label="children"
            value={label}
            onChange={setLabel}
          />
        </PropGroup>
        <PropGroup label="State">
          <BooleanProp
            id="chip-selected"
            label="isSelected"
            checked={isSelected}
            onCheckedChange={setIsSelected}
          />
          <BooleanProp
            id="chip-full-width"
            label="fullWidth"
            checked={fullWidth}
            onCheckedChange={setFullWidth}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}

const BADGE_VARIANTS = ["default", "secondary", "disabled"] as const;
type BadgeVariant = (typeof BADGE_VARIANTS)[number];

function BadgePlayground() {
  const [label, setLabel] = useState("12 new");
  const [variant, setVariant] = useState<BadgeVariant>("default");

  return (
    <>
      <PreviewFrame>
        <Badge variant={variant}>{label || "Badge"}</Badge>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Content">
          <TextProp
            id="badge-label"
            label="children"
            value={label}
            onChange={setLabel}
          />
        </PropGroup>
        <PropGroup label="Appearance">
          <div className="flex flex-col gap-2">
            <ShadcnLabel>variant</ShadcnLabel>
            <div className="flex flex-wrap gap-1.5">
              {BADGE_VARIANTS.map((value) => (
                <ShadcnButton
                  type="button"
                  size="sm"
                  variant={variant === value ? "default" : "outline"}
                  key={value}
                  onClick={() => setVariant(value)}
                >
                  {value}
                </ShadcnButton>
              ))}
            </div>
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}

function ProgressBarPlayground() {
  const [value, setValue] = useState(6);
  const [max, setMax] = useState(10);

  const updateMax = (nextMax: number) => {
    const safeMax = Math.max(1, nextMax);
    setMax(safeMax);
    setValue((currentValue) => Math.min(currentValue, safeMax));
  };

  return (
    <>
      <PreviewFrame>
        <div className="w-full">
          <ProgressBar value={value} max={max} />
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Progress">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <ShadcnLabel htmlFor="progress-value">value</ShadcnLabel>
              <code className="font-mono text-[11px] text-muted-foreground">
                {value}
              </code>
            </div>
            <input
              className="h-1 w-full cursor-pointer accent-primary"
              id="progress-value"
              type="range"
              min="0"
              max={max}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <ShadcnLabel htmlFor="progress-max">max</ShadcnLabel>
            <ShadcnInput
              id="progress-max"
              type="number"
              min="1"
              value={max}
              onChange={(event) => updateMax(Number(event.target.value))}
            />
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}
