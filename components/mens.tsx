import { Colors, Fonts } from "@/constants/theme";
import { CurrencyToText } from "@/utils/formatting";
import { StyleSheet, Text, View } from "react-native";

interface PanelProps {
  amount: number;
  time?: string;
}

export default function ({ amount, time }: PanelProps) {
  return (
    <View style={[{ marginHorizontal: 20, flexDirection: "row" }]}>
      <Text style={style.first}>${CurrencyToText(amount)}</Text>
      <Text style={style.second}>/{time ?? "mes"}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  first: {
    color: Colors.light.primary,
    fontFamily: Fonts.primaryBold,
    fontSize: 12 * 4,
  },
  second: {
    color: Colors.light.tabIconDefault,
    fontFamily: Fonts.secondary,
    fontSize: 12 * 2,
    textAlignVertical: "bottom",
    paddingBottom: 15,
  },
});
