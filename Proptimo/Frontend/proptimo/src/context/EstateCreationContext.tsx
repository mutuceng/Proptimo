import React, { createContext, useContext, useState, type ReactNode } from "react";

type EstateCreationContextType = {
  estateId: string | null;
  setEstateId: (id: string) => void;
  typeId: string | null;
  setTypeId: (id: string) => void;
};

const EstateCreationContext = createContext<EstateCreationContextType | undefined>(undefined);

export const EstateCreationProvider = ({ children }: { children: ReactNode }) => {
  const [estateId, setEstateId] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<string | null>(null);

  return (
    <EstateCreationContext.Provider value={{ estateId, setEstateId, typeId, setTypeId }}>
      {children}
    </EstateCreationContext.Provider>
  );
};

export const useEstateCreation = () => {
  const ctx = useContext(EstateCreationContext);
  if (!ctx) throw new Error("useEstateCreation must be used within EstateCreationProvider");
  return ctx;
};
