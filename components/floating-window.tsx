import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface windowProps {
  visible: boolean;
  onClose: () => void;
  name?: string;
  amount: number;
  time?: Date;
  desc?: string;
  windowType: string;
}

export default function FloatingWindow({
  visible,
  onClose,
  name,
  amount,
  time,
  desc,
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
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 10, // android shadow
    shadowColor: "#000", // ios shadow
    shadowOpacity: 0.3,
    shadowRadius: 10,
    flexDirection: "column",
  },
});
