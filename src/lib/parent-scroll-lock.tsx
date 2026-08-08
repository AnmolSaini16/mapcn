import * as React from "react";
import type { ViewProps } from "react-native";

type ParentScrollLockContextValue = {
  setScrollEnabled: (enabled: boolean) => void;
};

type MapTouchScrollLockHandlers = Pick<
  ViewProps,
  "onTouchStart" | "onTouchEnd" | "onTouchCancel"
>;

const ParentScrollLockContext =
  React.createContext<ParentScrollLockContextValue | null>(null);

export function ParentScrollLockProvider({
  children,
  setScrollEnabled,
}: {
  children: React.ReactNode;
  setScrollEnabled: (enabled: boolean) => void;
}) {
  const value = { setScrollEnabled };

  return (
    <ParentScrollLockContext.Provider value={value}>
      {children}
    </ParentScrollLockContext.Provider>
  );
}

export function useParentScrollLock() {
  return React.useContext(ParentScrollLockContext);
}

export function useLockParentScrollOnMapTouch(): MapTouchScrollLockHandlers {
  const lock = useParentScrollLock();

  if (!lock) {
    return {};
  }

  return {
    onTouchStart: () => {
      lock.setScrollEnabled(false);
    },
    onTouchEnd: () => {
      lock.setScrollEnabled(true);
    },
    onTouchCancel: () => {
      lock.setScrollEnabled(true);
    },
  };
}
