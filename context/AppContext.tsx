import { ExpenseList } from "@/types/expenses";
import React, { createContext, useContext, useState } from "react";

export type AppContextType = {
  expenses: ExpenseList;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseList>>;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<ExpenseList>([]);

  return (
    <AppContext.Provider value={{ expenses, setExpenses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext)!;
}
