import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const resumenHoy = {
  autosLavados: 8,
  totalDinero: 1240,
  efectivo: 740,
  tarjeta: 500,
  tiempoTotal: '6h 20min',
};

const lavadosRecientes = [
  { id: 1, cliente: 'Carlos Mendoza', auto: 'Honda Civic',  paquete: 'Premium', precio: 299, metodo: 'Tarjeta',  lavadores: ['Hector Medina', 'Sebastian Sanchez'], hora: '11:40 am' },
  { id: 2, cliente: 'Ana López',      auto: 'Nissan Versa', paquete: 'Básico',  precio: 99,  metodo: 'Efectivo', lavadores: ['Hector Medina'], hora: '10:15 am' },
  { id: 3, cliente: 'Jorge Ruiz',     auto: 'Toyota Hilux', paquete: 'Full',    precio: 499, metodo: 'Efectivo', lavadores: ['Sebastian Sanchez'], hora: '9:30 am' },
];

const dataPaquetes = [
  { name: 'Básico',   population: 3, color: '#4FC3F7', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: 'Premium',  population: 3, color: '#C9A24D', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: 'Full',     population: 2, color: '#EEBA2B', legendFontColor: '#F5F7FA', legendFontSize: 12 },
];

const dataPagos = [
  { name: 'Efectivo', population: resumenHoy.efectivo, color: '#4CAF50', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: 'Tarjeta',  population: resumenHoy.tarjeta,  color: '#C9A24D', legendFontColor: '#F5F7FA', legendFontSize: 12 },
];

const chartConfig = {
  backgroundColor: '#162C42',
  backgroundGradientFrom: '#162C42',
  backgroundGradientTo: '#162C42',
  color: (opacity = 1) => `rgba(201, 162, 77, ${opacity})`,
};

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.bienvenido}>Panel administrativo</Text>
            <Text style={styles.titulo}>Resumen de hoy</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.7}
            onPress={() => {
              if (typeof window !== 'undefined') {
                const confirmar = window.confirm('¿Deseas salir del panel?');
                if (confirmar) window.location.href = '/';
              } else {
                Alert.alert('Cerrar sesión', '¿Deseas salir?', [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Salir', onPress: () => router.replace('/' as any) },
                ]);
              }
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#0B1F33" />
          </TouchableOpacity>
        </View>

        {/* estadisticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={22} color="#C9A24D" />
            <Text style={styles.statNumero}>{resumenHoy.autosLavados}</Text>
            <Text style={styles.statLabel}>Autos lavados</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={22} color="#C9A24D" />
            <Text style={styles.statNumero}>${resumenHoy.totalDinero}</Text>
            <Text style={styles.statLabel}>Total del día</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={22} color="#C9A24D" />
            <Text style={styles.statNumero}>{resumenHoy.tiempoTotal}</Text>
            <Text style={styles.statLabel}>Tiempo trabajado</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={22} color="#C9A24D" />
            <Text style={styles.statNumero}>2</Text>
            <Text style={styles.statLabel}>Lavadores activos</Text>
          </View>
        </View>

        {/* grafica paquetes */}
        <Text style={styles.seccion}>Paquetes del día</Text>
        <View style={styles.graficaCard}>
          <PieChart
            data={dataPaquetes}
            width={Math.min(width, 500) - 40}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>

        {/* grafica pagos */}
        <Text style={styles.seccion}>Métodos de pago</Text>
        <View style={styles.graficaCard}>
          <PieChart
            data={dataPagos}
            width={Math.min(width, 500) - 40}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>

        {/* boton corte */}
        <TouchableOpacity
          style={styles.btnCorte}
          onPress={() => router.push('/(admin)/cortes' as any)}
          accessibilityRole="button"
        >
          <Ionicons name="receipt-outline" size={18} color="#0B1F33" />
          <Text style={styles.btnCorteText}>Hacer corte de caja</Text>
        </TouchableOpacity>

        {/* lavados recientes */}
        <Text style={styles.seccion}>Lavados de hoy</Text>
        {lavadosRecientes.map((item) => (
          <View key={item.id} style={styles.lavadoCard}>
            <View style={styles.lavadoIconBox}>
              <Ionicons name="car-outline" size={20} color="#C9A24D" />
            </View>
            <View style={styles.lavadoInfo}>
              <Text style={styles.lavadoCliente}>{item.cliente}</Text>
              <Text style={styles.lavadoAuto}>{item.auto} — {item.paquete}</Text>
              <View style={styles.lavadoRow}>
                <Ionicons name="people-outline" size={11} color="#8899aa" />
                <Text style={styles.lavadoDetalle}>{item.lavadores.join(', ')}</Text>
              </View>
              <View style={styles.lavadoRow}>
                <Ionicons name={item.metodo === 'Efectivo' ? 'cash-outline' : 'card-outline'} size={11} color="#8899aa" />
                <Text style={styles.lavadoDetalle}>{item.metodo} — {item.hora}</Text>
              </View>
            </View>
            <Text style={styles.lavadoPrecio}>${item.precio}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1F33' },
  inner: {
    padding: 20,
    maxWidth: 500,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  bienvenido: { fontSize: 11, color: '#C9A24D', letterSpacing: 0.5 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#F5F7FA', marginTop: 2 },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#C9A24D',
    alignItems: 'center', justifyContent: 'center',
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#162C42', borderRadius: 12, padding: 16,
    alignItems: 'center', gap: 6,
    borderWidth: 0.5, borderColor: '#C9A24D33',
  },
  statNumero: { fontSize: 18, fontWeight: 'bold', color: '#F5F7FA' },
  statLabel: { fontSize: 11, color: '#8899aa', textAlign: 'center' },
  seccion: { fontSize: 13, fontWeight: '600', color: '#F5F7FA', marginBottom: 12 },
  graficaCard: {
    backgroundColor: '#162C42', borderRadius: 12,
    padding: 10, marginBottom: 24,
    borderWidth: 0.5, borderColor: '#C9A24D33',
    alignItems: 'center',
  },
  btnCorte: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#C9A24D', borderRadius: 10,
    paddingVertical: 13, marginBottom: 24,
  },
  btnCorteText: { fontSize: 14, fontWeight: '700', color: '#0B1F33' },
  lavadoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#162C42', borderRadius: 10,
    padding: 12, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#C9A24D22',
  },
  lavadoIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#C9A24D22', alignItems: 'center', justifyContent: 'center',
  },
  lavadoInfo: { flex: 1 },
  lavadoCliente: { fontSize: 13, fontWeight: '600', color: '#F5F7FA' },
  lavadoAuto: { fontSize: 11, color: '#C9A24D', marginTop: 1 },
  lavadoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  lavadoDetalle: { fontSize: 10, color: '#8899aa' },
  lavadoPrecio: { fontSize: 14, fontWeight: '700', color: '#C9A24D' },
});