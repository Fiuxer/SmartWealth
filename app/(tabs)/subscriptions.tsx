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
import { useAppContext } from '../context/AppContext';

const TEAL = "#3DBFA0";
const RED  = "#E05C5C";

// ─── Tipos locales ────────────────────────────────────────────────────────────
type Frecuencia  = "semanal" | "mensual" | "anual";
type Categoria   = "entretenimiento" | "educacion" | "salud" | "servicios" | "otro";

interface Subscription {
  id: number;
  name: string;
  amount: number;
  frecuencia: Frecuencia;
  categoria: Categoria;
  fecha: string;
}

const CATEGORIAS: { key: Categoria; label: string; emoji: string }[] = [
  { key: "entretenimiento", label: "Entretenimiento", emoji: "🎬" },
  { key: "educacion",       label: "Educación",       emoji: "📚" },
  { key: "salud",           label: "Salud",           emoji: "❤️" },
  { key: "servicios",       label: "Servicios",       emoji: "⚡" },
  { key: "otro",            label: "Otro",            emoji: "📦" },
];

const FRECUENCIAS: { key: Frecuencia; label: string }[] = [
  { key: "semanal",  label: "Semanal"  },
  { key: "mensual",  label: "Mensual"  },
  { key: "anual",    label: "Anual"    },
];

