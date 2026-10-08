import { LoginPlayground } from "./login-playground.tsx";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "preact/compat";
import {
  House,
  Languages,
  Monitor,
  PanelLeft,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import { isLanguage, languageSharedToHuman, languagesShared } from "api";
import { Badge } from "../src/ui/badge.tsx";
import { Button } from "../src/ui/button.tsx";
import { BottomSheetPortalProvider } from "../src/ui/bottom-sheet/bottom-sheet.tsx";
import { Chip } from "../src/ui/chip.tsx";
import { ProgressBar } from "../src/ui/progress-bar.tsx";
import { BrowserPlatform } from "../src/lib/platform/browser/browser-platform.ts";
import { platform } from "../src/lib/platform/platform.ts";
import { userStore } from "../src/store/user-store.ts";
import { cn } from "../src/ui/cn.ts";
import { PlaygroundButton } from "./ui/playground-button.tsx";
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
} from "./catalog-stories.tsx";
import { CatalogModals, type ModalStoryId } from "./modal-stories.tsx";
import { ProPagePlayground } from "./pro-page-playground.tsx";
import { DeleteItemModalPlayground } from "./delete-item-modal-playground.tsx";
import { BottomNavigationPlayground } from "./bottom-navigation-playground.tsx";
import { LeaderboardPlayground } from "./leaderboard-playground.tsx";
import { SharedDeckNotFoundPlayground } from "./shared-deck-not-found-playground.tsx";
import { CardReviewPlayground } from "./card-review-playground.tsx";
import { CardAudioPlayground } from "./card-audio-playground.tsx";
import { routeScreenContainerClassName } from "../src/lib/react/route-screen-container-class.ts";
import { BooleanProp, PropGroup, TextProp } from "./ui/prop-controls.tsx";
import { PreviewFrame } from "./ui/preview-frame.tsx";
import { PropsPanel, PropsPanelContext } from "./ui/props-panel.tsx";

const PLAYGROUND_COMPONENTS = [
  {
    id: "card-audio",
    label: "Card audio",
    layout: "component",
    propsPanel: false,
  },
  {
    id: "login",
    label: "Login",
    layout: "screen",
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    layout: "screen",
  },
  {
    id: "card-review",
    label: "Card review",
    layout: "screen",
  },
  {
    id: "bottom-navigation",
    label: "Bottom navigation",
    layout: "component",
    propsPanel: false,
  },
  {
    id: "deleted-deck",
    label: "Deleted deck",
    layout: "screen",
    propsPanel: false,
  },
  {
    id: "pro-page",
    label: "Pro page",
    layout: "screen",
  },
  {
    id: "button",
    label: "Button",
    layout: "component",
  },
  {
    id: "select",
    label: "Select",
    layout: "component",
    propsPanel: false,
  },
  {
    id: "snackbar",
    label: "Snackbar",
    layout: "component",
  },
  {
    id: "list",
    label: "List",
    layout: "component",
  },
  {
    id: "radio-list",
    label: "Radio list",
    layout: "component",
  },
  {
    id: "modals",
    label: "Modals",
    layout: "component",
    propsPanel: false,
  },
  {
    id: "delete-modal",
    label: "Delete modal",
    layout: "component",
  },
  {
    id: "chip",
    label: "Chip",
    layout: "component",
  },
  {
    id: "badge",
    label: "Badge",
    layout: "component",
  },
  {
    id: "progress-bar",
    label: "Progress bar",
    layout: "component",
  },
] as const;

type PlaygroundComponentId = (typeof PLAYGROUND_COMPONENTS)[number]["id"];

