import Panel from "@/components/panel";
import { Styles } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";
import { ExpenseList } from "@/types/expenses";
import { useEffect } from "react";
import { View } from "react-native";

export default function Expenses() {
  const EXPENSE_LIST: ExpenseList = [
    { name: "Hola", amount: 5 },
    { description: "Gasto por no se", amount: 10 },
    { name: "Adios", description: "hola", amount: 20 },
    { name: "Adios 2", description: "hola 2", amount: 20 },
    { name: "Adios 3", description: "hola 3", amount: 35 },
  ];

  // Conseguir la cantidad total de gastos
  const { setExpenses } = useAppContext();
  const totalExpenses = EXPENSE_LIST.reduce((sum, exp) => sum + exp.amount, 0);
  useEffect(() => {
    setExpenses(EXPENSE_LIST);
  }, []);

  return (
    <View style={Styles.scrollview}>
      <Panel amount={totalExpenses} />
      {EXPENSE_LIST.map((exp, index) => (
        <Panel
          key={index}
          title={exp.name}
          description={exp.description}
          amount={exp.amount}
        />
      ))}
    </View>
  );
}
