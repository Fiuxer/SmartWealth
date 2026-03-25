import { Colors, Fonts } from "@/constants/theme"
import { View, Text, StyleSheet, Pressable } from "react-native"



interface PanelProps {
  title?: string,
  description?: string,
  amount: number,
}

export default function Panel({title, description, amount}: PanelProps) {
  if (description == null && title == null) {
    return (
      <View style={[styles.panel, { marginBottom: 100}]}>
        <Text style={styles.title}>${amount}</Text>
      </View>
    )
  }
  return (
    <View style={styles.panel} >
      <Text style={styles.header} >{title ?? "Sin título"}</Text>
      <Text style={styles.description} >{description ?? "Sin descripción"}</Text>
      <Text style={styles.number} >${amount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  panel: {
    margin: 5,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#e8e8e8'
  },
  header: {
    fontSize: 30,
    fontFamily: Fonts.primaryBold,
    color: Colors.light.primary
  },
  description: {
    fontFamily: Fonts.primary,
    color: '#474747',
  },
  number: {
    fontFamily: Fonts.secondary,
  },
  title: {
    fontSize: 72,
    textAlign: 'center',
    color: Colors.light.primary,
    fontFamily: Fonts.primaryBold,
    margin: 10,
  }
})