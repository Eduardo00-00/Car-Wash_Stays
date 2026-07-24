import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const tiposVehiculo = ['Carro chico', 'Carro grande', 'Moto', 'Camioneta'];

export default function CarRegisterScreen() {
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [color, setColor] = useState('');
  const [placas, setPlacas] = useState('');
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  const handleRegistrar = () => {
    if (!tipo || !marca || !modelo || !anio || !color || !placas) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }
    Alert.alert('¡Listo!', 'Vehículo registrado correctamente', [
      { text: 'Aceptar', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

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
              <Text style={[styles.titulo, { color: colors.texto }]}>Registrar vehículo</Text>
              <Text style={[styles.subtitulo, { color: colors.textoSub }]}>Agrega los datos de tu auto</Text>
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

          {/* tipo de vehiculo */}
          <Text style={[styles.label, { color: colors.dorado }]}>Tipo de vehículo</Text>
          <View style={styles.tiposGrid}>
            {tiposVehiculo.map((op) => (
              <TouchableOpacity
                key={op}
                style={[
                  styles.tipoBtn,
                  { borderColor: colors.borde, backgroundColor: colors.inputFondo },
                  tipo === op && { backgroundColor: colors.header, borderColor: colors.header },
                ]}
                onPress={() => setTipo(op)}
                accessibilityRole="radio"
                accessibilityLabel={`Tipo de vehículo ${op}`}
              >
                <Ionicons
                  name={
                    op === 'Carro' ? 'car-outline' :
                    op === 'Camioneta' ? 'car-sport-outline' :
                    op === 'Moto' ? 'bicycle-outline' :
                    'bus-outline'
                  }
                  size={22}
                  color={tipo === op ? colors.dorado : colors.textoSub}
                />
                <Text style={[
                  styles.tipoBtnText,
                  { color: colors.texto },
                  tipo === op && { color: colors.textoHeader },
                ]}>
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* marca */}
          <Text style={[styles.label, { color: colors.dorado }]}>Marca</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="business-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="ej. Honda, Toyota, Ford"
              placeholderTextColor={colors.textoSub}
              value={marca}
              onChangeText={setMarca}
              accessibilityLabel="Campo marca del vehículo"
            />
          </View>

          {/* modelo */}
          <Text style={[styles.label, { color: colors.dorado }]}>Modelo</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="car-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="ej. Civic, Corolla, F-150"
              placeholderTextColor={colors.textoSub}
              value={modelo}
              onChangeText={setModelo}
              accessibilityLabel="Campo modelo del vehículo"
            />
          </View>

          {/* año */}
          <Text style={[styles.label, { color: colors.dorado }]}>Año</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="calendar-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="ej. 2020"
              placeholderTextColor={colors.textoSub}
              value={anio}
              onChangeText={setAnio}
              keyboardType="numeric"
              maxLength={4}
              accessibilityLabel="Campo año del vehículo"
            />
          </View>

          {/* color */}
          <Text style={[styles.label, { color: colors.dorado }]}>Color</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="color-palette-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="ej. Blanco, Negro, Rojo"
              placeholderTextColor={colors.textoSub}
              value={color}
              onChangeText={setColor}
              accessibilityLabel="Campo color del vehículo"
            />
          </View>

          {/* placas */}
          <Text style={[styles.label, { color: colors.dorado }]}>Placas</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="id-card-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="ej. ABC-123"
              placeholderTextColor={colors.textoSub}
              value={placas}
              onChangeText={(text) => setPlacas(text.toUpperCase())}
              autoCapitalize="characters"
              maxLength={8}
              accessibilityLabel="Campo placas del vehículo"
            />
          </View>

          {/* boton registrar */}
          <TouchableOpacity
            style={[styles.btnRegistrar, { backgroundColor: colors.header }]}
            onPress={handleRegistrar}
            accessibilityRole="button"
            accessibilityLabel="Registrar vehículo"
          >
            <Text style={[styles.btnRegistrarText, { color: colors.textoHeader }]}>Registrar vehículo</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    gap: 14,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 20, fontWeight: 'bold' },
  subtitulo: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginBottom: 22, opacity: 0.5 },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  tipoBtn: {
    width: (width - 72) / 2,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  tipoBtnText: {
    fontSize: 12,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
  },
  btnRegistrar: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  btnRegistrarText: {
    fontSize: 14,
    fontWeight: '600',
  },
});