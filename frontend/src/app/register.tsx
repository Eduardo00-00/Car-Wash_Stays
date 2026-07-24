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

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [edad, setEdad] = useState('');
  const [genero, setGenero] = useState('');
  const [recuperacion, setRecuperacion] = useState('');
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  const handleRegistrar = () => {
    if (!nombre || !email || !password || !edad || !genero || !recuperacion) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }
    Alert.alert('¡Listo!', 'Cuenta creada correctamente', [
      { text: 'Iniciar sesión', onPress: () => router.replace('/' as any) },
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

          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: colors.header }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.textoHeader} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.titulo, { color: colors.texto }]}>Crear cuenta</Text>
              <Text style={[styles.subtitulo, { color: colors.textoSub }]}>Llena tus datos para registrarte</Text>
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

          <Text style={[styles.label, { color: colors.dorado }]}>Nombre completo</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="person-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="tu nombre completo"
              placeholderTextColor={colors.textoSub}
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <Text style={[styles.label, { color: colors.dorado }]}>Correo electrónico</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="mail-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.textoSub}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[styles.label, { color: colors.dorado }]}>Contraseña</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="mínimo 6 caracteres"
              placeholderTextColor={colors.textoSub}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={colors.dorado}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: colors.dorado }]}>Edad</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="calendar-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="tu edad"
              placeholderTextColor={colors.textoSub}
              value={edad}
              onChangeText={setEdad}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <Text style={[styles.label, { color: colors.dorado }]}>Género</Text>
          <View style={styles.botonesGenero}>
            {['Masculino', 'Femenino', 'Otro'].map((op) => (
              <TouchableOpacity
                key={op}
                style={[
                  styles.btnGenero,
                  { borderColor: colors.borde, backgroundColor: colors.inputFondo },
                  genero === op && { backgroundColor: colors.header, borderColor: colors.header },
                ]}
                onPress={() => setGenero(op)}
                accessibilityRole="radio"
              >
                <Text style={[
                  styles.btnGeneroText,
                  { color: colors.texto },
                  genero === op && { color: colors.textoHeader },
                ]}>
                  {op}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.dorado }]}>Teléfono o correo de recuperación</Text>
          <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.dorado} />
            <TextInput
              style={[styles.input, { color: colors.texto }]}
              placeholder="teléfono o correo alternativo"
              placeholderTextColor={colors.textoSub}
              value={recuperacion}
              onChangeText={setRecuperacion}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.btnRegistrar, { backgroundColor: colors.header }]}
            onPress={handleRegistrar}
            accessibilityRole="button"
          >
            <Text style={[styles.btnRegistrarText, { color: colors.textoHeader }]}>Crear cuenta</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: colors.textoSub }]}>¿ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.loginLink, { color: colors.dorado }]}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginBottom: 22,
    opacity: 0.5,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.4,
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
  botonesGenero: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  btnGenero: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnGeneroText: {
    fontSize: 12,
    fontWeight: '500',
  },
  btnRegistrar: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  btnRegistrarText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 12,
  },
  loginLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});