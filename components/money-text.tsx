import { Fonts } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";


interface TextProperties {
  amount: number,
  text?: string,
}

export default function MoneyText({amount, text}: TextProperties) {
  return (
    <View>
      <Text style={Styles.text}>${amount}</Text>
      <Text>{text}</Text>
    </View>
  )
}

const Styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: Fonts.primaryBold
  }
})