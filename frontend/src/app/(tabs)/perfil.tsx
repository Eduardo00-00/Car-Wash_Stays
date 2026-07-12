import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function PerfilScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('Carlos Mendoza');
  const [email, setEmail] = useState('carlos@correo.com');
  const [telefono, setTelefono] = useState('449 123 4567');
  const [edad, setEdad] = useState('28');
  const [genero, setGenero] = useState('Masculino');

  const handleGuardar = () => {
    if (!nombre || !email || !telefono || !edad) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }
    setEditando(false);
    Alert.alert('¡Listo!', 'Perfil actualizado correctamente');
  };

  const handleCerrarSesion = () => {
  Alert.alert('Cerrar sesión', '¿Estás seguro que quieres salir?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Salir', onPress: () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      } else {
        router.replace('/' as any);
      }
    }},
  ]);
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

        {/* encabezado */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.titulo, { color: colors.texto }]}>Mi perfil</Text>
            <Text style={[styles.subtitulo, { color: colors.textoSub }]}>
              {editando ? 'Editando información' : 'Tu información personal'}
            </Text>
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

        {/* avatar */}
        <View style={styles.avatarArea}>
          <View style={[styles.avatar, { backgroundColor: colors.header }]}>
            <Text style={[styles.avatarText, { color: colors.dorado }]}>CM</Text>
          </View>
          <Text style={[styles.avatarNombre, { color: colors.texto }]}>{nombre}</Text>
          <Text style={[styles.avatarEmail, { color: colors.textoSub }]}>{email}</Text>
        </View>

        {/* boton editar */}
        {!editando && (
          <TouchableOpacity
            style={[styles.btnEditar, { borderColor: colors.dorado }]}
            onPress={() => setEditando(true)}
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={18} color={colors.dorado} />
            <Text style={[styles.btnEditarText, { color: colors.dorado }]}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.seccionCard, { backgroundColor: colors.fondoCard, borderColor: colors.borde }]}>

          {/* nombre */}
          <View style={styles.campoRow}>
            <Ionicons name="person-outline" size={18} color={colors.dorado} />
            <View style={styles.campoInfo}>
              <Text style={[styles.campoLabel, { color: colors.textoSub }]}>Nombre</Text>
              {editando
                ? <TextInput
                    style={[styles.campoInput, { color: colors.texto, borderBottomColor: colors.borde }]}
                    value={nombre}
                    onChangeText={setNombre}
                    accessibilityLabel="Campo nombre"
                  />
                : <Text style={[styles.campoValor, { color: colors.texto }]}>{nombre}</Text>
              }
            </View>
          </View>

          <View style={[styles.separador, { backgroundColor: colors.borde }]} />

          {/* email */}
          <View style={styles.campoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.dorado} />
            <View style={styles.campoInfo}>
              <Text style={[styles.campoLabel, { color: colors.textoSub }]}>Correo</Text>
              {editando
                ? <TextInput
                    style={[styles.campoInput, { color: colors.texto, borderBottomColor: colors.borde }]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    accessibilityLabel="Campo correo"
                  />
                : <Text style={[styles.campoValor, { color: colors.texto }]}>{email}</Text>
              }
            </View>
          </View>

          <View style={[styles.separador, { backgroundColor: colors.borde }]} />

          {/* telefono */}
          <View style={styles.campoRow}>
            <Ionicons name="phone-portrait-outline" size={18} color={colors.dorado} />
            <View style={styles.campoInfo}>
              <Text style={[styles.campoLabel, { color: colors.textoSub }]}>Teléfono</Text>
              {editando
                ? <TextInput
                    style={[styles.campoInput, { color: colors.texto, borderBottomColor: colors.borde }]}
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                    accessibilityLabel="Campo teléfono"
                  />
                : <Text style={[styles.campoValor, { color: colors.texto }]}>{telefono}</Text>
              }
            </View>
          </View>

          <View style={[styles.separador, { backgroundColor: colors.borde }]} />

          {/* edad */}
          <View style={styles.campoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.dorado} />
            <View style={styles.campoInfo}>
              <Text style={[styles.campoLabel, { color: colors.textoSub }]}>Edad</Text>
              {editando
                ? <TextInput
                    style={[styles.campoInput, { color: colors.texto, borderBottomColor: colors.borde }]}
                    value={edad}
                    onChangeText={setEdad}
                    keyboardType="numeric"
                    maxLength={3}
                    accessibilityLabel="Campo edad"
                  />
                : <Text style={[styles.campoValor, { color: colors.texto }]}>{edad} años</Text>
              }
            </View>
          </View>

          <View style={[styles.separador, { backgroundColor: colors.borde }]} />

          {/* genero */}
          <View style={styles.campoRow}>
            <Ionicons name="people-outline" size={18} color={colors.dorado} />
            <View style={styles.campoInfo}>
              <Text style={[styles.campoLabel, { color: colors.textoSub }]}>Género</Text>
              {editando
                ? <View style={styles.generoBtns}>
                    {['Masculino', 'Femenino', 'Otro'].map((op) => (
                      <TouchableOpacity
                        key={op}
                        style={[
                          styles.generoBtn,
                          { borderColor: colors.borde, backgroundColor: colors.fondo },
                          genero === op && { backgroundColor: colors.header, borderColor: colors.header },
                        ]}
                        onPress={() => setGenero(op)}
                      >
                        <Text style={[
                          styles.generoBtnText,
                          { color: colors.texto },
                          genero === op && { color: colors.textoHeader },
                        ]}>
                          {op}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                : <Text style={[styles.campoValor, { color: colors.texto }]}>{genero}</Text>
              }
            </View>
          </View>

        </View>

        {/* botones edicion */}
        {editando && (
          <View style={styles.botonesEdicion}>
            <TouchableOpacity
              style={[styles.btnCancelar, { borderColor: colors.borde }]}
              onPress={() => setEditando(false)}
              accessibilityRole="button"
            >
              <Text style={[styles.btnCancelarText, { color: colors.textoSub }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnGuardar, { backgroundColor: colors.header }]}
              onPress={handleGuardar}
              accessibilityRole="button"
            >
              <Text style={[styles.btnGuardarText, { color: colors.textoHeader }]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* cerrar sesion */}
        {!editando && (
          <TouchableOpacity
            style={[styles.btnCerrarSesion, { borderColor: '#ff4444' }]}
            onPress={handleCerrarSesion}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
          >
            <Ionicons name="log-out-outline" size={18} color="#ff4444" />
            <Text style={styles.btnCerrarSesionText}>Cerrar sesión</Text>
          </TouchableOpacity>
        )}

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
  avatarArea: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: 'bold' },
  avatarNombre: { fontSize: 18, fontWeight: '600' },
  avatarEmail: { fontSize: 12, marginTop: 4 },
  btnEditar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10,
    paddingVertical: 10, marginBottom: 20,
  },
  btnEditarText: { fontSize: 13, fontWeight: '500' },
  seccionCard: {
    borderRadius: 12, borderWidth: 1,
    overflow: 'hidden', marginBottom: 20,
  },
  campoRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 14,
  },
  campoInfo: { flex: 1 },
  campoLabel: { fontSize: 11 },
  campoValor: { fontSize: 14, fontWeight: '500', marginTop: 2 },
  campoInput: {
    fontSize: 14, fontWeight: '500',
    marginTop: 2, borderBottomWidth: 1,
    paddingBottom: 4,
  },
  separador: { height: 1, marginLeft: 44 },
  generoBtns: { flexDirection: 'row', gap: 8, marginTop: 6 },
  generoBtn: {
    flex: 1, borderWidth: 1, borderRadius: 8,
    paddingVertical: 6, alignItems: 'center',
  },
  generoBtnText: { fontSize: 11, fontWeight: '500' },
  botonesEdicion: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  btnCancelar: {
    flex: 1, borderWidth: 1, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  btnCancelarText: { fontSize: 13, fontWeight: '500' },
  btnGuardar: {
    flex: 1, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  btnGuardarText: { fontSize: 13, fontWeight: '600' },
  btnCerrarSesion: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1, borderRadius: 10,
    paddingVertical: 12,
  },
  btnCerrarSesionText: { fontSize: 13, fontWeight: '500', color: '#ff4444' },
});