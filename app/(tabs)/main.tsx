import MoneyText from "@/components/money-text";
import Panel from "@/components/panel";
import { Fonts, Styles } from "@/constants/theme";
import { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { EntryType } from '../context/AppContext';
import { useAppContext } from '../context/AppContext';

const TEAL = "#3DBFA0";
const RED  = "#E05C5C";

export default function MainScreen() {
  const { entries, addEntry, total } = useAppContext();

  const translateY     = useRef(new Animated.Value(0)).current;
  const objOpacity     = useRef(new Animated.Value(1)).current;
  const listTranslateY = useRef(new Animated.Value(0)).current;

  const [isUp, setIsUp]         = useState(false);
  const [showList, setShowList] = useState(false);

  const [modalVisible, setModalVisible]   = useState(false);
  const [noFundsVisible, setNoFundsVisible] = useState(false);
  const [attemptedAmount, setAttemptedAmount] = useState(0);

  const [form, setForm] = useState({
    name: "", amount: "", date: "", type: "gasto" as EntryType,
  });
  const [formError, setFormError] = useState("");

  function toggleContent() {
    const goingUp = !isUp;
    Animated.timing(translateY, { toValue: goingUp ? -100 : 0, duration: 250, useNativeDriver: true }).start();
    Animated.timing(objOpacity, { toValue: goingUp ? 0.5 : 1, duration: 250, useNativeDriver: true }).start();
    Animated.timing(listTranslateY, { toValue: goingUp ? -100 : 0, duration: 250, useNativeDriver: true }).start();
    setIsUp(goingUp);
    setShowList(goingUp);
  }

  function openModal() {
    setForm({ name: "", amount: "", date: "", type: "gasto" });
    setFormError("");
    setModalVisible(true);
  }

  function handleSave() {
    const { name, amount, date, type } = form;
    if (!name.trim()) { setFormError("El nombre es obligatorio."); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { setFormError("Ingresa un monto válido."); return; }
    if (!date.trim()) { setFormError("La fecha es obligatoria."); return; }

    if (type === "gasto" && parsed > total) {
      setAttemptedAmount(parsed);
      setModalVisible(false);
      setNoFundsVisible(true);
      return;
    }

    addEntry({ id: Date.now(), name: name.trim(), amount: parsed, date: date.trim(), type });
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[Styles.scrollview, { paddingTop: 200 }]} contentContainerStyle={{ paddingBottom: 120 }}>
        <Animated.View style={{ transform: [{ translateY }], opacity: objOpacity }}>
          <Pressable onPress={toggleContent}>
            <Panel amount={total} />
          </Pressable>
        </Animated.View>

        {showList && (
          <Animated.View style={[styles.listContainer, { transform: [{ translateY: listTranslateY }] }]}>
            {entries.length === 0 ? (
              <Text style={styles.emptyText}>Sin movimientos aún.</Text>
            ) : (
              entries.map((entry) => (
                <MoneyText
                  key={entry.id}
                  text={entry.name}
                  amount={entry.amount}
                  color={entry.type === "ingreso" ? TEAL : RED}
                />
              ))
            )}
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={openModal}>
          <Text style={styles.fabText}>+ Agregar gasto o ingreso</Text>
        </TouchableOpacity>
      </View>

      {/* Modal agregar */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.modalWrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nueva entrada</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity style={[styles.typeBtn, form.type === "gasto" && { backgroundColor: RED }]} onPress={() => setForm((f) => ({ ...f, type: "gasto" }))}>
                <Text style={[styles.typeBtnText, form.type === "gasto" && styles.typeBtnTextActive]}>Gasto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, form.type === "ingreso" && { backgroundColor: TEAL }]} onPress={() => setForm((f) => ({ ...f, type: "ingreso" }))}>
                <Text style={[styles.typeBtnText, form.type === "ingreso" && styles.typeBtnTextActive]}>Ingreso</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Monto</Text>
            <TextInput style={styles.input} placeholder="$0.00" placeholderTextColor="#bbb" keyboardType="decimal-pad" value={form.amount} onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))} />
            <Text style={styles.label}>Nombre</Text>
            <TextInput style={styles.input} placeholder="Ej. Comida, Sueldo..." placeholderTextColor="#bbb" value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Text style={styles.label}>Fecha</Text>
            <TextInput style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#bbb" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
            {formError !== "" && <Text style={styles.errorText}>{formError}</Text>}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal saldo insuficiente */}
      <Modal visible={noFundsVisible} transparent animationType="fade" onRequestClose={() => setNoFundsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setNoFundsVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalWrapper} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.noFundsTitle}>Saldo insuficiente</Text>
            <Text style={styles.noFundsBody}>
              No tienes suficiente saldo para este gasto.{"\n\n"}
              <Text style={{ color: RED, fontFamily: Fonts.primaryBold }}>Gasto intentado: ${attemptedAmount.toFixed(2)}</Text>
              {"\n"}
              <Text style={{ color: TEAL, fontFamily: Fonts.primaryBold }}>Saldo actual: ${total.toFixed(2)}</Text>
            </Text>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setNoFundsVisible(false)}>
              <Text style={styles.saveBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: { marginTop: 24, paddingHorizontal: 20 },
  emptyText: { color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 8 },
  fabContainer: { position: "absolute", bottom: 100, left: 20 },
  fab: { backgroundColor: TEAL, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 5 },
  fabText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  modalWrapper: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 },
  modalCard: { width: "100%", backgroundColor: "#fff", borderRadius: 18, padding: 24, elevation: 10 },
  modalTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: TEAL, textAlign: "center", marginBottom: 16 },
  typeSelector: { flexDirection: "row", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#f5f5f5" },
  typeBtnText: { fontFamily: Fonts.primaryBold, color: "#999", fontSize: 14 },
  typeBtnTextActive: { color: "#fff" },
  label: { fontSize: 12, color: "#888", fontFamily: Fonts.primaryBold, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#333", marginBottom: 12 },
  errorText: { color: RED, fontSize: 12, textAlign: "center", marginBottom: 8 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center" },
  cancelBtnText: { color: "#999", fontFamily: Fonts.primaryBold, fontSize: 14 },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: TEAL, alignItems: "center" },
  saveBtnText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },
  warningIcon: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  noFundsTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: RED, textAlign: "center", marginBottom: 12 },
  noFundsBody: { fontSize: 14, color: "#555", textAlign: "center", lineHeight: 22, marginBottom: 20 },
});