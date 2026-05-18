import { Colors } from "@/constants/theme";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface windowProps {
  visible: boolean;
  onClose: () => void;
  windowType: string;
}


export default function FloatingWindow({
  visible,
  onClose,
  windowType,
}: windowProps) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [active, setActive] = useState<Record<number, boolean>>({});
  const [nombre, setNombre] = useState<Record<number, string>>({});
  const [amount, setAmount] = useState<Record<number, string>>({});
  const [date, setDate] = useState<Record<number, string>>({});
  const [interval, setInterval] = useState<Record<number, number>>({});
  const [reminder, setReminder] = useState<Record<number, boolean>>({});

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.window}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 19 }}></View>
            <Pressable onPress={onClose} style={{ flex: 1 }}>
              <Text>x</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ flexDirection: "column" }}>
            {[
              ["Nombre", "string"],
              ["desc", "string"],
              ["cantidad", "amount"],
              ["Tipo de ingreso", "type"],
              ["Tipo de gasto", "type"],
              ["Fecha", "interval"],
              ["fecha fin", "interval"],
              ["Recordatorio", "reminder"],
              ["recordar?", "reminder"],
            ].map(([label, type], i) => {
              if (type === "string") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 50 }}>
                      <TextInput style={styles.input} value={nombre[i] ?? ""} onChangeText={(text) => setNombre((prev) => ({...prev, [i]: text}))} />
                    </View>
                  </View>
                );
              }
              if (type === "interval") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 20 }}>
                      {["Diario", "Semanal", "Mensual", "Anual"].map(
                        (op, j) => (
                          <Pressable
                            key={j}
                            onPress={() =>
                              setSelected((prev) => ({ ...prev, [i]: op }))
                            }
                            style={[
                              styles.pressable,
                              {
                                backgroundColor:
                                  selected[i] === op
                                    ? Colors.light.primary
                                    : "#FFFFFF",
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color:
                                  selected[i] === op ? "#1c1c1c" : "#000000",
                              }}
                            >
                              {op}
                            </Text>
                          </Pressable>
                        ),
                      )}
                    </View>
                  </View>
                );
              }
              if (type === "amount" ) {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 50 }}>
                      <TextInput style={styles.input} keyboardType="numeric" value={amount[i] ?? ""} onChangeText={(amt) => setAmount((prev) => ({...prev, [i]: amt}))} />
                    </View>
                  </View>
                );
              }
              if (type === "type") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 20 }}>
                      {["Fijo / Recurrente", "Unico / Variable"].map(
                        (op, j) => (
                          <Pressable
                            key={j}
                            onPress={() =>
                              setSelected((prev) => ({ ...prev, [i]: op }))
                            }
                            style={[
                              styles.pressable,
                              {
                                backgroundColor:
                                  selected[i] === op
                                    ? Colors.light.primary
                                    : "#FFFFFF",
                              },
                            ]}
                          >
                            <Text>{op}</Text>
                          </Pressable>
                        ),
                      )}
                    </View>
                  </View>
                );
              }
              if (type === "reminder") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 5}}>
                      <Text>{label}</Text>
                    </View>
                    <Pressable
                      key={i}
                      onPress={() => {
                        setActive((prev) => ({  ...prev, [i]: !prev[i]}))
                      }}
                      style={[
                        styles.toggleable,
                        {
                          marginBottom: 20,
                          backgroundColor:
                            active[i]
                            ? Colors.light.primary
                            : "#FFFFFF"
                        }
                      ]}>
                        <Text>{active[i] ? "Activado" : "Desactivado"}</Text>
                      </Pressable>
                  </View>
                )
              }
              return null;
            })}
            <View style={{ width: 50, height: 50}}>
              <Pressable
                onPress={() => addInfo({name: Object.values(nombre).join(", "), amount: Object.values(amount).join(", ")}, windowType)}
                style={{ backgroundColor: Colors.light.primary, width: 50, height: 50 }}
              >

              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  window: {
    width: 350,
    height: 670 + 100,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flexDirection: "column",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00000067",
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
  },
  pressable: {
    borderColor: "#000000",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    flex: 1,
    margin: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  toggleable: {
    borderColor: "#000000",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    margin: 5,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  }
});

async function addInfo(info: any, windowType: string) {
  console.log(info);
  // switch (windowType) {
  //   case "reminder":
  //     await db.insert(reminders).values({
  //       name: info.name,
  //       amount: info.amount,
  //       last_reminder: Date.now(),
  //       interval: info.interval,
  //     })
  //     break;
  //   default:
  //     return;
  // }
}