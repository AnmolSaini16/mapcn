import * as React from "react";
import type { ScrollView } from "react-native";

type DocsScrollContextValue = {
  scrollRef: React.RefObject<ScrollView | null>;
  sectionsBaseY: number;
  registerSection: (slug: string, y: number) => void;
  scrollToSection: (slug: string) => void;
  activeSection: string | null;
  setActiveSection: (slug: string | null) => void;
  sectionOffsets: React.RefObject<Record<string, number>>;
};

const DocsScrollContext = React.createContext<DocsScrollContextValue | null>(
  null,
);

export function DocsScrollProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DocsScrollContextValue;
}) {
  return (
    <DocsScrollContext.Provider value={value}>
      {children}
    </DocsScrollContext.Provider>
  );
}

export function useDocsScroll() {
  const context = React.useContext(DocsScrollContext);
  if (!context) {
    throw new Error("useDocsScroll must be used within DocsLayout");
  }
  return context;
}
