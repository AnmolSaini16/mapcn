import { Appearance } from "react-native";

type AppearanceListener = Parameters<typeof Appearance.addChangeListener>[0];

let override: "light" | "dark" | null = null;
const listeners = new Set<AppearanceListener>();

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

function notifyListeners() {
  const colorScheme = getResolvedColorScheme();
  for (const listener of listeners) {
    listener({ colorScheme });
  }
}

Appearance.getColorScheme = () => getResolvedColorScheme();

Appearance.setColorScheme = (scheme) => {
  override = scheme === "light" || scheme === "dark" ? scheme : null;
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
