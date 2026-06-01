import { createContext, useContext, useRef, useState } from "react";

export const PlaygroundContext = createContext(null);

export function PlaygroundProvider({ children }) {
  const [pendingQuery, setPendingQuery] = useState("");
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const runQueryRef = useRef(null);
  const toggleHistoryRef = useRef(null);

  return (
    <PlaygroundContext.Provider
      value={{
        pendingQuery,
        setPendingQuery,
        runQueryRef,
        toggleHistoryRef,
        shortcutsModalOpen,
        setShortcutsModalOpen
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
}

export const usePlayground = () => useContext(PlaygroundContext);
