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

const autos = [
  { id: 1, tipo: 'Carro',    marca: 'Honda',   modelo: 'Civic',   anio: '2020', color: 'Blanco',  placas: 'ABC-123' },
  { id: 2, tipo: 'Camioneta', marca: 'Toyota',  modelo: 'Hilux',   anio: '2019', color: 'Negro',   placas: 'XYZ-456' },
  { id: 3, tipo: 'Carro',    marca: 'Nissan',  modelo: 'Versa',   anio: '2022', color: 'Gris',    placas: 'DEF-789' },
];

export default function AutosScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.titulo, { color: colors.texto }]}>Mis vehículos</Text>
            <Text style={[styles.subtitulo, { color: colors.textoSub }]}>{autos.length} vehículos registrados</Text>
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

        {/* listado */}
        {autos.map((auto) => (
          <View
            key={auto.id}
            style={[styles.card, { backgroundColor: colors.fondoCard, borderColor: colors.borde }]}
          >
            <View style={[styles.cardIconBox, { backgroundColor: colors.fondo }]}>
              <Ionicons
                name={auto.tipo === 'Camioneta' ? 'car-sport-outline' : auto.tipo === 'Moto' ? 'bicycle-outline' : 'car-outline'}
                size={26}
                color={colors.dorado}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitulo, { color: colors.texto }]}>{auto.marca} {auto.modelo}</Text>
              <Text style={[styles.cardSub, { color: colors.textoSub }]}>{auto.tipo} — {auto.anio} — {auto.color}</Text>
              <View style={styles.placasRow}>
                <Ionicons name="id-card-outline" size={13} color={colors.dorado} />
                <Text style={[styles.placas, { color: colors.dorado }]}>{auto.placas}</Text>
              </View>
            </View>
            <TouchableOpacity
              accessibilityLabel="Eliminar vehículo"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={20} color={colors.textoSub} />
            </TouchableOpacity>
          </View>
        ))}

        {/* boton agregar */}
        <TouchableOpacity
          style={[styles.btnAgregar, { backgroundColor: colors.header }]}
          onPress={() => router.push('/car-register' as any)}
          accessibilityRole="button"
          accessibilityLabel="Agregar vehículo"
        >
          <Ionicons name="add-outline" size={20} color={colors.dorado} />
          <Text style={[styles.btnAgregarText, { color: colors.textoHeader }]}>Agregar vehículo</Text>
        </TouchableOpacity>

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginBottom: 22, opacity: 0.5 },
  card: {
    borderRadius: 12, borderWidth: 1, padding: 14,
    flexDirection: 'row', alignItems: 'center',
    gap: 12, marginBottom: 12,
  },
  cardIconBox: {
    width: 52, height: 52, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 14, fontWeight: '600' },
  cardSub: { fontSize: 11, marginTop: 2 },
  placasRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  placas: { fontSize: 12, fontWeight: '600' },
  btnAgregar: {
    borderRadius: 10, paddingVertical: 13,
    alignItems: 'center', marginTop: 8,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  btnAgregarText: { fontSize: 14, fontWeight: '600' },
});