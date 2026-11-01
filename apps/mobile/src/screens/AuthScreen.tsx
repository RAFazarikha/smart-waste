import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Button, ErrorText, Field, s } from '../components';
import { useAuth } from '../auth';
import { COLORS } from '../lib/ui';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthScreen() {
  const { auth } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const reg = mode === 'register';
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  const submit = async () => {
    // validasi sisi klien (server tetap memvalidasi ulang dengan Zod)
    if (!EMAIL.test(f.email)) return setErr('Format email tidak valid');
    if (f.password.length < 6) return setErr('Password minimal 6 karakter');
    if (reg && f.name.trim().length < 2) return setErr('Nama minimal 2 karakter');
    setErr(''); setLoading(true);
    try { await auth(mode, reg ? { name: f.name.trim(), email: f.email, password: f.password, phone: f.phone || undefined } : { email: f.email, password: f.password }); }
    catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[s.pad, { flexGrow: 1, justifyContent: 'center' }]} keyboardShouldPersistTaps="handled">
        <Text style={[s.h1, { textAlign: 'center', color: COLORS.primary, fontSize: 28 }]}>Smart Waste</Text>
        <Text style={[s.muted, { textAlign: 'center', marginBottom: 24 }]}>{reg ? 'Buat akun warga baru' : 'Masuk untuk melaporkan sampah'}</Text>
        <View style={s.card}>
          {reg && <Field label="Nama lengkap" value={f.name} onChangeText={set('name')} autoCapitalize="words" />}
          <Field label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" />
          {reg && <Field label="No. HP (opsional)" value={f.phone} onChangeText={set('phone')} keyboardType="phone-pad" />}
          <Field label="Password" value={f.password} onChangeText={set('password')} secureTextEntry />
          <ErrorText msg={err} />
          <Button title={reg ? 'Daftar' : 'Masuk'} onPress={submit} loading={loading} />
        </View>
        <Button variant="outline" title={reg ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'} onPress={() => { setMode(reg ? 'login' : 'register'); setErr(''); }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
