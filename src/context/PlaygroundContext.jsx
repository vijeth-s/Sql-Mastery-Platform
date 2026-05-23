import { createContext, useContext, useState } from "react";

export const PlaygroundContext = createContext(null);

export function PlaygroundProvider({ children }) {
  const [pendingQuery, setPendingQuery] = useState("");

  return (
    <PlaygroundContext.Provider value={{ pendingQuery, setPendingQuery }}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export const usePlayground = () => useContext(PlaygroundContext);
