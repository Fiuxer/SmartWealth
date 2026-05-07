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
  windowType: string;
}

export default function FloatingWindow({
  visible,
  onClose,
  windowType,
}: windowProps) {
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
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text>Cosa</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TextInput style={styles.input}></TextInput>
            </View>
            <View style={{ flex: 2 }}></View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text>Cosa</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TextInput style={styles.input}></TextInput>
            </View>
            <View style={{ flex: 2 }}></View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text>Cosa</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TextInput style={styles.input}></TextInput>
            </View>
            <View style={{ flex: 2 }}></View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  window: {
    width: 350,
    height: 670,
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
    borderColor: "#000000",
    borderRadius: 8,
  },
});
