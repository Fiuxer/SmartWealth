import { StyleSheet, Text, View } from "react-native";

interface MoneyTextProps {
  text: string;
  amount: number;
  color?: string;
}

export default function MoneyText({ text, amount, color = "#3DBFA0" }: MoneyTextProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.amount, { color }]}>
        ${amount.toFixed(2)}{" "}
      </Text>
      <Text style={styles.label}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginVertical: 2,
    alignItems: "center",
  },
  amount: {
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    color: "#333",
    fontSize: 14,
  },
});