import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const opiniones = [
  { id: 1, cliente: 'Carlos Mendoza', paquete: 'Premium', lavador: 'Hector Medina',     puntuacion: 5, comentario: 'Excelente servicio, muy rápido y limpio.',                  fecha: '20 mayo 2026' },
  { id: 2, cliente: 'Ana López',      paquete: 'Básico',  lavador: 'Sebastian Sanchez',  puntuacion: 4, comentario: 'Buen trabajo, aunque tardó un poco más de lo esperado.',    fecha: '20 mayo 2026' },
  { id: 3, cliente: 'Jorge Ruiz',     paquete: 'Full',    lavador: 'Hector Medina',     puntuacion: 2, comentario: 'Le faltó limpiar bien los rines.',                          fecha: '19 mayo 2026' },
  { id: 4, cliente: 'María Torres',   paquete: 'Premium', lavador: 'Sebastian Sanchez',  puntuacion: 3, comentario: 'Regular, esperaba mejor resultado en el interior.',          fecha: '19 mayo 2026' },
  { id: 5, cliente: 'Luis Pérez',     paquete: 'Básico',  lavador: 'Hector Medina',     puntuacion: 1, comentario: 'Muy mal servicio, el auto quedó con manchas.',              fecha: '18 mayo 2026' },
];

const ordenadas = [...opiniones].sort((a, b) => a.puntuacion - b.puntuacion);
const promedio = (opiniones.reduce((acc, o) => acc + o.puntuacion, 0) / opiniones.length).toFixed(1);

const chartConfig = {
  backgroundColor: '#162C42',
  backgroundGradientFrom: '#162C42',
  backgroundGradientTo: '#162C42',
  color: (opacity = 1) => `rgba(201, 162, 77, ${opacity})`,
};

