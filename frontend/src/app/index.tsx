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
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        {/* botón de tema arriba a la derecha */}
        <TouchableOpacity
          style={styles.themeBtn}
          onPress={toggleTheme}
          accessibilityLabel={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
          <Ionicons
            name={theme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={22}
            color={colors.dorado}
          />
        </TouchableOpacity>

        <View style={styles.logoArea}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.dorado }]} />

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
            accessibilityLabel="Campo de correo electrónico"
          />
        </View>

        <Text style={[styles.label, { color: colors.dorado }]}>Contraseña</Text>
        <View style={[styles.inputBox, { backgroundColor: colors.inputFondo, borderColor: colors.borde }]}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.dorado} />
          <TextInput
            style={[styles.input, { color: colors.texto }]}
            placeholder="tu contraseña"
            placeholderTextColor={colors.textoSub}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            accessibilityLabel="Campo de contraseña"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.dorado}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={[styles.forgot, { color: colors.dorado }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

       <TouchableOpacity
  style={[styles.btnLogin, { backgroundColor: colors.header }]}
  onPress={() => {
    if (email === 'admin@elitewash.com' && password === 'admin123') {
      router.replace('/(admin)' as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  }}
  accessibilityRole="button"
>
          <Text style={[styles.btnLoginText, { color: colors.textoHeader }]}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textoSub }]}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <Text style={[styles.registerLink, { color: colors.dorado }]}>Regístrate</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    maxWidth: 500,
    width: width > 500 ? 500 : '100%',
    alignSelf: 'center',
  },
  themeBtn: {
    position: 'absolute',
    top: 16,
    right: 0,
    padding: 8,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 130,
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
  forgot: {
    fontSize: 11,
    marginBottom: 20,
    textAlign: 'right',
  },
  btnLogin: {
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 14,
  },
  btnLoginText: {
    fontSize: 14,
    fontWeight: '600',
  },
  oText: {
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 12,
  },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 24,
  },
  btnGoogleText: {
    fontSize: 13,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 12,
  },
  registerLink: {
    fontSize: 12,
    fontWeight: '700',
  },
});