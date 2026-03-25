import Panel from "@/components/panel";
import { Styles } from "@/constants/theme";
import { View } from "react-native";


export default function Earnings() {
  return(
    <View style={Styles.scrollview}>
      <Panel amount={100} />
      <Panel title="Hola" amount={5} />
      <Panel description="Gasto por nose" amount={10} />
      <Panel title="Hola" description="hola" amount={20} />
    </View>
  )
}