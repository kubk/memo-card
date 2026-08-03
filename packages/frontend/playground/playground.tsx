import { useEffect, useState, type ReactNode } from "react";
import {
  House,
  Languages,
  Monitor,
  PanelLeft,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import {
  isLanguage,
  languageSharedToHuman,
  languagesShared,
} from "api";
import { Badge } from "../src/ui/badge.tsx";
import { Button } from "../src/ui/button.tsx";
import { BottomSheetPortalProvider } from "../src/ui/bottom-sheet/bottom-sheet.tsx";
import { Chip } from "../src/ui/chip.tsx";
import { ProgressBar } from "../src/ui/progress-bar.tsx";
import { BrowserPlatform } from "../src/lib/platform/browser/browser-platform.ts";
import { platform } from "../src/lib/platform/platform.ts";
import { userStore } from "../src/store/user-store.ts";
import { cn } from "../src/ui/cn.ts";
import { theme } from "../src/ui/theme.tsx";
import { ShadcnButton } from "../src/ui/shadcn/button.tsx";
import { ShadcnInput } from "../src/ui/shadcn/input.tsx";
import { ShadcnLabel } from "../src/ui/shadcn/label.tsx";
import { Tabs, TabsList, TabsTrigger } from "../src/ui/shadcn/tabs.tsx";
import {
  ShadcnSelect,
  ShadcnSelectContent,
  ShadcnSelectGroup,
  ShadcnSelectItem,
  ShadcnSelectTrigger,
  ShadcnSelectValue,
} from "../src/ui/shadcn/select.tsx";
import {
  type CatalogCountry,
  CatalogList,
  CatalogRadioList,
  CatalogSelect,
  CatalogSnackbar,
  catalogCountries,
} from "./catalog-stories.tsx";
import { CatalogModals, type ModalStoryId } from "./modal-stories.tsx";
import { ProPage } from "../src/screens/pro/pro-page.tsx";
import { DeleteItemModalPlayground } from "./delete-item-modal/delete-item-modal-playground.tsx";
import { BottomNavigationPlayground } from "./bottom-navigation-playground.tsx";
import { LeaderboardPlayground } from "./leaderboard-playground.tsx";
import {
  BooleanProp,
  PreviewFrame,
  PropGroup,
  PropsPanel,
  PropsPanelContext,
} from "./playground-components.tsx";

const PLAYGROUND_COMPONENTS = [
  {
    id: "leaderboard",
    label: "Leaderboard",
  },
  {
    id: "bottom-navigation",
    label: "Bottom navigation",
    propsPanel: false,
  },
  {
    id: "pro-page",
    label: "Pro page",
    propsPanel: false,
  },
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
    id: "delete-modal",
    label: "Delete modal",
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

const PLAYGROUND_HOME_SECTIONS = [
  {
    label: "Screens",
    componentIds: ["leaderboard", "bottom-navigation", "pro-page"],
  },
  {
    label: "Controls",
    componentIds: ["button", "select", "radio-list"],
  },
  {
    label: "Content",
    componentIds: ["list", "chip", "badge"],
  },
  {
    label: "Feedback",
    componentIds: ["snackbar", "modals", "delete-modal", "progress-bar"],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  componentIds: ReadonlyArray<PlaygroundComponentId>;
}>;

const SIDEBAR_OPEN_STORAGE_KEY = "playground-sidebar-open";

const DEVICES = [
  {
    id: "iphone",
    label: "iPhone",
    icon: Smartphone,
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: Monitor,
  },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

function isDeviceId(value: string): value is DeviceId {
  return DEVICES.some((device) => device.id === value);
}

function isPlaygroundComponentId(
  value: string | null,
): value is PlaygroundComponentId {
  return PLAYGROUND_COMPONENTS.some((component) => component.id === value);
}

function getSelectedComponentId(): PlaygroundComponentId | null {
  const value = new URLSearchParams(window.location.search).get("component");
  return isPlaygroundComponentId(value) ? value : null;
}

function getSidebarOpen() {
  return window.localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY) !== "false";
}

export function Playground() {
  const [selectedId, setSelectedId] = useState(getSelectedComponentId);
  const [sidebarOpen, setSidebarOpen] = useState(getSidebarOpen);
  const [propsPanelContainer, setPropsPanelContainer] =
    useState<HTMLDivElement | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [deviceId, setDeviceId] = useState<DeviceId>("iphone");

  const selectedComponent = PLAYGROUND_COMPONENTS.find(
    (component) => component.id === selectedId,
  );
  const showPropsPanel =
    selectedComponent !== undefined &&
    (!("propsPanel" in selectedComponent) || selectedComponent.propsPanel);

  useEffect(() => {
    const syncSelection = () => setSelectedId(getSelectedComponentId());
    window.addEventListener("popstate", syncSelection);
    return () => window.removeEventListener("popstate", syncSelection);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    if (!(platform instanceof BrowserPlatform)) {
      return;
    }

    const browserPlatform = platform;
    browserPlatform.isMobile = deviceId === "iphone";

    return () => {
      browserPlatform.isMobile =
        window.matchMedia("(max-width: 600px)").matches;
    };
  }, [deviceId]);

  const selectComponent = (componentId: PlaygroundComponentId) => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("component", componentId);
    window.history.pushState(null, "", nextUrl);
    setSelectedId(componentId);
    setPreviewVersion(0);
  };

  const showComponentSelector = () => {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete("component");
    window.history.pushState(null, "", nextUrl);
    setSelectedId(null);
    setPreviewVersion(0);
  };

  const selectLanguage = (value: string) => {
    if (!isLanguage(value)) {
      return;
    }

    platform.setLanguageCached(value);
  };

  if (selectedComponent === undefined) {
    return <PlaygroundHome onSelect={selectComponent} />;
  }

  return (
    <div
      dir="ltr"
      className={cn(
        "grid h-screen min-w-[560px] overflow-hidden font-sans transition-[grid-template-columns] duration-200 ease-linear",
        showPropsPanel
          ? sidebarOpen
            ? "grid-cols-[200px_minmax(280px,1fr)_280px]"
            : "grid-cols-[0px_minmax(280px,1fr)_280px]"
          : sidebarOpen
            ? "grid-cols-[200px_minmax(280px,1fr)]"
            : "grid-cols-[0px_minmax(280px,1fr)]",
      )}
    >
      <div className="min-h-0 min-w-0 overflow-hidden">
        <aside className="flex h-full w-[200px] flex-col border-r border-border bg-background">
          <button
            type="button"
            className="flex h-14 shrink-0 items-center gap-2.5 border-0 border-b border-border bg-transparent px-4 text-left text-[15px] font-semibold text-foreground hover:bg-muted"
            onClick={showComponentSelector}
          >
            <img
              className="size-[30px] object-contain"
              src="/img/logo.png"
              alt=""
            />
            <span>Playground</span>
          </button>

          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden p-2">
            {PLAYGROUND_COMPONENTS.map((component) => (
              <button
                type="button"
                key={component.id}
                className={cn(
                  "h-9 rounded-md px-2.5 text-left text-[13px] font-medium text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground",
                  component.id === selectedId &&
                    "bg-accent font-semibold text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => selectComponent(component.id)}
              >
                {component.label}
              </button>
            ))}
          </nav>
          <div className="shrink-0 border-t border-border p-2 pb-0">
            <ShadcnSelect
              dir="ltr"
              value={userStore.language}
              onValueChange={selectLanguage}
            >
              <ShadcnSelectTrigger className="h-12 gap-2.5 border-0 bg-transparent px-2.5 py-0 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground focus:ring-0">
                <Languages className="shrink-0" size={16} />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[10px] font-semibold leading-none">
                    Language
                  </span>
                  <span className="mt-1 block text-[13px] font-medium leading-none text-foreground">
                    <ShadcnSelectValue />
                  </span>
                </span>
              </ShadcnSelectTrigger>
              <ShadcnSelectContent align="start" side="top" sideOffset={4}>
                <ShadcnSelectGroup>
                  {languagesShared.map((value) => (
                    <ShadcnSelectItem key={value} value={value}>
                      {languageSharedToHuman(value)}
                    </ShadcnSelectItem>
                  ))}
                </ShadcnSelectGroup>
              </ShadcnSelectContent>
            </ShadcnSelect>
          </div>
          <a
            className="flex h-14 shrink-0 items-center gap-2.5 px-[18px] text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            href="/"
          >
            <House size={16} />
            App
          </a>
        </aside>
      </div>

      <section className="flex min-h-0 min-w-0 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-1.5 border-b border-border bg-background px-3">
          <ShadcnButton
            type="button"
            variant="ghost"
            size="icon"
            title="Toggle sidebar"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <PanelLeft size={17} />
          </ShadcnButton>
          <Tabs
            value={deviceId}
            onValueChange={(value) => {
              if (isDeviceId(value)) {
                setDeviceId(value);
              }
            }}
          >
            <TabsList>
              {DEVICES.map((device) => (
                <TabsTrigger
                  className="h-7 px-2.5"
                  key={device.id}
                  title={device.label}
                  value={device.id}
                >
                  <device.icon size={16} />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </header>

        <main
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-[var(--tg-theme-secondary-bg-color)] p-4"
          dir={userStore.isRtl ? "rtl" : "ltr"}
        >
          <PropsPanelContext.Provider
            value={showPropsPanel ? propsPanelContainer : null}
          >
            <DeviceFrame deviceId={deviceId}>
              <ComponentPreview
                key={`${selectedId}-${previewVersion}`}
                componentId={selectedComponent.id}
              />
            </DeviceFrame>
          </PropsPanelContext.Provider>
        </main>
      </section>

      {showPropsPanel && (
        <aside className="flex min-h-0 flex-col border-l border-border bg-background">
          <header className="flex h-14 shrink-0 items-center justify-end border-b border-border px-3">
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

function PlaygroundHome({
  onSelect,
}: {
  onSelect: (componentId: PlaygroundComponentId) => void;
}) {
  return (
    <main className="grid h-screen min-w-[360px] place-items-center overflow-auto bg-background p-6 text-foreground">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-4">
          {PLAYGROUND_HOME_SECTIONS.map((section) => (
            <section key={section.label}>
              <h2 className="mb-3 text-center text-sm font-semibold text-muted-foreground">
                {section.label}
              </h2>
              <div className="flex flex-col gap-2">
                {section.componentIds.map((componentId) => {
                  const component = PLAYGROUND_COMPONENTS.find(
                    (item) => item.id === componentId,
                  )!;

                  return (
                    <button
                      type="button"
                      key={component.id}
                      className="min-h-11 w-full rounded-full border border-border bg-background px-3 py-2 text-center text-sm font-medium leading-tight text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none sm:text-base"
                      onClick={() => onSelect(component.id)}
                    >
                      {component.label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <a
          href="/"
          className="inline-flex h-9 items-center gap-2 self-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
        >
          <House size={16} />
          App
        </a>
      </div>
    </main>
  );
}

function ComponentPreview({
  componentId,
}: {
  componentId: PlaygroundComponentId;
}) {
  switch (componentId) {
    case "leaderboard":
      return <LeaderboardPlayground />;
    case "bottom-navigation":
      return <BottomNavigationPlayground />;
    case "pro-page":
      return (
        <div className="h-full w-full overflow-y-auto">
          <ProPage />
        </div>
      );
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
    case "delete-modal":
      return <DeleteItemModalPlayground />;
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

function DeviceFrame({
  children,
  deviceId,
}: {
  children: ReactNode;
  deviceId: DeviceId;
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  const content = (
    <BottomSheetPortalProvider container={portalContainer}>
      {children}
    </BottomSheetPortalProvider>
  );

  if (deviceId === "desktop") {
    return (
      <div
        className="relative flex min-h-[720px] w-full items-center justify-center overflow-hidden bg-secondary-bg"
        ref={setPortalContainer}
        style={{ transform: "translateZ(0)" }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-start justify-center px-0 py-4 sm:px-4 sm:py-6">
      <div
        className="relative flex h-[844px] w-[390px] shrink-0 items-center justify-center overflow-hidden bg-secondary-bg shadow-xl"
        ref={setPortalContainer}
        style={{ transform: "translateZ(0)" }}
      >
        {content}
      </div>
    </div>
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
        <PropGroup>
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
        <PropGroup>
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
        <PropGroup>
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
