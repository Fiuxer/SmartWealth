import { Colors } from "@/constants/theme";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface windowProps {
  visible: boolean;
  onClose: () => void;
  windowType: string[];
}

export default function FloatingWindow({
  visible,
  onClose,
  windowType,
}: windowProps) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [active, setActive] = useState<Record<number, boolean>>({});

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
          <View style={{ flexDirection: "column" }}>
            {[
              ["Fecha", "interval"],
              ["Nombre", "string"],
              ["Tipo de ingreso", "type"],
              ["Recordatorio", "reminder"],
            ].map(([label, type], i) => {
              if (type === "string") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 50 }}>
                      <TextInput style={styles.input} />
                    </View>
                  </View>
                );
              }
              if (type === "interval") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 50 }}>
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
              if (type === "type") {
                return (
                  <View key={i} style={{ flexDirection: "column" }}>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      <Text>{label}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginBottom: 50 }}>
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
                // Tengo q hacer esto y para eso esta la variable esta de active setActive
                // Recordar al momento es true o false depende es toggle ya tu sabe
              }
              return null;
            })}
          </View>
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
});

/* q esté en horizontal con la cursiva */
