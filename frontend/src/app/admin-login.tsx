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
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function AdminLoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const handleIngresar = () => {
    if (!usuario || !password) {
      Alert.alert('Campos incompletos', 'Ingresa usuario y contraseña');
      return;
    }
    router.replace('/admin' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#0B1F33' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Regresar"
        >
          <Ionicons name="arrow-back" size={20} color="#F5F7FA" />
        </TouchableOpacity>

        <View style={styles.logoArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={36} color="#0B1F33" />
          </View>
          <Text style={styles.titulo}>Panel Administrativo</Text>
          <Text style={styles.subtitulo}>Elite Wash & Detailing</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Usuario</Text>
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={18} color="#C9A24D" />
          <TextInput
            style={styles.input}
            placeholder="usuario administrador"
            placeholderTextColor="#F5F7FA55"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            accessibilityLabel="Campo usuario administrador"
          />
        </View>

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color="#C9A24D" />
          <TextInput
            style={styles.input}
            placeholder="contraseña"
            placeholderTextColor="#F5F7FA55"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            accessibilityLabel="Campo contraseña administrador"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#C9A24D"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btnIngresar}
          onPress={handleIngresar}
          accessibilityRole="button"
        >
          <Text style={styles.btnIngresarText}>Ingresar al panel</Text>
        </TouchableOpacity>

        <View style={styles.notaArea}>
          <Ionicons name="information-circle-outline" size={14} color="#C9A24D" />
          <Text style={styles.notaText}>Acceso exclusivo para personal autorizado</Text>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    maxWidth: 500,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 0,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#16273F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoArea: { alignItems: 'center', marginBottom: 20 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#C9A24D',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  titulo: { fontSize: 18, fontWeight: '700', color: '#F5F7FA' },
  subtitulo: { fontSize: 12, color: '#C9A24D', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#C9A24D', marginBottom: 22, opacity: 0.4 },
  label: { fontSize: 12, color: '#C9A24D', marginBottom: 6, fontWeight: '600' },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#162C42', borderRadius: 10,
    borderWidth: 1, borderColor: '#C9A24D44',
    paddingHorizontal: 12, paddingVertical: 11,
    marginBottom: 14, gap: 8,
  },
  input: { flex: 1, fontSize: 13, color: '#F5F7FA' },
  btnIngresar: {
    backgroundColor: '#C9A24D', borderRadius: 10,
    paddingVertical: 13, alignItems: 'center', marginTop: 6,
  },
  btnIngresarText: { fontSize: 14, color: '#0B1F33', fontWeight: '700' },
  notaArea: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, marginTop: 20,
  },
  notaText: { fontSize: 11, color: '#F5F7FA88' },
});