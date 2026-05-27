import Panel from "@/components/panel";
import { Fonts, Styles } from "@/constants/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { Frecuencia, Income, TipoIngreso } from '../context/AppContext';
import { useAppContext } from '../context/AppContext';

const TEAL = "#3DBFA0";
const RED  = "#E05C5C";

export default function Earnings() {
  const { total, incomes, addIncome, editIncome, deleteIncome } = useAppContext();

  // ── Modal agregar ─────────────────────────────────────────────────────────
  const [addVisible, setAddVisible] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "", amount: "", tipoIngreso: "fijo" as TipoIngreso, frecuencia: "mensual" as Frecuencia,
  });
  const [addError, setAddError] = useState("");

  // ── Modal editar/eliminar ─────────────────────────────────────────────────
  const [manageVisible, setManageVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editForm, setEditForm] = useState({
    name: "", amount: "", tipoIngreso: "fijo" as TipoIngreso, frecuencia: "mensual" as Frecuencia,
  });
  const [editError, setEditError] = useState("");

  // ── Modal confirmar eliminar ──────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // ─── Guardar nuevo ingreso ────────────────────────────────────────────────
  function handleAddSave() {
    if (!addForm.name.trim()) { setAddError("El nombre es obligatorio."); return; }
    const parsed = parseFloat(addForm.amount);
    if (isNaN(parsed) || parsed <= 0) { setAddError("Ingresa un monto válido."); return; }

    addIncome({
      id: Date.now(),
      name: addForm.name.trim(),
      amount: parsed,
      tipoIngreso: addForm.tipoIngreso,
      frecuencia: addForm.frecuencia,
    });
    setAddVisible(false);
    setAddForm({ name: "", amount: "", tipoIngreso: "fijo", frecuencia: "mensual" });
    setAddError("");
  }

  // ─── Abrir edición ────────────────────────────────────────────────────────
  function openEdit(income: Income) {
    setEditingIncome(income);
    setEditForm({
      name: income.name,
      amount: String(income.amount),
      tipoIngreso: income.tipoIngreso,
      frecuencia: income.frecuencia,
    });
    setEditError("");
  }

  // ─── Guardar edición ──────────────────────────────────────────────────────
  function handleEditSave() {
    if (!editingIncome) return;
    if (!editForm.name.trim()) { setEditError("El nombre es obligatorio."); return; }
    const parsed = parseFloat(editForm.amount);
    if (isNaN(parsed) || parsed <= 0) { setEditError("Ingresa un monto válido."); return; }

    editIncome({
      ...editingIncome,
      name: editForm.name.trim(),
      amount: parsed,
      tipoIngreso: editForm.tipoIngreso,
      frecuencia: editForm.frecuencia,
    });
    setEditingIncome(null);
    setEditError("");
  }

  // ─── Eliminar ─────────────────────────────────────────────────────────────
  function confirmDelete(income: Income) {
    setDeleteTarget(income);
    setConfirmVisible(true);
  }

  function handleDelete() {
    if (deleteTarget) deleteIncome(deleteTarget.id);
    setConfirmVisible(false);
    setDeleteTarget(null);
  }

  // ─── Etiqueta de frecuencia ───────────────────────────────────────────────
  function frecLabel(f: Frecuencia) {
    return { semanal: "Semanal", mensual: "Mensual", anual: "Anual" }[f];
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[Styles.scrollview, { paddingTop: 60 }]} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Panel dinero actual compartido */}
        <Panel amount={total} />

        <Text style={styles.sectionTitle}>Mis ingresos</Text>

        {incomes.length === 0 ? (
          <Text style={styles.emptyText}>Aún no tienes ingresos registrados.</Text>
        ) : (
          incomes.map((income) => (
            <View key={income.id} style={styles.incomeCard}>
              <View style={styles.incomeLeft}>
                <Text style={styles.incomeName}>{income.name}</Text>
                <Text style={styles.incomeMeta}>
                  {income.tipoIngreso === "fijo" ? "Fijo" : "Variable"} · {frecLabel(income.frecuencia)}
                </Text>
              </View>
              <Text style={styles.incomeAmount}>${income.amount.toFixed(2)}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Botones fijos ───────────────────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <TouchableOpacity style={styles.fab} onPress={() => { setAddForm({ name: "", amount: "", tipoIngreso: "fijo", frecuencia: "mensual" }); setAddError(""); setAddVisible(true); }}>
          <Text style={styles.fabText}>+ Agregar ingreso</Text>
        </TouchableOpacity>

        {incomes.length > 0 && (
          <TouchableOpacity style={[styles.fab, styles.fabSecondary]} onPress={() => { setEditingIncome(null); setManageVisible(true); }}>
            <Text style={[styles.fabText, { color: TEAL }]}>✏️ Editar / Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ══ MODAL: Agregar ingreso ══════════════════════════════════════════════ */}
      <Modal visible={addVisible} transparent animationType="fade" onRequestClose={() => setAddVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setAddVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.modalWrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo ingreso</Text>

            <Text style={styles.label}>Nombre del ingreso</Text>
            <TextInput style={styles.input} placeholder="Ej. Sueldo, Negocio..." placeholderTextColor="#bbb" value={addForm.name} onChangeText={(v) => setAddForm((f) => ({ ...f, name: v }))} />

            <Text style={styles.label}>Monto</Text>
            <TextInput style={styles.input} placeholder="$0.00" placeholderTextColor="#bbb" keyboardType="decimal-pad" value={addForm.amount} onChangeText={(v) => setAddForm((f) => ({ ...f, amount: v }))} />

            {/* Fijo / Variable */}
            <Text style={styles.label}>Tipo de ingreso</Text>
            <View style={styles.typeSelector}>
              {(["fijo", "variable"] as TipoIngreso[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, addForm.tipoIngreso === t && { backgroundColor: TEAL }]}
                  onPress={() => setAddForm((f) => ({ ...f, tipoIngreso: t }))}
                >
                  <Text style={[styles.typeBtnText, addForm.tipoIngreso === t && styles.typeBtnTextActive]}>
                    {t === "fijo" ? "Fijo" : "Variable"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Semanal / Mensual / Anual */}
            <Text style={styles.label}>Frecuencia</Text>
            <View style={styles.typeSelector}>
              {(["semanal", "mensual", "anual"] as Frecuencia[]).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.typeBtn, addForm.frecuencia === f && { backgroundColor: TEAL }]}
                  onPress={() => setAddForm((prev) => ({ ...prev, frecuencia: f }))}
                >
                  <Text style={[styles.typeBtnText, addForm.frecuencia === f && styles.typeBtnTextActive]}>
                    {frecLabel(f)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {addError !== "" && <Text style={styles.errorText}>{addError}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSave}>
                <Text style={styles.saveBtnText}>Aceptar ingreso</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ MODAL: Gestionar ingresos ══════════════════════════════════════════ */}
      <Modal visible={manageVisible} transparent animationType="slide" onRequestClose={() => { setManageVisible(false); setEditingIncome(null); }}>
        <TouchableWithoutFeedback onPress={() => { setManageVisible(false); setEditingIncome(null); }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.bottomSheetWrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>
              {editingIncome ? "Editar ingreso" : "Gestionar ingresos"}
            </Text>

            {/* ── Vista edición ─────────────────────────────────────────────── */}
            {editingIncome ? (
              <>
                <Text style={styles.label}>Nombre</Text>
                <TextInput style={styles.input} value={editForm.name} onChangeText={(v) => setEditForm((f) => ({ ...f, name: v }))} placeholderTextColor="#bbb" />

                <Text style={styles.label}>Monto</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" value={editForm.amount} onChangeText={(v) => setEditForm((f) => ({ ...f, amount: v }))} placeholderTextColor="#bbb" />

                <Text style={styles.label}>Tipo</Text>
                <View style={styles.typeSelector}>
                  {(["fijo", "variable"] as TipoIngreso[]).map((t) => (
                    <TouchableOpacity key={t} style={[styles.typeBtn, editForm.tipoIngreso === t && { backgroundColor: TEAL }]} onPress={() => setEditForm((f) => ({ ...f, tipoIngreso: t }))}>
                      <Text style={[styles.typeBtnText, editForm.tipoIngreso === t && styles.typeBtnTextActive]}>{t === "fijo" ? "Fijo" : "Variable"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Frecuencia</Text>
                <View style={styles.typeSelector}>
                  {(["semanal", "mensual", "anual"] as Frecuencia[]).map((f) => (
                    <TouchableOpacity key={f} style={[styles.typeBtn, editForm.frecuencia === f && { backgroundColor: TEAL }]} onPress={() => setEditForm((prev) => ({ ...prev, frecuencia: f }))}>
                      <Text style={[styles.typeBtnText, editForm.frecuencia === f && styles.typeBtnTextActive]}>{frecLabel(f)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {editError !== "" && <Text style={styles.errorText}>{editError}</Text>}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingIncome(null)}>
                    <Text style={styles.cancelBtnText}>Atrás</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleEditSave}>
                    <Text style={styles.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* ── Lista de ingresos para gestionar ─────────────────────────── */
              <ScrollView style={{ maxHeight: 400 }}>
                {incomes.map((income) => (
                  <View key={income.id} style={styles.manageRow}>
                    <View style={styles.incomeLeft}>
                      <Text style={styles.incomeName}>{income.name}</Text>
                      <Text style={styles.incomeMeta}>
                        {income.tipoIngreso === "fijo" ? "Fijo" : "Variable"} · {frecLabel(income.frecuencia)} · ${income.amount.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.manageActions}>
                      <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(income)}>
                        <Text style={styles.editBtnText}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(income)}>
                        <Text style={styles.deleteBtnText}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ MODAL: Confirmar eliminación ═══════════════════════════════════════ */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setConfirmVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalWrapper} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.warningIcon}>🗑️</Text>
            <Text style={styles.noFundsTitle}>¿Eliminar ingreso?</Text>
            <Text style={styles.noFundsBody}>
              ¿Estás seguro de que deseas eliminar{"\n"}
              <Text style={{ fontFamily: Fonts.primaryBold, color: "#333" }}>
                "{deleteTarget?.name}"
              </Text>
              ?{"\n"}Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: RED }]} onPress={handleDelete}>
                <Text style={styles.saveBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontFamily: Fonts.primaryBold, color: "#333", marginTop: 28, marginBottom: 12, paddingHorizontal: 20 },
  emptyText: { color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 20 },
  incomeCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 10, borderRadius: 12, padding: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  incomeLeft: { flex: 1 },
  incomeName: { fontSize: 15, fontFamily: Fonts.primaryBold, color: "#333" },
  incomeMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  incomeAmount: { fontSize: 16, fontFamily: Fonts.primaryBold, color: TEAL },
  fabRow: { position: "absolute", bottom: 100, left: 20, flexDirection: "row", gap: 10 },
  fab: { backgroundColor: TEAL, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 5 },
  fabSecondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: TEAL },
  fabText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  modalWrapper: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 },
  modalCard: { width: "100%", backgroundColor: "#fff", borderRadius: 18, padding: 24, elevation: 10 },
  bottomSheetWrapper: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, elevation: 10 },
  modalTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: TEAL, textAlign: "center", marginBottom: 16 },
  typeSelector: { flexDirection: "row", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#f5f5f5" },
  typeBtnText: { fontFamily: Fonts.primaryBold, color: "#999", fontSize: 13 },
  typeBtnTextActive: { color: "#fff" },
  label: { fontSize: 12, color: "#888", fontFamily: Fonts.primaryBold, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#333", marginBottom: 12 },
  errorText: { color: RED, fontSize: 12, textAlign: "center", marginBottom: 8 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center" },
  cancelBtnText: { color: "#999", fontFamily: Fonts.primaryBold, fontSize: 14 },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: TEAL, alignItems: "center" },
  saveBtnText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },
  manageRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  manageActions: { flexDirection: "row", gap: 8 },
  editBtn: { padding: 8, backgroundColor: "#f0f9f7", borderRadius: 8 },
  editBtnText: { fontSize: 16 },
  deleteBtn: { padding: 8, backgroundColor: "#fdf0f0", borderRadius: 8 },
  deleteBtnText: { fontSize: 16 },
  warningIcon: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  noFundsTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: RED, textAlign: "center", marginBottom: 12 },
  noFundsBody: { fontSize: 14, color: "#555", textAlign: "center", lineHeight: 22, marginBottom: 20 },
});