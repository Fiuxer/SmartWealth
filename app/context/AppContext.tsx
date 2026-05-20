import { createContext, ReactNode, useContext, useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type EntryType    = "gasto" | "ingreso";
export type Frecuencia   = "semanal" | "mensual" | "anual";
export type TipoIngreso  = "fijo" | "variable";

export interface Entry {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: EntryType;
}

export interface Income {
  id: number;
  name: string;
  amount: number;
  tipoIngreso: TipoIngreso;
  frecuencia: Frecuencia;
}

interface AppContextType {
  entries: Entry[];
  addEntry: (e: Entry) => void;
  incomes: Income[];
  addIncome: (i: Income) => void;
  editIncome: (i: Income) => void;
  deleteIncome: (id: number) => void;
  total: number;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);

  // Total global = suma de ingresos registrados en main - gastos
  const totalIngresos = entries.reduce(
    (acc, e) => (e.type === "ingreso" ? acc + e.amount : acc - e.amount),
    0
  );

  // También sumamos los ingresos de earnings
  const totalEarnings = incomes.reduce((acc, i) => acc + i.amount, 0);

  const total = totalIngresos + totalEarnings;

  function addEntry(e: Entry) {
    setEntries((prev) => [...prev, e]);
  }

  function addIncome(i: Income) {
    setIncomes((prev) => [...prev, i]);
  }

  function editIncome(updated: Income) {
    setIncomes((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  function deleteIncome(id: number) {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <AppContext.Provider
      value={{ entries, addEntry, incomes, addIncome, editIncome, deleteIncome, total }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
}