import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const pasos = [
  { id: 1, titulo: 'Auto recibido',      icono: 'car-outline',            done: true  },
  { id: 2, titulo: 'Pre-lavado',         icono: 'water-outline',          done: true  },
  { id: 3, titulo: 'Lavado principal',   icono: 'sparkles-outline',       done: false, actual: true },
  { id: 4, titulo: 'Enjuague',           icono: 'rainy-outline',          done: false },
  { id: 5, titulo: 'Secado',             icono: 'sunny-outline',          done: false },
  { id: 6, titulo: 'Revisión final',     icono: 'checkbox-outline',       done: false },
  { id: 7, titulo: 'Listo para entrega', icono: 'checkmark-done-outline', done: false },
];

export default function StatusScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.header }]}
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={20} color={colors.textoHeader} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.titulo, { color: colors.texto }]}>Estado del vehículo</Text>
            <Text style={[styles.subtitulo, { color: colors.textoSub }]}>Honda Civic — Lavado Premium</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dorado }]} />

        {/* progreso */}
        <View style={[styles.cardProgreso, { backgroundColor: colors.header }]}>
          <Text style={[styles.cardTitulo, { color: colors.textoHeader }]}>Progreso actual</Text>
          <View style={styles.barraFondo}>
            <View style={styles.barraRelleno} />
          </View>
          <Text style={[styles.cardSub, { color: colors.dorado }]}>Paso 3 de 7 — Lavado principal</Text>
          <View style={styles.timersRow}>
            <View>
              <Text style={[styles.timerLabel, { color: colors.textoSub }]}>Transcurrido</Text>
              <Text style={[styles.timerValor, { color: colors.dorado }]}>15 min</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.timerLabel, { color: colors.textoSub }]}>Tiempo restante</Text>
              <Text style={[styles.timerValor, { color: colors.dorado }]}>~30 min</Text>
            </View>
          </View>
        </View>

        {/* pasos */}
        <Text style={[styles.seccion, { color: colors.texto }]}>Detalle del proceso</Text>

        {pasos.map((paso, index) => (
          <View key={paso.id} style={styles.pasoRow}>
            <View style={styles.lineaCol}>
              <View style={[
                styles.circulo,
                { backgroundColor: colors.fondoCard },
                paso.done && styles.circuloDone,
                paso.actual && { backgroundColor: colors.header },
              ]}>
                {paso.done
                  ? <Ionicons name="checkmark" size={14} color="#F5F7FA" />
                  : paso.actual
                  ? <Ionicons name={paso.icono as any} size={14} color="#F5F7FA" />
                  : <View style={[styles.circuloVacio, { backgroundColor: colors.borde }]} />
                }
              </View>
              {index < pasos.length - 1 && (
                <View style={[
                  styles.lineaVertical,
                  { backgroundColor: colors.borde },
                  paso.done && styles.lineaVerticalDone,
                ]} />
              )}
            </View>
            <View style={[
              styles.pasoCard,
              { backgroundColor: colors.fondoCard, borderColor: colors.borde },
              paso.actual && { borderColor: colors.dorado },
            ]}>
              <View style={styles.pasoTop}>
                <Ionicons
                  name={paso.icono as any}
                  size={18}
                  color={paso.done ? colors.dorado : paso.actual ? '#EEBA2B' : colors.textoSub}
                />
                <Text style={[
                  styles.pasoTitulo,
                  { color: colors.textoSub },
                  (paso.done || paso.actual) && { color: colors.texto },
                  paso.actual && { fontWeight: '600' },
                ]}>
                  {paso.titulo}
                </Text>
              </View>
              {paso.actual && <Text style={[styles.pasoEnCurso, { color: colors.dorado }]}>En curso...</Text>}
              {paso.done && <Text style={[styles.pasoDoneText, { color: colors.dorado }]}>Completado</Text>}
            </View>
          </View>
        ))}

        {/* nota */}
        <View style={[styles.nota, { backgroundColor: colors.fondoCard }]}>
          <Ionicons name="information-circle-outline" size={16} color={colors.dorado} />
          <Text style={[styles.notaText, { color: colors.textoSub }]}>Te notificaremos cuando tu auto esté listo</Text>
        </View>

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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginBottom: 22, opacity: 0.5 },
  cardProgreso: { borderRadius: 12, padding: 16, marginBottom: 24 },
  cardTitulo: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  barraFondo: { height: 8, backgroundColor: '#ffffff22', borderRadius: 4, marginBottom: 8 },
  barraRelleno: { height: 8, width: '30%', backgroundColor: '#C9A24D', borderRadius: 4 },
  cardSub: { fontSize: 11, marginBottom: 12 },
  timersRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timerLabel: { fontSize: 10 },
  timerValor: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  seccion: { fontSize: 13, fontWeight: '600', marginBottom: 16 },
  pasoRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  lineaCol: { alignItems: 'center', width: 28 },
  circulo: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  circuloDone: { backgroundColor: '#C9A24D' },
  circuloVacio: { width: 8, height: 8, borderRadius: 4 },
  lineaVertical: { width: 2, flex: 1, marginVertical: 2, minHeight: 20 },
  lineaVerticalDone: { backgroundColor: '#C9A24D' },
  pasoCard: {
    flex: 1, borderRadius: 10, padding: 12,
    marginBottom: 8, borderWidth: 1,
  },
  pasoTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pasoTitulo: { fontSize: 13, fontWeight: '500' },
  pasoEnCurso: { fontSize: 11, marginTop: 4, marginLeft: 26 },
  pasoDoneText: { fontSize: 11, marginTop: 4, marginLeft: 26 },
  nota: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 16, borderRadius: 10, padding: 12,
  },
  notaText: { fontSize: 12, flex: 1 },
});