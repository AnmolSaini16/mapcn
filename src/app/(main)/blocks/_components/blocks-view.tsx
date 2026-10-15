"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LayoutGrid, Rows2 } from "lucide-react";
import { cn } from "@/lib/utils";

type BlocksViewMode = "grid" | "single";

const BlocksViewContext = createContext<{
  view: BlocksViewMode;
  setView: (view: BlocksViewMode) => void;
  openBlock: (name: string) => void;
} | null>(null);

function useBlocksView() {
  const context = useContext(BlocksViewContext);
  if (!context) {
    throw new Error("useBlocksView must be used within BlocksViewProvider");
  }
  return context;
}

export function BlocksViewProvider({
  blockNames,
  children,
}: {
  blockNames: string[];
  children: React.ReactNode;
}) {
  const [view, setView] = useState<BlocksViewMode>("grid");
  const [openRequest, setOpenRequest] = useState(0);
  const targetRef = useRef<string | null>(null);

  const openBlock = useCallback((name: string) => {
    targetRef.current = name;
    setView("single");
    setOpenRequest((request) => request + 1);
    if (window.location.hash !== `#${name}`) {
      window.history.replaceState(null, "", `#${name}`);
    }
  }, []);

  useEffect(() => {
    function openFromHash() {
      const name = window.location.hash.slice(1);
      if (blockNames.includes(name)) openBlock(name);
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [blockNames, openBlock]);

  useEffect(() => {
    const target = targetRef.current;
    if (view !== "single" || !target) return;
    document.getElementById(target)?.scrollIntoView({ block: "start" });
    targetRef.current = null;
  }, [view, openRequest]);

  return (
    <BlocksViewContext.Provider value={{ view, setView, openBlock }}>
      {children}
    </BlocksViewContext.Provider>
  );
}

export function BlocksView({
  mode,
  children,
}: {
  mode: BlocksViewMode;
  children: React.ReactNode;
}) {
  const { view } = useBlocksView();
  return view === mode ? children : null;
}

export function BlocksViewSwitch() {
  const { view, setView } = useBlocksView();

  const options = [
    { mode: "grid", label: "Grid view", icon: LayoutGrid },
    { mode: "single", label: "List view", icon: Rows2 },
  ] as const;

  return (
    <div
      role="group"
      aria-label="Blocks layout"
      className="bg-background dark:border-input dark:bg-input/30 flex items-center gap-0.5 rounded-lg border p-0.5 shadow-xs"
    >
      {options.map(({ mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          aria-pressed={view === mode}
          onClick={() => {
            setView(mode);
            window.history.replaceState(null, "", window.location.pathname);
          }}
          className={cn(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-8 items-center justify-center rounded-md transition-colors outline-none focus-visible:ring-[3px]",
            view === mode && "bg-accent text-foreground",
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export function OpenBlockLink({
  name,
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "href" | "onClick"> & { name: string }) {
  const { openBlock } = useBlocksView();

  return (
    <a
      href={`#${name}`}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        openBlock(name);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
