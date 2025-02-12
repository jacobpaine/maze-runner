import React, { createContext, useContext, useState, ReactNode } from "react";

interface NpcContextType {
  activeNpc: any | null;
  setActiveNpc: (npc: any | null) => void;
}

const NpcContext = createContext<NpcContextType | undefined>(undefined);

export const NpcProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeNpc, setActiveNpc] = useState<any | null>(null);

  return (
    <NpcContext.Provider value={{ activeNpc, setActiveNpc }}>
      {children}
    </NpcContext.Provider>
  );
};

export const useNpc = () => {
  const context = useContext(NpcContext);
  if (!context) {
    throw new Error("useNpc must be used within an NpcProvider");
  }
  return context;
};
