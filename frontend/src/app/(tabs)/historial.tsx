import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, Alert, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const historial = [
  { id: 1, fecha: '20 mayo 2026',  paquete: 'Premium', precio: '$299', duracion: '45 min', estado: 'Completado', lavadores: ['Hector Medina', 'Sebastian Sanchez'] },
  { id: 2, fecha: '10 mayo 2026',  paquete: 'Básico',  precio: '$99',  duracion: '20 min', estado: 'Completado', lavadores: ['Hector Medina'] },
  { id: 3, fecha: '28 abril 2026', paquete: 'Full',    precio: '$499', duracion: '90 min', estado: 'Completado', lavadores: ['Hector Medina', 'Sebastian Sanchez'] },
  { id: 4, fecha: '15 abril 2026', paquete: 'Básico',  precio: '$99',  duracion: '20 min', estado: 'Completado', lavadores: ['Gustavo Sanchez'] },
];

const tiempoPromedio = '44 min';
const lavadoFavorito = 'Básico';

export default function HistorialScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const [historialData, setHistorialData] = useState(historial);

  const handleBorrarHistorial = () => {
    Alert.alert(
      'Borrar historial',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: () => setHistorialData([]) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.titulo, { color: colors.texto }]}>Historial</Text>
            <Text style={[styles.subtitulo, { color: colors.textoSub }]}>Tus lavados y estadísticas</Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            accessibilityLabel={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          >
            <Ionicons
              name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
              size={22}
              color={colors.dorado}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dorado }]} />

        {/* estadisticas */}
        <Text style={[styles.seccion, { color: colors.texto }]}>Estadísticas</Text>
        <View style={styles.statsGrid}>

          <View style={[styles.statCard, { backgroundColor: colors.header }]}>
            <Ionicons name="water-outline" size={22} color={colors.dorado} />
            <Text style={[styles.statNumero, { color: colors.textoHeader }]}>{historial.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textoSub }]}>Lavados totales</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.header }]}>
            <Ionicons name="time-outline" size={22} color={colors.dorado} />
            <Text style={[styles.statNumero, { color: colors.textoHeader }]}>{tiempoPromedio}</Text>
            <Text style={[styles.statLabel, { color: colors.textoSub }]}>Tiempo promedio</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.header }]}>
            <Ionicons name="star-outline" size={22} color={colors.dorado} />
            <Text style={[styles.statNumero, { color: colors.textoHeader }]}>{lavadoFavorito}</Text>
            <Text style={[styles.statLabel, { color: colors.textoSub }]}>Paquete favorito</Text>
          </View>

        </View>

        {/* estatus actual */}
        <Text style={[styles.seccion, { color: colors.texto }]}>Estatus actual</Text>
        <View style={[styles.estatusCard, { backgroundColor: colors.fondoCard, borderColor: colors.borde }]}>
          <View style={styles.estatusTop}>
            <View style={styles.dot} />
            <Text style={[styles.estatusTitulo, { color: colors.texto }]}>Honda Civic en proceso</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>En curso</Text>
            </View>
          </View>
          <Text style={[styles.estatusSub, { color: colors.textoSub }]}>Lavado Premium — Paso 3 de 7</Text>
          <View style={styles.barraFondo}>
            <View style={styles.barraRelleno} />
          </View>
          <View style={styles.estatusTimers}>
            <Text style={[styles.timerLabel, { color: colors.textoSub }]}>Tiempo transcurrido</Text>
            <Text style={[styles.timerLabel, { color: colors.textoSub }]}>Tiempo estimado restante</Text>
          </View>
          <View style={styles.estatusTimers}>
            <Text style={[styles.timerValor, { color: colors.dorado }]}>15 min</Text>
            <Text style={[styles.timerValor, { color: colors.dorado }]}>~30 min</Text>
          </View>
        </View>

        {/* historial */}
        <Text style={[styles.seccion, { color: colors.texto }]}>Lavados anteriores</Text>
        {historialData.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.fondoCard, borderColor: colors.borde }]}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.fondo }]}>
              <Ionicons name="car-outline" size={22} color={colors.dorado} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardPaquete, { color: colors.texto }]}>Paquete {item.paquete}</Text>
              <Text style={[styles.cardFecha, { color: colors.textoSub }]}>{item.fecha}</Text>
              <View style={styles.duracionRow}>
                <Ionicons name="time-outline" size={12} color={colors.textoSub} />
                <Text style={[styles.duracion, { color: colors.textoSub }]}>{item.duracion}</Text>
              </View>
              <View style={styles.duracionRow}>
                <Ionicons name="people-outline" size={12} color={colors.textoSub} />
                <Text style={[styles.duracion, { color: colors.textoSub }]}>{item.lavadores.join(', ')}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.cardPrecio, { color: colors.dorado }]}>{item.precio}</Text>
              <Text style={[styles.cardEstado, { color: colors.textoSub }]}>{item.estado}</Text>
            </View>
          </View>
        ))}

        {historialData.length > 0 && (
          <TouchableOpacity
            style={[styles.btnBorrar, { borderColor: '#ff4444' }]}
            onPress={handleBorrarHistorial}
            accessibilityRole="button"
            accessibilityLabel="Borrar historial"
          >
            <Ionicons name="trash-outline" size={16} color="#ff4444" />
            <Text style={styles.btnBorrarText}>Borrar historial</Text>
          </TouchableOpacity>
        )}

        {historialData.length === 0 && (
          <View style={styles.vacioCard}>
            <Ionicons name="document-outline" size={32} color={colors.textoSub} />
            <Text style={[styles.vacioText, { color: colors.textoSub }]}>No hay lavados registrados</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    padding: 24,
    maxWidth: 500,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
    paddingBottom: 48,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginBottom: 22, opacity: 0.5 },
  seccion: { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, marginBottom: 24,
  },
  statCard: {
    width: (width - 72) / 2,
    borderRadius: 12, padding: 16,
    alignItems: 'center', gap: 6,
  },
  statNumero: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, textAlign: 'center' },
  estatusCard: {
    borderRadius: 12, borderWidth: 1,
    padding: 16, marginBottom: 24,
  },
  estatusTop: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginBottom: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EEBA2B' },
  estatusTitulo: { fontSize: 13, fontWeight: '600', flex: 1 },
  badge: {
    backgroundColor: '#EEBA2B22', borderWidth: 0.5,
    borderColor: '#EEBA2B55', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { fontSize: 10, color: '#EEBA2B', fontWeight: '500' },
  estatusSub: { fontSize: 11, marginBottom: 10 },
  barraFondo: { height: 6, backgroundColor: '#ffffff22', borderRadius: 3, marginBottom: 10 },
  barraRelleno: { height: 6, width: '30%', backgroundColor: '#C9A24D', borderRadius: 3 },
  estatusTimers: { flexDirection: 'row', justifyContent: 'space-between' },
  timerLabel: { fontSize: 10 },
  timerValor: { fontSize: 13, fontWeight: '600' },
  card: {
    borderRadius: 10, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 10,
  },
  cardIconBox: {
    width: 44, height: 44, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardPaquete: { fontSize: 13, fontWeight: '600' },
  cardFecha: { fontSize: 11, marginTop: 2 },
  duracionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  duracion: { fontSize: 11 },
  cardRight: { alignItems: 'flex-end' },
  cardPrecio: { fontSize: 14, fontWeight: '700' },
  cardEstado: { fontSize: 11, marginTop: 2 },
  btnBorrar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10,
    paddingVertical: 12, marginTop: 8,
  },
  btnBorrarText: { fontSize: 13, fontWeight: '500', color: '#ff4444' },
  vacioCard: {
    alignItems: 'center', padding: 32, gap: 10,
  },
  vacioText: { fontSize: 13 },
});