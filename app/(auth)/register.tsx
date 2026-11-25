import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../services/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const msg = 'Mohon lengkapi Nama, Email, dan Kata Sandi.';
      setErrorMessage(msg);
      showAlert('Data Belum Lengkap', msg);
      return;
    }

    if (cleanPassword.length < 6) {
      const msg = 'Kata sandi minimal 6 karakter.';
      setErrorMessage(msg);
      showAlert('Kata Sandi Lemah', msg);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Sign Up dengan metadata pengguna (Modul 3 & 4)
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone || '-',
            role: 'customer',
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        showAlert('Pendaftaran Gagal', error.message);
      } else {
        showAlert(
          'Pendaftaran Berhasil! 🎉',
          'Akun Anda telah terdaftar. Silakan masuk untuk mulai memesan tukang.'
        );
        router.replace('/(auth)/login');
      }
    } catch (err: any) {
      const msg = 'Terjadi kesalahan sistem saat mendaftar.';
      setErrorMessage(msg);
      showAlert('Kesalahan Koneksi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.cardWrapper}>

          {/* BACK TO LOGIN BUTTON */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* BRANDING HEADER */}
          <View style={styles.header}>
            <View style={[styles.logoCircle, { backgroundColor: colors.serviceBg }]}>
              <Ionicons name="person-add" size={32} color={colors.accent} />
            </View>
            <Text style={[styles.appTitle, { color: colors.text }]}>Daftar Akun Baru</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Buat akun pelanggan untuk memesan jasa perbaikan rumah dengan cepat
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* ERROR BANNER */}
            {errorMessage && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* FULL NAME */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nama Lengkap</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.search }]}>
                <Ionicons name="person-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="e.g. Budi Pratama"
                  placeholderTextColor={colors.muted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* PHONE NUMBER */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nomor WhatsApp / HP</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.search }]}>
                <Ionicons name="call-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="08123456789"
                  placeholderTextColor={colors.muted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* EMAIL INPUT */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.search }]}>
                <Ionicons name="mail-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="contoh@email.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Kata Sandi</Text>
              <View style={[styles.inputContainer, { borderColor: colors.border, backgroundColor: colors.search }]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.muted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Minimal 6 karakter..."
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* REGISTER BUTTON */}
            <TouchableOpacity
              style={[styles.registerBtn, { backgroundColor: colors.accent }, loading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.registerBtnText}>Daftar Sekarang</Text>
              )}
            </TouchableOpacity>

            {/* LOGIN LINK */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: colors.muted }]}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={[styles.linkText, { color: colors.accent }]}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  cardWrapper: {
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 6,
    marginBottom: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  eyeButton: {
    padding: 4,
  },
  registerBtn: {
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
