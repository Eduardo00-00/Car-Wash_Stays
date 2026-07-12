import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const promocionesActivas = [
  { id: 1, titulo: '20% de descuento en lavado Premium', descripcion: 'Válido todos los lunes del mes' },
  { id: 2, titulo: 'Lavado básico gratis en tu cumpleaños', descripcion: 'Presenta tu identificación el día de tu cumpleaños' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const [notifVisible, setNotifVisible] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>

      {/* modal notificaciones */}
      <Modal
        visible={notifVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setNotifVisible(false)}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.fondoCard }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitulo, { color: colors.texto }]}>Promociones activas</Text>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Ionicons name="close-outline" size={22} color={colors.textoSub} />
              </TouchableOpacity>
            </View>
            <View style={[styles.modalDivider, { backgroundColor: colors.dorado }]} />
            {promocionesActivas.map((promo) => (
              <View key={promo.id} style={[styles.promoItem, { borderColor: colors.borde }]}>
                <View style={[styles.promoIconBox, { backgroundColor: colors.fondo }]}>
                  <Ionicons name="pricetag-outline" size={18} color={colors.dorado} />
                </View>
                <View style={styles.promoInfo}>
                  <Text style={[styles.promoTitulo, { color: colors.texto }]}>{promo.titulo}</Text>
                  <Text style={[styles.promoDesc, { color: colors.textoSub }]}>{promo.descripcion}</Text>
                </View>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* header */}
        <View style={[styles.header, { backgroundColor: colors.header }]}>
          <View>
            <Text style={[styles.bienvenido, { color: colors.dorado }]}>Bienvenido</Text>
            <Text style={[styles.nombre, { color: colors.textoHeader }]}>Carlos Mendoza</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={styles.headerBtn}
              accessibilityLabel={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              <Ionicons
                name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
                size={22}
                color={colors.dorado}
              />
            </TouchableOpacity>

            {/* campanita */}
            <TouchableOpacity
              style={styles.headerBtn}
              onPress={() => setNotifVisible(true)}
              accessibilityLabel="Ver promociones"
              accessibilityRole="button"
            >
              <Ionicons name="notifications-outline" size={22} color={colors.dorado} />
              {promocionesActivas.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{promocionesActivas.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>CM</Text>
            </View>
          </View>
        </View>

        {/* tarjeta estado */}
        <View style={[styles.cardEstado, { backgroundColor: colors.fondoCard, borderColor: colors.borde }]}>
          <View style={styles.cardEstadoLeft}>
            <View style={styles.dot} />
            <View>
              <Text style={[styles.cardEstadoTitulo, { color: colors.texto }]}>Tu vehículo en proceso</Text>
              <Text style={[styles.cardEstadoSub, { color: colors.textoSub }]}>Honda Civic — Lavado Premium</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.estadoBadge}
            onPress={() => router.push('/status' as any)}
          >
            <Text style={styles.estadoBadgeText}>Ver estado</Text>
          </TouchableOpacity>
        </View>

        {/* servicios */}
        <Text style={[styles.seccion, { color: colors.texto }]}>Servicios</Text>
        <View style={styles.grid}>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.header }]}
            onPress={() => router.push('/car-register' as any)}
            accessibilityRole="button"
          >
            <View style={styles.cardIconBox}>
              <Ionicons name="add-circle-outline" size={24} color={colors.dorado} />
            </View>
            <Text style={[styles.cardTitulo, { color: colors.textoHeader }]}>Registrar auto</Text>
            <Text style={[styles.cardSub, { color: colors.textoSub }]}>Agregar vehículo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.header }]}
            onPress={() => router.push('/(tabs)/autos' as any)}
            accessibilityRole="button"
          >
            <View style={styles.cardIconBox}>
              <Ionicons name="car-outline" size={24} color={colors.dorado} />
            </View>
            <Text style={[styles.cardTitulo, { color: colors.textoHeader }]}>Mis autos</Text>
            <Text style={[styles.cardSub, { color: colors.textoSub }]}>Ver listado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.header }]}
            onPress={() => router.push('/(tabs)/historial' as any)}
            accessibilityRole="button"
          >
            <View style={styles.cardIconBox}>
              <Ionicons name="stats-chart-outline" size={24} color={colors.dorado} />
            </View>
            <Text style={[styles.cardTitulo, { color: colors.textoHeader }]}>Historial</Text>
            <Text style={[styles.cardSub, { color: colors.textoSub }]}>Stats y lavados</Text>
          </TouchableOpacity>

          <View style={[styles.card, styles.cardInactivo, { backgroundColor: colors.header }]}>
            <View style={styles.cardIconBox}>
              <Ionicons name="calendar-outline" size={24} color={colors.textoSub} />
            </View>
            <Text style={[styles.cardTitulo, { color: colors.textoSub }]}>Agendar</Text>
            <Text style={[styles.cardSub, { color: colors.textoSub }]}>Próximamente</Text>
            <View style={styles.proximamente}>
              <Text style={styles.proximamenteText}>Pronto</Text>
            </View>
          </View>

        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24, paddingTop: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bienvenido: { fontSize: 12, letterSpacing: 0.5 },
  nombre: { fontSize: 18, fontWeight: '600', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerBtn: { padding: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C9A24D', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '600', color: '#0B1F33' },
  badge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#ff4444', alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9, color: '#ffffff', fontWeight: '700' },
  cardEstado: { margin: 16, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1 },
  cardEstadoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EEBA2B' },
  cardEstadoTitulo: { fontSize: 13, fontWeight: '500' },
  cardEstadoSub: { fontSize: 11, marginTop: 2 },
  estadoBadge: { backgroundColor: '#EEBA2B22', borderWidth: 0.5, borderColor: '#EEBA2B55', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  estadoBadgeText: { fontSize: 11, color: '#EEBA2B', fontWeight: '500' },
  seccion: { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, marginBottom: 12, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 20 },
  card: { borderRadius: 12, padding: 16, width: '48%', gap: 8 },
  cardInactivo: { opacity: 0.5 },
  cardIconBox: { width: 40, height: 40, backgroundColor: '#C9A24D22', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitulo: { fontSize: 13, fontWeight: '500' },
  cardSub: { fontSize: 11 },
  proximamente: { backgroundColor: '#C9A24D22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  proximamenteText: { fontSize: 10, color: '#C9A24D' },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'flex-start', paddingTop: 100, paddingHorizontal: 16 },
  modalCard: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitulo: { fontSize: 16, fontWeight: '700' },
  modalDivider: { height: 1, marginBottom: 16, opacity: 0.5 },
  promoItem: { flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5 },
  promoIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  promoInfo: { flex: 1 },
  promoTitulo: { fontSize: 13, fontWeight: '600' },
  promoDesc: { fontSize: 11, marginTop: 2 },
});