const puntuacionData = [
  { name: '5 ⭐', population: opiniones.filter(o => o.puntuacion === 5).length, color: '#4CAF50', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: '4 ⭐', population: opiniones.filter(o => o.puntuacion === 4).length, color: '#C9A24D', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: '3 ⭐', population: opiniones.filter(o => o.puntuacion === 3).length, color: '#EEBA2B', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: '2 ⭐', population: opiniones.filter(o => o.puntuacion === 2).length, color: '#FF9800', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  { name: '1 ⭐', population: opiniones.filter(o => o.puntuacion === 1).length, color: '#ff4444', legendFontColor: '#F5F7FA', legendFontSize: 12 },
].filter(d => d.population > 0);

const colorPuntuacion = (p: number) => p <= 2 ? '#ff4444' : p === 3 ? '#EEBA2B' : '#4CAF50';

const estrellas = (puntuacion: number, size = 14) =>
  [1, 2, 3, 4, 5].map((i) => (
    <Ionicons key={i} name={i <= puntuacion ? 'star' : 'star-outline'} size={size} color={i <= puntuacion ? '#EEBA2B' : '#ffffff33'} />
  ));

export default function RetroalimentacionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        <Text style={styles.titulo}>Retroalimentación</Text>
        <Text style={styles.subtitulo}>Opiniones de clientes ordenadas por prioridad</Text>
        <View style={styles.divider} />

        {/* resumen */}
        <View style={styles.resumenCard}>
          <View style={styles.resumenLeft}>
            <Text style={styles.resumenNumero}>{promedio}</Text>
            <View style={styles.estrellasRow}>{estrellas(Math.round(Number(promedio)), 18)}</View>
            <Text style={styles.resumenSub}>{opiniones.length} opiniones</Text>
          </View>
          <View style={styles.resumenRight}>
            {[5, 4, 3, 2, 1].map((p) => {
              const cantidad = opiniones.filter(o => o.puntuacion === p).length;
              const porcentaje = (cantidad / opiniones.length) * 100;
              return (
                <View key={p} style={styles.barraRow}>
                  <Text style={styles.barraLabel}>{p}</Text>
                  <Ionicons name="star" size={10} color="#EEBA2B" />
                  <View style={styles.barraFondo}>
                    <View style={[styles.barraRelleno, { width: `${porcentaje}%`, backgroundColor: colorPuntuacion(p) }]} />
                  </View>
                  <Text style={styles.barraCantidad}>{cantidad}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* grafica puntuaciones */}
        <Text style={styles.seccion}>Distribución de puntuaciones</Text>
        <View style={styles.graficaCard}>
          <PieChart
            data={puntuacionData}
            width={Math.min(width, 500) - 40}
            height={180}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>

        {/* alerta */}
        <View style={styles.alertaCard}>
          <Ionicons name="warning-outline" size={16} color="#ff4444" />
          <Text style={styles.alertaText}>
            {opiniones.filter(o => o.puntuacion <= 2).length} opiniones con puntuación baja — requieren atención
          </Text>
        </View>

        {/* listado */}
        <Text style={styles.seccion}>Opiniones por prioridad</Text>
        {ordenadas.map((op) => (
          <View key={op.id} style={[styles.opinionCard, op.puntuacion <= 2 && styles.opinionCardAlerta]}>
            <View style={styles.opinionTop}>
              <View style={[styles.puntuacionCirculo, { backgroundColor: colorPuntuacion(op.puntuacion) + '22', borderColor: colorPuntuacion(op.puntuacion) + '55' }]}>
                <Text style={[styles.puntuacionNumero, { color: colorPuntuacion(op.puntuacion) }]}>{op.puntuacion}</Text>
              </View>
              <View style={styles.opinionInfo}>
                <Text style={styles.opinionCliente}>{op.cliente}</Text>
                <Text style={styles.opinionPaquete}>{op.paquete} — {op.fecha}</Text>
                <View style={styles.estrellasRow}>{estrellas(op.puntuacion)}</View>
              </View>
              {op.puntuacion <= 2 && (
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>Urgente</Text>
                </View>
              )}
            </View>
            <Text style={styles.opinionComentario}>"{op.comentario}"</Text>
            <View style={styles.opinionFooter}>
              <Ionicons name="person-outline" size={12} color="#8899aa" />
              <Text style={styles.opinionLavador}>Lavador: {op.lavador}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1F33' },
  inner: { padding: 20, maxWidth: 500, width: width > 500 ? 500 : '100%', alignSelf: 'center', paddingBottom: 48 },
  titulo: { fontSize: 20, fontWeight: '700', color: '#F5F7FA' },
  subtitulo: { fontSize: 12, color: '#8899aa', marginTop: 2, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#C9A24D', marginBottom: 22, opacity: 0.4 },
  resumenCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 16, marginBottom: 24, flexDirection: 'row', gap: 16, borderWidth: 0.5, borderColor: '#C9A24D33' },
  resumenLeft: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  resumenNumero: { fontSize: 36, fontWeight: '700', color: '#F5F7FA' },
  resumenSub: { fontSize: 10, color: '#8899aa', textAlign: 'center' },
  resumenRight: { flex: 1, gap: 6, justifyContent: 'center' },
  barraRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  barraLabel: { fontSize: 11, color: '#F5F7FA', width: 10 },
  barraFondo: { flex: 1, height: 6, backgroundColor: '#ffffff15', borderRadius: 3 },
  barraRelleno: { height: 6, borderRadius: 3 },
  barraCantidad: { fontSize: 11, color: '#8899aa', width: 14, textAlign: 'right' },
  estrellasRow: { flexDirection: 'row', gap: 2 },
  graficaCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 10, marginBottom: 24, borderWidth: 0.5, borderColor: '#C9A24D33', alignItems: 'center' },
  alertaCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ff444411', borderRadius: 10, padding: 12, marginBottom: 20, borderWidth: 0.5, borderColor: '#ff444433' },
  alertaText: { fontSize: 12, color: '#ff4444', flex: 1 },
  seccion: { fontSize: 13, fontWeight: '600', color: '#F5F7FA', marginBottom: 12 },
  opinionCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: '#C9A24D22' },
  opinionCardAlerta: { borderColor: '#ff444444', backgroundColor: '#1a1a2e' },
  opinionTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  puntuacionCirculo: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  puntuacionNumero: { fontSize: 16, fontWeight: '700' },
  opinionInfo: { flex: 1 },
  opinionCliente: { fontSize: 13, fontWeight: '600', color: '#F5F7FA' },
  opinionPaquete: { fontSize: 11, color: '#C9A24D', marginTop: 1, marginBottom: 3 },
  priorityBadge: { backgroundColor: '#ff444422', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 0.5, borderColor: '#ff444455' },
  priorityText: { fontSize: 10, color: '#ff4444', fontWeight: '600' },
  opinionComentario: { fontSize: 12, color: '#8899aa', fontStyle: 'italic', marginBottom: 10 },
  opinionFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  opinionLavador: { fontSize: 11, color: '#8899aa' },
});