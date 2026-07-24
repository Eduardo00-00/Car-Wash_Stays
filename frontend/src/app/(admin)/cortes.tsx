import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const periodos = ['Hoy', '3 días', 'Semana'];

const datosPorPeriodo: Record<string, {
  autosLavados: number;
  totalDinero: number;
  efectivo: number;
  tarjeta: number;
  tiempoTotal: string;
  lavados: { id: number; fecha: string; cliente: string; paquete: string; precio: number; metodo: string; lavadores: string[] }[];
}> = {
  'Hoy': {
    autosLavados: 8, totalDinero: 1240, efectivo: 740, tarjeta: 500, tiempoTotal: '6h 20min',
    lavados: [
      { id: 1, fecha: 'Hoy 11:40am', cliente: 'Carlos Mendoza', paquete: 'Premium', precio: 299, metodo: 'Tarjeta',  lavadores: ['Hector Medina', 'Sebastian Sanchez'] },
      { id: 2, fecha: 'Hoy 10:15am', cliente: 'Ana López',      paquete: 'Básico',  precio: 99,  metodo: 'Efectivo', lavadores: ['Hector Medina'] },
      { id: 3, fecha: 'Hoy 9:30am',  cliente: 'Jorge Ruiz',     paquete: 'Full',    precio: 499, metodo: 'Efectivo', lavadores: ['Sebastian Sanchez'] },
    ],
  },
  '3 días': {
    autosLavados: 21, totalDinero: 3870, efectivo: 2100, tarjeta: 1770, tiempoTotal: '18h 45min',
    lavados: [
      { id: 1, fecha: 'Ayer 3:00pm',  cliente: 'María Torres', paquete: 'Full',    precio: 499, metodo: 'Tarjeta',  lavadores: ['Hector Medina', 'Sebastian Sanchez'] },
      { id: 2, fecha: 'Ayer 1:20pm',  cliente: 'Luis Pérez',   paquete: 'Básico',  precio: 99,  metodo: 'Efectivo', lavadores: ['Sebastian Sanchez'] },
      { id: 3, fecha: 'Hace 2 días',  cliente: 'Roberto Díaz', paquete: 'Premium', precio: 299, metodo: 'Efectivo', lavadores: ['Hector Medina'] },
    ],
  },
  'Semana': {
    autosLavados: 47, totalDinero: 9850, efectivo: 5200, tarjeta: 4650, tiempoTotal: '42h 10min',
    lavados: [
      { id: 1, fecha: 'Lunes',     cliente: 'Pedro Gómez',   paquete: 'Full',    precio: 499, metodo: 'Tarjeta',  lavadores: ['Hector Medina', 'Sebastian Sanchez'] },
      { id: 2, fecha: 'Martes',    cliente: 'Laura Sánchez', paquete: 'Premium', precio: 299, metodo: 'Efectivo', lavadores: ['Hector Medina'] },
      { id: 3, fecha: 'Miércoles', cliente: 'Diego Ramos',   paquete: 'Básico',  precio: 99,  metodo: 'Efectivo', lavadores: ['Sebastian Sanchez'] },
    ],
  },
};

const chartConfig = {
  backgroundColor: '#162C42',
  backgroundGradientFrom: '#162C42',
  backgroundGradientTo: '#162C42',
  color: (opacity = 1) => `rgba(201, 162, 77, ${opacity})`,
};