export default function Subscriptions() {
  const { total } = useAppContext();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // ── Modal agregar ─────
  const [addVisible, setAddVisible] = useState(false);
  const [form, setForm] = useState({
    name:       "",
    amount:     "",
    frecuencia: "mensual" as Frecuencia,
    categoria:  "entretenimiento" as Categoria,
    fecha:      "",
  });
  const [formError, setFormError] = useState("");

  // ── Modal gestionar ─────
  const [manageVisible, setManageVisible]   = useState(false);
  const [editTarget, setEditTarget]         = useState<Subscription | null>(null);
  const [editForm, setEditForm]             = useState({
    name: "", amount: "", frecuencia: "mensual" as Frecuencia,
    categoria: "entretenimiento" as Categoria, fecha: "",
  });
  const [editError, setEditError]           = useState("");

  // ── Modal confirmar eliminar ─────
  const [deleteTarget, setDeleteTarget]     = useState<Subscription | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // ─── Helpers ──────
  function frecLabel(f: Frecuencia) {
    const map: Record<Frecuencia, string> = { semanal: "Semanal", mensual: "Mensual", anual: "Anual" };
    return map[f];
  }

  function catInfo(k: Categoria) {
    return CATEGORIAS.find((c) => c.key === k) ?? CATEGORIAS[4];
  }

  // ─── Guardar nueva suscripción ─────
  function handleAddSave() {
    if (!form.name.trim()) { setFormError("El nombre es obligatorio."); return; }
    const parsed = parseFloat(form.amount);
    if (isNaN(parsed) || parsed <= 0) { setFormError("Ingresa un monto válido."); return; }
    if (!form.fecha.trim()) { setFormError("La fecha es obligatoria."); return; }

    setSubscriptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name.trim(),
        amount: parsed,
        frecuencia: form.frecuencia,
        categoria: form.categoria,
        fecha: form.fecha.trim(),
      },
    ]);
    setAddVisible(false);
    setForm({ name: "", amount: "", frecuencia: "mensual", categoria: "entretenimiento", fecha: "" });
    setFormError("");
  }

  // ─── Abrir edición ───────
  function openEdit(sub: Subscription) {
    setEditTarget(sub);
    setEditForm({
      name: sub.name, amount: String(sub.amount),
      frecuencia: sub.frecuencia, categoria: sub.categoria, fecha: sub.fecha,
    });
    setEditError("");
  }

  // ─── Guardar edición ─────
  function handleEditSave() {
    if (!editTarget) return;
    if (!editForm.name.trim()) { setEditError("El nombre es obligatorio."); return; }
    const parsed = parseFloat(editForm.amount);
    if (isNaN(parsed) || parsed <= 0) { setEditError("Ingresa un monto válido."); return; }
    if (!editForm.fecha.trim()) { setEditError("La fecha es obligatoria."); return; }

    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === editTarget.id
          ? { ...s, name: editForm.name.trim(), amount: parsed, frecuencia: editForm.frecuencia, categoria: editForm.categoria, fecha: editForm.fecha.trim() }
          : s
      )
    );
    setEditTarget(null);
    setEditError("");
  }

  // ─── Eliminar ─────
  function handleDelete() {
    if (deleteTarget) setSubscriptions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setConfirmVisible(false);
    setDeleteTarget(null);
  }

  // ─── Render ───────
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[Styles.scrollview, { paddingTop: 60 }]}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Panel dinero actual compartido */}
        <Panel amount={total} />

        <Text style={styles.sectionTitle}>Mis suscripciones</Text>

        {subscriptions.length === 0 ? (
          <Text style={styles.emptyText}>Aún no tienes suscripciones registradas.</Text>
        ) : (
          subscriptions.map((sub: Subscription) => {
            const cat = catInfo(sub.categoria);
            return (
              <View key={sub.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardEmoji}>{cat.emoji}</Text>
                </View>
                <View style={styles.cardCenter}>
                  <Text style={styles.cardName}>{sub.name}</Text>
                  <Text style={styles.cardMeta}>
                    {cat.label} · {frecLabel(sub.frecuencia)} · {sub.fecha}
                  </Text>
                </View>
                <Text style={styles.cardAmount}>-${sub.amount.toFixed(2)}</Text>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── Botones fijos ───────────────────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setForm({ name: "", amount: "", frecuencia: "mensual", categoria: "entretenimiento", fecha: "" });
            setFormError("");
            setAddVisible(true);
          }}
        >
          <Text style={styles.fabText}>+ Agregar suscripción</Text>
        </TouchableOpacity>

        {subscriptions.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, styles.fabSecondary]}
            onPress={() => { setEditTarget(null); setManageVisible(true); }}
          >
            <Text style={[styles.fabText, { color: TEAL }]}>✏️ Editar / Eliminar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ══ MODAL: Agregar suscripción ══════════════════════════════════════════ */}
      <Modal visible={addVisible} transparent animationType="fade" onRequestClose={() => setAddVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setAddVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.modalWrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nueva suscripción</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input} placeholder="Ej. Netflix, Spotify..." placeholderTextColor="#bbb"
              value={form.name} onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              style={styles.input} placeholder="$0.00" placeholderTextColor="#bbb"
              keyboardType="decimal-pad" value={form.amount}
              onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
            />

            {/* Frecuencia */}
            <Text style={styles.label}>Frecuencia</Text>
            <View style={styles.typeSelector}>
              {FRECUENCIAS.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.typeBtn, form.frecuencia === key && { backgroundColor: TEAL }]}
                  onPress={() => setForm((f) => ({ ...f, frecuencia: key }))}
                >
                  <Text style={[styles.typeBtnText, form.frecuencia === key && styles.typeBtnTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Categoría */}
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.catGrid}>
              {CATEGORIAS.map(({ key, label, emoji }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.catBtn, form.categoria === key && styles.catBtnActive]}
                  onPress={() => setForm((f) => ({ ...f, categoria: key }))}
                >
                  <Text style={styles.catEmoji}>{emoji}</Text>
                  <Text style={[styles.catLabel, form.categoria === key && styles.catLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Fecha de inicio</Text>
            <TextInput
              style={styles.input} placeholder="DD/MM/AAAA" placeholderTextColor="#bbb"
              value={form.fecha} onChangeText={(v) => setForm((f) => ({ ...f, fecha: v }))}
            />

            {formError !== "" && <Text style={styles.errorText}>{formError}</Text>}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSave}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══ MODAL: Gestionar suscripciones ═════════════════════════════════════ */}
      <Modal visible={manageVisible} transparent animationType="slide" onRequestClose={() => { setManageVisible(false); setEditTarget(null); }}>
        <TouchableWithoutFeedback onPress={() => { setManageVisible(false); setEditTarget(null); }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.bottomSheetWrapper} behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none">
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>
              {editTarget ? "Editar suscripción" : "Gestionar suscripciones"}
            </Text>

            {editTarget ? (
              /* ── Vista edición ──────────────────────────────────────────── */
              <>
                <Text style={styles.label}>Nombre</Text>
                <TextInput style={styles.input} value={editForm.name} placeholderTextColor="#bbb" onChangeText={(v) => setEditForm((f) => ({ ...f, name: v }))} />

                <Text style={styles.label}>Monto</Text>
                <TextInput style={styles.input} keyboardType="decimal-pad" value={editForm.amount} placeholderTextColor="#bbb" onChangeText={(v) => setEditForm((f) => ({ ...f, amount: v }))} />

                <Text style={styles.label}>Frecuencia</Text>
                <View style={styles.typeSelector}>
                  {FRECUENCIAS.map(({ key, label }) => (
                    <TouchableOpacity key={key} style={[styles.typeBtn, editForm.frecuencia === key && { backgroundColor: TEAL }]} onPress={() => setEditForm((f) => ({ ...f, frecuencia: key }))}>
                      <Text style={[styles.typeBtnText, editForm.frecuencia === key && styles.typeBtnTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Categoría</Text>
                <View style={styles.catGrid}>
                  {CATEGORIAS.map(({ key, label, emoji }) => (
                    <TouchableOpacity key={key} style={[styles.catBtn, editForm.categoria === key && styles.catBtnActive]} onPress={() => setEditForm((f) => ({ ...f, categoria: key }))}>
                      <Text style={styles.catEmoji}>{emoji}</Text>
                      <Text style={[styles.catLabel, editForm.categoria === key && styles.catLabelActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Fecha</Text>
                <TextInput style={styles.input} value={editForm.fecha} placeholderTextColor="#bbb" onChangeText={(v) => setEditForm((f) => ({ ...f, fecha: v }))} />

                {editError !== "" && <Text style={styles.errorText}>{editError}</Text>}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditTarget(null)}>
                    <Text style={styles.cancelBtnText}>Atrás</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleEditSave}>
                    <Text style={styles.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* ── Lista para gestionar ───────────────────────────────────── */
              <ScrollView style={{ maxHeight: 400 }}>
                {subscriptions.map((sub: Subscription) => {
                  const cat = catInfo(sub.categoria);
                  return (
                    <View key={sub.id} style={styles.manageRow}>
                      <Text style={styles.cardEmoji}>{cat.emoji}</Text>
                      <View style={styles.cardCenter}>
                        <Text style={styles.cardName}>{sub.name}</Text>
                        <Text style={styles.cardMeta}>{frecLabel(sub.frecuencia)} · ${sub.amount.toFixed(2)}</Text>
                      </View>
                      <View style={styles.manageActions}>
                        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(sub)}>
                          <Text style={styles.editBtnText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => { setDeleteTarget(sub); setConfirmVisible(true); }}>
                          <Text style={styles.deleteBtnText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
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
            <Text style={styles.noFundsTitle}>¿Eliminar suscripción?</Text>
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

// ─── Estilos ────
const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontFamily: Fonts.primaryBold, color: "#333", marginTop: 28, marginBottom: 12, paddingHorizontal: 20 },
  emptyText: { color: "#aaa", fontSize: 14, textAlign: "center", marginTop: 20 },

  // Tarjeta suscripción
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 10, borderRadius: 12, padding: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardLeft: { marginRight: 12 },
  cardEmoji: { fontSize: 26 },
  cardCenter: { flex: 1 },
  cardName: { fontSize: 15, fontFamily: Fonts.primaryBold, color: "#333" },
  cardMeta: { fontSize: 12, color: "#999", marginTop: 2 },
  cardAmount: { fontSize: 15, fontFamily: Fonts.primaryBold, color: RED },

  // FAB
  fabRow: { position: "absolute", bottom: 100, left: 20, flexDirection: "row", gap: 10 },
  fab: { backgroundColor: TEAL, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 5 },
  fabSecondary: { backgroundColor: "#fff", borderWidth: 1, borderColor: TEAL },
  fabText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },

  // Overlays y modales
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  modalWrapper: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  modalCard: { width: "100%", backgroundColor: "#fff", borderRadius: 18, padding: 24, elevation: 10 },
  bottomSheetWrapper: { flex: 1, justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, elevation: 10 },
  modalTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: TEAL, textAlign: "center", marginBottom: 16 },

  // Selector frecuencia
  typeSelector: { flexDirection: "row", borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", overflow: "hidden", marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#f5f5f5" },
  typeBtnText: { fontFamily: Fonts.primaryBold, color: "#999", fontSize: 13 },
  typeBtnTextActive: { color: "#fff" },

  // Categorías
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  catBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f5f5f5" },
  catBtnActive: { backgroundColor: TEAL, borderColor: TEAL },
  catEmoji: { fontSize: 14 },
  catLabel: { fontSize: 12, fontFamily: Fonts.primaryBold, color: "#888" },
  catLabelActive: { color: "#fff" },

  // Inputs
  label: { fontSize: 12, color: "#888", fontFamily: Fonts.primaryBold, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#333", marginBottom: 12 },
  errorText: { color: RED, fontSize: 12, textAlign: "center", marginBottom: 8 },

  // Acciones
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center" },
  cancelBtnText: { color: "#999", fontFamily: Fonts.primaryBold, fontSize: 14 },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: TEAL, alignItems: "center" },
  saveBtnText: { color: "#fff", fontFamily: Fonts.primaryBold, fontSize: 14 },

  // Gestionar
  manageRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  manageActions: { flexDirection: "row", gap: 8 },
  editBtn: { padding: 8, backgroundColor: "#f0f9f7", borderRadius: 8 },
  editBtnText: { fontSize: 16 },
  deleteBtn: { padding: 8, backgroundColor: "#fdf0f0", borderRadius: 8 },
  deleteBtnText: { fontSize: 16 },

  // Modal eliminar
  warningIcon: { fontSize: 40, textAlign: "center", marginBottom: 8 },
  noFundsTitle: { fontSize: 18, fontFamily: Fonts.primaryBold, color: RED, textAlign: "center", marginBottom: 12 },
  noFundsBody: { fontSize: 14, color: "#555", textAlign: "center", lineHeight: 22, marginBottom: 20 },
});