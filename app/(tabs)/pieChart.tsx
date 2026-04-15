import Mens from "@/components/mens";
import { Colors, Fonts } from "@/constants/theme";
import { Text as SkiaText, useFont } from "@shopify/react-native-skia";
import { StyleSheet, Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";

export default function PieChart() {
  const PALETACOLORES = [
    "#FFD1DC",
    "#A2CFFE",
    "#AAF0D1",
    "#E3E4FA",
    "#FFFACD",
    "#FFDAB9",
    "#DCD0FF",
    "#B0E0E6",
  ];

  const INFO = [
    { label: "agua", value: 250 },
    { label: "comida", value: 4500 },
    { label: "netflix", value: 219 },
    { label: "internet", value: 399 },
    { label: "spotify", value: 99 },
    { label: "renta", value: 6000 },
    { label: "gasolina", value: 1500 },
    { label: "elektra", value: 800 },
    { label: "crédito", value: 1200 },
    { label: "disponible", value: 3000 },
  ];

  let totalSum = 0;
  INFO.forEach((value) => {
    totalSum += value.value;
  });

  let DATA = INFO.map((item, index) => ({
    ...item,
    color:
      index === INFO.length - 1 && index % PALETACOLORES.length === 0
        ? PALETACOLORES[4]
        : PALETACOLORES[index % PALETACOLORES.length],
  }));

  const font = useFont(
    require("../../assets/fonts/Cascadia_Mono,Inter,Montserrat,Stack_Sans_Headline/Montserrat/static/Montserrat-Medium.ttf"),
    12,
  );

  const logSlice = (slice: any) => {
    console.log(slice);
    return null;
  };

  return (
    <View>
      <Text style={style.title}>División de ganancias</Text>
      <Text style={style.subtitle}>Ganancias mensuales</Text>
      <View style={[style.div, { marginBottom: 30 }]}>
        <Mens amount={1503.97}></Mens>
      </View>
      <View style={{ height: 350 }}>
        <PolarChart
          data={DATA}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="70%">
            {({ slice }) => {
              const offsets = [0.55, 0.7, 0.85];
              const index = DATA.findIndex((d) => d.label === slice.label);
              const midAngle = (slice.startAngle + slice.endAngle) / 2;
              const rad = (midAngle * Math.PI) / 180;
              const prev = DATA[(index - 1 + DATA.length) % DATA.length];
              const next = DATA[(index + 1) % DATA.length];
              const totalSum2 = DATA.reduce((sum, d) => sum + d.value, 0);
              const prevPct = (prev.value / totalSum2) * 100;
              const nextPct = (next.value / totalSum2) * 100;
              const currPct = (slice.value / totalSum2) * 100;
              const tooClose =
                Math.abs(currPct - prevPct) < 5 ||
                Math.abs(currPct - nextPct) < 5;
              const labelRadius =
                slice.radius * (tooClose ? offsets[index % 3] : 0.85);
              const textWidth = font?.measureText(slice.label).width ?? 0;
              const x =
                slice.center.x + labelRadius * Math.cos(rad) - textWidth / 2;
              const y = slice.center.y + labelRadius * Math.sin(rad);

              return (
                <>
                  <Pie.Slice />
                  <SkiaText
                    x={x}
                    y={y}
                    text={slice.label}
                    font={font}
                    color={"black"}
                    zIndex={1000}
                  />
                  <SkiaText
                    x={x}
                    y={y + 10}
                    text={((slice.value * 100) / totalSum).toFixed(1) + "%"}
                    font={font}
                    color={"grey"}
                    zIndex={1000}
                  />
                </>
              );
            }}
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
