import { Appearance } from "react-native";

type AppearanceListener = Parameters<typeof Appearance.addChangeListener>[0];
type ColorScheme = "light" | "dark";

const STORAGE_KEY = "mapcn-color-scheme";

let override: ColorScheme | null = null;
const listeners = new Set<AppearanceListener>();

function readStoredColorScheme(): ColorScheme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

function writeStoredColorScheme(scheme: ColorScheme | null) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (scheme === null) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, scheme);
  } catch {
    return;
  }
}

override = readStoredColorScheme();

function getSystemColorScheme(): "light" | "dark" {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

function getResolvedColorScheme(): "light" | "dark" {
  return override ?? getSystemColorScheme();
}

function syncDocumentThemeClass() {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle(
    "dark",
    getResolvedColorScheme() === "dark",
  );
}

function notifyListeners() {
  const colorScheme = getResolvedColorScheme();
  syncDocumentThemeClass();
  for (const listener of listeners) {
    listener({ colorScheme });
  }
}

Appearance.getColorScheme = () => getResolvedColorScheme();

Appearance.setColorScheme = (scheme) => {
  override = scheme === "light" || scheme === "dark" ? scheme : null;
  writeStoredColorScheme(override);
  notifyListeners();
};

Appearance.addChangeListener = (listener) => {
  listeners.add(listener);

  let mediaQuery: MediaQueryList | null = null;

  const onSystemChange = () => {
    if (override !== null) {
      return;
    }
    notifyListeners();
  };

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
  ) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", onSystemChange);
  }

  return {
    remove() {
      listeners.delete(listener);
      mediaQuery?.removeEventListener("change", onSystemChange);
    },
  };
};

syncDocumentThemeClass();
