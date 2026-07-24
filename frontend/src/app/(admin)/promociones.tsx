import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const promocionesIniciales = [
  { id: 1, titulo: '20% de descuento en lavado Premium', descripcion: 'Válido todos los lunes del mes', activa: true,  fecha: '20 mayo 2026' },
  { id: 2, titulo: 'Lavado básico gratis en tu cumpleaños', descripcion: 'Presenta tu identificación el día de tu cumpleaños', activa: true,  fecha: '15 mayo 2026' },
  { id: 3, titulo: '6ta lavada gratis', descripcion: 'Acumula 5 lavados y el 6to es sin costo', activa: false, fecha: '1 mayo 2026' },
];

export default function PromocionesScreen() {
  const [promociones, setPromociones] = useState(promocionesIniciales);
  const [agregando, setAgregando] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleAgregar = () => {
    if (!titulo || !descripcion) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }
    const nueva = {
      id: promociones.length + 1,
      titulo,
      descripcion,
      activa: true,
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
    };
    setPromociones([nueva, ...promociones]);
    setTitulo('');
    setDescripcion('');
    setAgregando(false);
    Alert.alert('¡Listo!', 'Promoción creada y notificación enviada a los clientes');
  };

  const toggleActiva = (id: number) => {
    setPromociones(promociones.map(p =>
      p.id === id ? { ...p, activa: !p.activa } : p
    ));
  };

  const handleEliminar = (id: number) => {
    Alert.alert('Eliminar promoción', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setPromociones(promociones.filter(p => p.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.titulo}>Promociones</Text>
            <Text style={styles.subtitulo}>{promociones.filter(p => p.activa).length} activas — {promociones.filter(p => !p.activa).length} inactivas</Text>
          </View>
          <TouchableOpacity
            style={styles.btnAdd}
            onPress={() => setAgregando(!agregando)}
            accessibilityRole="button"
          >
            <Ionicons name={agregando ? 'close-outline' : 'add-outline'} size={22} color="#0B1F33" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* formulario */}
        {agregando && (
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Nueva promoción</Text>

            <Text style={styles.label}>Título</Text>
            <View style={styles.inputBox}>
              <Ionicons name="pricetag-outline" size={16} color="#C9A24D" />
              <TextInput
                style={styles.input}
                placeholder="ej. 20% de descuento en lavado Premium"
                placeholderTextColor="#ffffff44"
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>

            <Text style={styles.label}>Descripción</Text>
            <View style={[styles.inputBox, { alignItems: 'flex-start', paddingVertical: 12 }]}>
              <Ionicons name="document-text-outline" size={16} color="#C9A24D" style={{ marginTop: 2 }} />
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="descripción de la promoción"
                placeholderTextColor="#ffffff44"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.btnGuardar}
              onPress={handleAgregar}
              accessibilityRole="button"
            >
              <Ionicons name="megaphone-outline" size={16} color="#0B1F33" />
              <Text style={styles.btnGuardarText}>Publicar y notificar clientes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* promociones activas */}
        <Text style={styles.seccion}>Promociones activas</Text>
        {promociones.filter(p => p.activa).map((promo) => (
          <View key={promo.id} style={[styles.promoCard, styles.promoCardActiva]}>
            <View style={styles.promoTop}>
              <View style={styles.promoIconBox}>
                <Ionicons name="pricetag-outline" size={20} color="#C9A24D" />
              </View>
              <View style={styles.promoInfo}>
                <Text style={styles.promoTitulo}>{promo.titulo}</Text>
                <Text style={styles.promoDesc}>{promo.descripcion}</Text>
                <Text style={styles.promoFecha}>{promo.fecha}</Text>
              </View>
            </View>
            <View style={styles.promoActions}>
              <TouchableOpacity
                style={styles.btnDesactivar}
                onPress={() => toggleActiva(promo.id)}
                accessibilityRole="button"
              >
                <Ionicons name="pause-circle-outline" size={16} color="#EEBA2B" />
                <Text style={styles.btnDesactivarText}>Desactivar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleEliminar(promo.id)}>
                <Ionicons name="trash-outline" size={18} color="#ff444488" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {promociones.filter(p => p.activa).length === 0 && (
          <View style={styles.vacioCard}>
            <Ionicons name="pricetag-outline" size={28} color="#8899aa" />
            <Text style={styles.vacioText}>No hay promociones activas</Text>
          </View>
        )}

        {/* promociones inactivas */}
        {promociones.filter(p => !p.activa).length > 0 && (
          <>
            <Text style={[styles.seccion, { marginTop: 8 }]}>Promociones inactivas</Text>
            {promociones.filter(p => !p.activa).map((promo) => (
              <View key={promo.id} style={styles.promoCard}>
                <View style={styles.promoTop}>
                  <View style={[styles.promoIconBox, { opacity: 0.5 }]}>
                    <Ionicons name="pricetag-outline" size={20} color="#8899aa" />
                  </View>
                  <View style={styles.promoInfo}>
                    <Text style={[styles.promoTitulo, { color: '#8899aa' }]}>{promo.titulo}</Text>
                    <Text style={styles.promoDesc}>{promo.descripcion}</Text>
                    <Text style={styles.promoFecha}>{promo.fecha}</Text>
                  </View>
                </View>
                <View style={styles.promoActions}>
                  <TouchableOpacity
                    style={styles.btnActivar}
                    onPress={() => toggleActiva(promo.id)}
                    accessibilityRole="button"
                  >
                    <Ionicons name="play-circle-outline" size={16} color="#4CAF50" />
                    <Text style={styles.btnActivarText}>Activar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleEliminar(promo.id)}>
                    <Ionicons name="trash-outline" size={18} color="#ff444488" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1F33' },
  inner: { padding: 20, maxWidth: 500, width: width > 500 ? 500 : '100%', alignSelf: 'center', paddingBottom: 48 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#F5F7FA' },
  subtitulo: { fontSize: 12, color: '#8899aa', marginTop: 2 },
  btnAdd: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C9A24D', alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#C9A24D', marginBottom: 22, opacity: 0.4 },
  formCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 0.5, borderColor: '#C9A24D33' },
  formTitulo: { fontSize: 14, fontWeight: '600', color: '#F5F7FA', marginBottom: 14 },
  label: { fontSize: 11, color: '#C9A24D', marginBottom: 5, fontWeight: '600' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1F33', borderRadius: 8, borderWidth: 1, borderColor: '#C9A24D33', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, gap: 8 },
  input: { flex: 1, fontSize: 13, color: '#F5F7FA' },
  btnGuardar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#C9A24D', borderRadius: 8, paddingVertical: 12, marginTop: 4 },
  btnGuardarText: { fontSize: 13, fontWeight: '700', color: '#0B1F33' },
  seccion: { fontSize: 13, fontWeight: '600', color: '#F5F7FA', marginBottom: 12 },
  promoCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: '#C9A24D22' },
  promoCardActiva: { borderColor: '#C9A24D44' },
  promoTop: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  promoIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#C9A24D22', alignItems: 'center', justifyContent: 'center' },
  promoInfo: { flex: 1 },
  promoTitulo: { fontSize: 13, fontWeight: '600', color: '#F5F7FA' },
  promoDesc: { fontSize: 11, color: '#8899aa', marginTop: 3 },
  promoFecha: { fontSize: 10, color: '#C9A24D', marginTop: 4 },
  promoActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  btnDesactivar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEBA2B22', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnDesactivarText: { fontSize: 12, color: '#EEBA2B', fontWeight: '500' },
  btnActivar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#4CAF5022', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  btnActivarText: { fontSize: 12, color: '#4CAF50', fontWeight: '500' },
  vacioCard: { alignItems: 'center', padding: 24, gap: 8 },
  vacioText: { fontSize: 13, color: '#8899aa' },
});