export default function CortesScreen() {
  const [periodoActivo, setPeriodoActivo] = useState('Hoy');
  const [cortesRealizados, setCortesRealizados] = useState<{ periodo: string; fecha: string; total: number }[]>([]);
  const datos = datosPorPeriodo[periodoActivo];

  const handleCorte = () => {
    Alert.alert(
      'Confirmar corte de caja',
      `¿Deseas realizar el corte de ${periodoActivo}? Total: $${datos.totalDinero}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            const fecha = new Date().toLocaleDateString('es-MX', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });
            setCortesRealizados(prev => [
              { periodo: periodoActivo, fecha, total: datos.totalDinero },
              ...prev,
            ]);
            Alert.alert('✅ Corte realizado', `Corte de ${periodoActivo} guardado correctamente.`);
          },
        },
      ]
    );
  };

  const paquetesData = [
    { name: 'Básico',  population: datos.lavados.filter(l => l.paquete === 'Básico').length,  color: '#4FC3F7', legendFontColor: '#F5F7FA', legendFontSize: 12 },
    { name: 'Premium', population: datos.lavados.filter(l => l.paquete === 'Premium').length, color: '#C9A24D', legendFontColor: '#F5F7FA', legendFontSize: 12 },
    { name: 'Full',    population: datos.lavados.filter(l => l.paquete === 'Full').length,    color: '#EEBA2B', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  ].filter(d => d.population > 0);

  const pagosData = [
    { name: 'Efectivo', population: datos.efectivo, color: '#4CAF50', legendFontColor: '#F5F7FA', legendFontSize: 12 },
    { name: 'Tarjeta',  population: datos.tarjeta,  color: '#C9A24D', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        <Text style={styles.titulo}>Corte de caja</Text>
        <Text style={styles.subtitulo}>Selecciona el período y realiza el cierre</Text>
        <View style={styles.divider} />

        {/* selector periodo */}
        <Text style={styles.seccion}>Período</Text>
        <View style={styles.periodosRow}>
          {periodos.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodoBtn, periodoActivo === p && styles.periodoBtnActivo]}
              onPress={() => setPeriodoActivo(p)}
              accessibilityRole="radio"
            >
              <Text style={[styles.periodoBtnText, periodoActivo === p && styles.periodoBtnTextActivo]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* resumen */}
        <Text style={styles.seccion}>Resumen — {periodoActivo}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="water-outline" size={20} color="#C9A24D" />
            <Text style={styles.statNumero}>{datos.autosLavados}</Text>
            <Text style={styles.statLabel}>Autos lavados</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash-outline" size={20} color="#C9A24D" />
            <Text style={styles.statNumero}>${datos.totalDinero}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={20} color="#C9A24D" />
            <Text style={styles.statNumero}>{datos.tiempoTotal}</Text>
            <Text style={styles.statLabel}>Tiempo trabajado</Text>
          </View>
        </View>

        {/* grafica paquetes */}
        <Text style={styles.seccion}>Paquetes del período</Text>
        <View style={styles.graficaCard}>
          <PieChart
            data={paquetesData}
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
            data={pagosData}
            width={Math.min(width, 500) - 40}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>

        {/* detalle lavados */}
        <Text style={styles.seccion}>Detalle de lavados</Text>
        {datos.lavados.map((item) => (
          <View key={item.id} style={styles.lavadoCard}>
            <View style={styles.lavadoIconBox}>
              <Ionicons name="car-outline" size={18} color="#C9A24D" />
            </View>
            <View style={styles.lavadoInfo}>
              <Text style={styles.lavadoCliente}>{item.cliente}</Text>
              <Text style={styles.lavadoPaquete}>{item.paquete} — {item.fecha}</Text>
              <View style={styles.lavadoRow}>
                <Ionicons name="people-outline" size={11} color="#8899aa" />
                <Text style={styles.lavadoDetalle}>{item.lavadores.join(', ')}</Text>
              </View>
              <View style={styles.lavadoRow}>
                <Ionicons name={item.metodo === 'Efectivo' ? 'cash-outline' : 'card-outline'} size={11} color="#8899aa" />
                <Text style={styles.lavadoDetalle}>{item.metodo}</Text>
              </View>
            </View>
            <Text style={styles.lavadoPrecio}>${item.precio}</Text>
          </View>
        ))}

        {/* boton corte */}
        <TouchableOpacity style={styles.btnCorte} onPress={handleCorte} accessibilityRole="button">
          <Ionicons name="receipt-outline" size={18} color="#0B1F33" />
          <Text style={styles.btnCorteText}>Realizar corte de {periodoActivo}</Text>
        </TouchableOpacity>

        {/* cortes anteriores */}
        {cortesRealizados.length > 0 && (
          <>
            <Text style={styles.seccion}>Cortes realizados</Text>
            {cortesRealizados.map((corte, index) => (
              <View key={index} style={styles.corteCard}>
                <View style={styles.corteLeft}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#C9A24D" />
                  <View>
                    <Text style={styles.cortePeriodo}>Corte de {corte.periodo}</Text>
                    <Text style={styles.corteFecha}>{corte.fecha}</Text>
                  </View>
                </View>
                <Text style={styles.corteTotal}>${corte.total}</Text>
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
  inner: {
    padding: 20, maxWidth: 500,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center', paddingBottom: 48,
  },
  titulo: { fontSize: 20, fontWeight: '700', color: '#F5F7FA' },
  subtitulo: { fontSize: 12, color: '#8899aa', marginTop: 2, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#C9A24D', marginBottom: 22, opacity: 0.4 },
  seccion: { fontSize: 13, fontWeight: '600', color: '#F5F7FA', marginBottom: 12 },
  periodosRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  periodoBtn: {
    flex: 1, borderWidth: 1, borderColor: '#C9A24D44',
    borderRadius: 10, paddingVertical: 10, alignItems: 'center',
    backgroundColor: '#162C42',
  },
  periodoBtnActivo: { backgroundColor: '#C9A24D', borderColor: '#C9A24D' },
  periodoBtnText: { fontSize: 13, color: '#F5F7FA', fontWeight: '500' },
  periodoBtnTextActivo: { color: '#0B1F33', fontWeight: '700' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: '#162C42', borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 6,
    borderWidth: 0.5, borderColor: '#C9A24D33',
  },
  statNumero: { fontSize: 15, fontWeight: 'bold', color: '#F5F7FA' },
  statLabel: { fontSize: 10, color: '#8899aa', textAlign: 'center' },
  graficaCard: {
    backgroundColor: '#162C42', borderRadius: 12,
    padding: 10, marginBottom: 24,
    borderWidth: 0.5, borderColor: '#C9A24D33',
    alignItems: 'center',
  },
  lavadoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#162C42', borderRadius: 10,
    padding: 12, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#C9A24D22',
  },
  lavadoIconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#C9A24D22', alignItems: 'center', justifyContent: 'center',
  },
  lavadoInfo: { flex: 1 },
  lavadoCliente: { fontSize: 13, fontWeight: '600', color: '#F5F7FA' },
  lavadoPaquete: { fontSize: 11, color: '#C9A24D', marginTop: 1 },
  lavadoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  lavadoDetalle: { fontSize: 10, color: '#8899aa' },
  lavadoPrecio: { fontSize: 14, fontWeight: '700', color: '#C9A24D' },
  btnCorte: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: '#C9A24D', borderRadius: 10,
    paddingVertical: 13, marginTop: 8, marginBottom: 24,
  },
  btnCorteText: { fontSize: 14, fontWeight: '700', color: '#0B1F33' },
  corteCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#162C42', borderRadius: 10,
    padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: '#C9A24D33',
  },
  corteLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cortePeriodo: { fontSize: 13, fontWeight: '600', color: '#F5F7FA' },
  corteFecha: { fontSize: 11, color: '#8899aa', marginTop: 2 },
  corteTotal: { fontSize: 15, fontWeight: '700', color: '#C9A24D' },
});