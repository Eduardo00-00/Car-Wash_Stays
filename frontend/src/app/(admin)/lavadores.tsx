import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const lavadoresIniciales = [
  { id: 1, nombre: 'Hector Medina',     telefono: '449 111 2233', correo: 'hector@elitewash.com',    edad: '28', disponible: true  },
  { id: 2, nombre: 'Sebastian Sanchez', telefono: '449 444 5566', correo: 'sebastian@elitewash.com', edad: '24', disponible: false },
];

const chartConfig = {
  backgroundColor: '#162C42',
  backgroundGradientFrom: '#162C42',
  backgroundGradientTo: '#162C42',
  color: (opacity = 1) => `rgba(201, 162, 77, ${opacity})`,
};

export default function LavadoresScreen() {
  const [lavadores, setLavadores] = useState(lavadoresIniciales);
  const [agregando, setAgregando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');

  const handleAgregar = () => {
    if (!nombre || !telefono || !correo || !edad) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }
    setLavadores([...lavadores, { id: lavadores.length + 1, nombre, telefono, correo, edad, disponible: true }]);
    setNombre(''); setTelefono(''); setCorreo(''); setEdad('');
    setAgregando(false);
    Alert.alert('¡Listo!', 'Lavador registrado correctamente');
  };

  const toggleDisponible = (id: number) => {
    setLavadores(lavadores.map(l => l.id === id ? { ...l, disponible: !l.disponible } : l));
  };

  const handleEliminar = (id: number) => {
    Alert.alert('Eliminar lavador', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setLavadores(lavadores.filter(l => l.id !== id)) },
    ]);
  };

  const disponibilidadData = [
    { name: 'Disponible', population: lavadores.filter(l => l.disponible).length,  color: '#4CAF50', legendFontColor: '#F5F7FA', legendFontSize: 12 },
    { name: 'Ocupado',    population: lavadores.filter(l => !l.disponible).length, color: '#ff4444', legendFontColor: '#F5F7FA', legendFontSize: 12 },
  ].filter(d => d.population > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.titulo}>Lavadores</Text>
            <Text style={styles.subtitulo}>{lavadores.length} registrados — {lavadores.filter(l => l.disponible).length} disponibles</Text>
          </View>
          <TouchableOpacity style={styles.btnAdd} onPress={() => setAgregando(!agregando)}>
            <Ionicons name={agregando ? 'close-outline' : 'add-outline'} size={22} color="#0B1F33" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* formulario */}
        {agregando && (
          <View style={styles.formCard}>
            <Text style={styles.formTitulo}>Nuevo lavador</Text>
            <Text style={styles.label}>Nombre completo</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={16} color="#C9A24D" />
              <TextInput style={styles.input} placeholder="nombre del lavador" placeholderTextColor="#ffffff44" value={nombre} onChangeText={setNombre} />
            </View>
            <Text style={styles.label}>Teléfono</Text>
            <View style={styles.inputBox}>
              <Ionicons name="phone-portrait-outline" size={16} color="#C9A24D" />
              <TextInput style={styles.input} placeholder="449 000 0000" placeholderTextColor="#ffffff44" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
            </View>
            <Text style={styles.label}>Correo</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={16} color="#C9A24D" />
              <TextInput style={styles.input} placeholder="correo@ejemplo.com" placeholderTextColor="#ffffff44" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <Text style={styles.label}>Edad</Text>
            <View style={styles.inputBox}>
              <Ionicons name="calendar-outline" size={16} color="#C9A24D" />
              <TextInput style={styles.input} placeholder="edad" placeholderTextColor="#ffffff44" value={edad} onChangeText={setEdad} keyboardType="numeric" maxLength={2} />
            </View>
            <TouchableOpacity style={styles.btnGuardar} onPress={handleAgregar}>
              <Text style={styles.btnGuardarText}>Registrar lavador</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* grafica disponibilidad */}
        <Text style={styles.seccion}>Disponibilidad del equipo</Text>
        {disponibilidadData.length > 0 && (
          <View style={styles.graficaCard}>
            <PieChart
              data={disponibilidadData}
              width={Math.min(width, 500) - 40}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="10"
            />
          </View>
        )}

        {/* listado */}
        <Text style={styles.seccion}>Personal registrado</Text>
        {lavadores.map((lav) => (
          <View key={lav.id} style={styles.lavadorCard}>
            <View style={styles.lavadorTop}>
              <View style={styles.lavadorIconBox}>
                <Ionicons name="person-outline" size={20} color="#C9A24D" />
              </View>
              <View style={styles.lavadorInfo}>
                <Text style={styles.lavadorNombre}>{lav.nombre}</Text>
                <Text style={styles.lavadorEdad}>{lav.edad} años</Text>
              </View>
              <View style={styles.lavadorActions}>
                <TouchableOpacity
                  onPress={() => toggleDisponible(lav.id)}
                  style={[styles.disponibleBtn, { backgroundColor: lav.disponible ? '#4CAF5022' : '#ff444422' }]}
                >
                  <View style={[styles.dot, { backgroundColor: lav.disponible ? '#4CAF50' : '#ff4444' }]} />
                  <Text style={[styles.disponibleText, { color: lav.disponible ? '#4CAF50' : '#ff4444' }]}>
                    {lav.disponible ? 'Disponible' : 'Ocupado'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleEliminar(lav.id)}>
                  <Ionicons name="trash-outline" size={18} color="#ff444488" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.lavadorDetalle}>
              <View style={styles.detalleRow}>
                <Ionicons name="phone-portrait-outline" size={13} color="#8899aa" />
                <Text style={styles.detalleText}>{lav.telefono}</Text>
              </View>
              <View style={styles.detalleRow}>
                <Ionicons name="mail-outline" size={13} color="#8899aa" />
                <Text style={styles.detalleText}>{lav.correo}</Text>
              </View>
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
  btnGuardar: { backgroundColor: '#C9A24D', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  btnGuardarText: { fontSize: 13, fontWeight: '700', color: '#0B1F33' },
  seccion: { fontSize: 13, fontWeight: '600', color: '#F5F7FA', marginBottom: 12 },
  graficaCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 10, marginBottom: 24, borderWidth: 0.5, borderColor: '#C9A24D33', alignItems: 'center' },
  lavadorCard: { backgroundColor: '#162C42', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: '#C9A24D22' },
  lavadorTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  lavadorIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#C9A24D22', alignItems: 'center', justifyContent: 'center' },
  lavadorInfo: { flex: 1 },
  lavadorNombre: { fontSize: 14, fontWeight: '600', color: '#F5F7FA' },
  lavadorEdad: { fontSize: 11, color: '#8899aa', marginTop: 1 },
  lavadorActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  disponibleBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  disponibleText: { fontSize: 11, fontWeight: '500' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  lavadorDetalle: { gap: 4, paddingLeft: 50 },
  detalleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detalleText: { fontSize: 11, color: '#8899aa' },
});