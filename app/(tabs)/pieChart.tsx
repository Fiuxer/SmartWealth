import Mens from "@/components/mens";
import { Colors, Fonts } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

export default function PieChart() {
  const DATA = [
    { label: "1", value: 10, color: Colors.light.primary, focused: true },
    { label: "2", value: 10, color: Colors.light.greenColor },
    { label: "3", value: 15, color: Colors.light.redColor },
    { label: "4", value: 5, color: Colors.light.tabIconDefault },
    { label: "5", value: 12, color: "#d77272" },
  ];

  return (
    <View>
      <Text style={style.title}>División de ganancias</Text>
      <Text style={style.subtitle}>Ganancias mensuales</Text>
      <View style={[style.div, { marginBottom: 30 }]}>
        <Mens amount={1503.97}></Mens>
      </View>
      <View style={{ height: 200 }}>
        <PolarChart
          data={DATA}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="0%">
            {({ slice }) => (
              <Pie.Slice>
                <Pie.Label text="Yooooo" color="black" />
              </Pie.Slice>
            )}
          </Pie.Chart>
        </PolarChart>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  title: {
    fontFamily: Fonts.primaryBold,
    fontSize: 12 * 5,
    color: Colors.light.primary,
    marginHorizontal: 20,
    marginTop: 50,
  },
  subtitle: {
    fontFamily: Fonts.secondaryBold,
    fontSize: 12 * 2.5,
    marginHorizontal: 20,
  },
  div: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
  },
});