const PLAYGROUND_HOME_SECTIONS = [
  {
    label: "Screens",
    componentIds: [
      "login",
      "leaderboard",
      "card-review",
      "bottom-navigation",
      "deleted-deck",
      "pro-page",
    ],
  },
  {
    label: "Controls",
    componentIds: ["button", "select", "radio-list"],
  },
  {
    label: "Content",
    componentIds: ["list", "chip", "badge", "card-audio"],
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
  const propsPanelRef = useRef<HTMLElement>(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [deviceId, setDeviceId] = useState<DeviceId>("iphone");
  const [propsPanelOpen, setPropsPanelOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

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
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setPropsPanelOpen(false);
      }
    };

    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    propsPanelRef.current?.toggleAttribute(
      "inert",
      isMobileViewport && !propsPanelOpen,
    );
  }, [isMobileViewport, propsPanelOpen]);

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
        "grid h-screen min-w-0 grid-cols-1 overflow-hidden font-sans transition-[grid-template-columns] duration-200 ease-linear",
        showPropsPanel ? "md:min-w-[760px]" : "md:min-w-[560px]",
        showPropsPanel
          ? sidebarOpen
            ? "md:grid-cols-[200px_minmax(280px,1fr)_280px]"
            : "md:grid-cols-[0px_minmax(280px,1fr)_280px]"
          : sidebarOpen
            ? "md:grid-cols-[200px_minmax(280px,1fr)]"
            : "md:grid-cols-[0px_minmax(280px,1fr)]",
      )}
    >
      <div className="hidden min-h-0 min-w-0 overflow-hidden md:block">
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
          <PlaygroundButton
            type="button"
            variant="ghost"
            size="icon"
            title="Toggle sidebar"
            className="hidden md:inline-flex"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <PanelLeft size={17} />
          </PlaygroundButton>
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
          {showPropsPanel && (
            <PlaygroundButton
              type="button"
              variant="ghost"
              size="icon"
              title="Open props"
              className="ml-auto md:hidden"
              onClick={() => setPropsPanelOpen(true)}
            >
              <SlidersHorizontal size={17} />
            </PlaygroundButton>
          )}
        </header>

        <main
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-[var(--tg-theme-secondary-bg-color)] p-4"
          dir={userStore.isRtl ? "rtl" : "ltr"}
        >
          <PropsPanelContext.Provider
            value={showPropsPanel ? propsPanelContainer : null}
          >
            <DeviceFrame deviceId={deviceId} layout={selectedComponent.layout}>
              <ComponentPreview
                key={`${selectedId}-${previewVersion}`}
                componentId={selectedComponent.id}
              />
            </DeviceFrame>
          </PropsPanelContext.Provider>
        </main>
      </section>

      {showPropsPanel && (
        <aside
          ref={propsPanelRef}
          className={cn(
            "fixed inset-0 z-50 flex min-h-0 w-full flex-col border-l border-border bg-background shadow-xl transition-transform duration-200 ease-out md:static md:z-auto md:w-auto md:translate-x-0 md:shadow-none md:transition-none",
            propsPanelOpen
              ? "pointer-events-auto translate-x-0"
              : "pointer-events-none translate-x-full",
            "md:pointer-events-auto",
          )}
        >
          <header className="flex h-14 shrink-0 items-center justify-end border-b border-border px-3">
            <PlaygroundButton
              type="button"
              variant="ghost"
              size="icon"
              title="Reset props"
              onClick={() => setPreviewVersion((version) => version + 1)}
            >
              <RotateCcw size={15} />
            </PlaygroundButton>
            <PlaygroundButton
              type="button"
              variant="ghost"
              size="icon"
              title="Close props"
              className="ml-1 md:hidden"
              onClick={() => setPropsPanelOpen(false)}
            >
              <X size={17} />
            </PlaygroundButton>
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
                      className="min-h-11 w-full rounded-full border border-border bg-background px-3 py-2 text-center text-sm font-medium leading-tight text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-hidden sm:text-base"
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
          className="inline-flex h-9 items-center gap-2 self-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-hidden"
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
    case "card-audio":
      return <CardAudioPlayground />;
    case "login":
      return <LoginPlayground />;
    case "leaderboard":
      return <LeaderboardPlayground />;
    case "card-review":
      return <CardReviewPlayground />;
    case "bottom-navigation":
      return <BottomNavigationPlayground />;
    case "deleted-deck":
      return <SharedDeckNotFoundPlayground />;
    case "pro-page":
      return <ProPagePlayground />;
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
  layout,
}: {
  children: ReactNode;
  deviceId: DeviceId;
  layout: "component" | "screen";
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  useLayoutEffect(() => {
    if (!portalContainer) {
      return;
    }

    const updateViewportHeight = () => {
      portalContainer.style.setProperty(
        "--tg-viewport-height",
        `${portalContainer.clientHeight}px`,
      );
    };

    updateViewportHeight();
    const resizeObserver = new ResizeObserver(updateViewportHeight);
    resizeObserver.observe(portalContainer);
    return () => resizeObserver.disconnect();
  }, [portalContainer]);

  const screenContent =
    layout === "screen" ? (
      <div className={routeScreenContainerClassName}>{children}</div>
    ) : (
      children
    );

  const content = (
    <BottomSheetPortalProvider container={portalContainer}>
      {screenContent}
    </BottomSheetPortalProvider>
  );

  if (deviceId === "desktop") {
    return (
      <div
        className="relative flex h-[calc(100vh_-_88px)] min-h-[720px] w-full items-center justify-center overflow-hidden border border-border bg-secondary-bg"
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
        className="relative box-border flex h-[844px] w-[390px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-foreground/20 bg-secondary-bg"
        ref={setPortalContainer}
        style={{ transform: "translateZ(0)" }}
      >
        {content}
      </div>
    </div>
  );
}

function ButtonPlayground() {
  const [align, setAlign] = useState<"left" | "center">("left");
  const [disabled, setDisabled] = useState(false);

  const handleAlignChange = (value: string) => {
    if (value !== "left" && value !== "center") {
      return;
    }

    setAlign(value);
  };

  return (
    <>
      <PreviewFrame>
        <div className="flex w-full flex-col gap-3">
          <Button disabled={disabled} variant="main">
            Main
          </Button>
          <Button disabled={disabled} outline variant="main">
            Main outline
          </Button>
          <Button disabled={disabled} variant="danger">
            Danger
          </Button>
          <Button disabled={disabled} outline variant="danger">
            Danger outline
          </Button>
          <Button disabled={disabled} variant="secondary">
            Secondary
          </Button>
          <Button align={align} disabled={disabled} icon={<Plus size={24} />}>
            Add deck
          </Button>
        </div>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup label="Side alignment">
          <Tabs value={align} onValueChange={handleAlignChange}>
            <TabsList className="w-full">
              <TabsTrigger className="flex-1" value="left">
                Left
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="center">
                Center
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </PropGroup>
        <PropGroup>
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
                <PlaygroundButton
                  type="button"
                  size="sm"
                  variant={variant === value ? "default" : "outline"}
                  key={value}
                  onClick={() => setVariant(value)}
                >
                  {value}
                </PlaygroundButton>
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
                setDuration(Math.max(0, Number(event.currentTarget.value)))
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
                <PlaygroundButton
                  type="button"
                  size="sm"
                  variant={variant === value ? "default" : "outline"}
                  key={value}
                  onClick={() => setVariant(value)}
                >
                  {value}
                </PlaygroundButton>
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
              onChange={(event) => setValue(Number(event.currentTarget.value))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <ShadcnLabel htmlFor="progress-max">max</ShadcnLabel>
            <ShadcnInput
              id="progress-max"
              type="number"
              min="1"
              value={max}
              onChange={(event) => updateMax(Number(event.currentTarget.value))}
            />
          </div>
        </PropGroup>
      </PropsPanel>
    </>
  );
}
