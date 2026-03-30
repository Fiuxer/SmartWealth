import { Colors, Fonts } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function PieChart() {
  return (
    <View>
      <Text style={style.title}>División de ganancias</Text>
    </View>
  );
}

const style = StyleSheet.create({
  title: {
    fontFamily: Fonts.primaryBold,
    fontSize: 12 * 5,
    color: Colors.light.primary,
    margin: 20,
    marginVertical: 50,
  },
});
