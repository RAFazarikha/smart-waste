import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { CAT_META, COLORS, STATUS_META } from './lib/ui';

export const Button = ({ title, onPress, loading, variant = 'primary', disabled }: { title: string; onPress: () => void; loading?: boolean; variant?: 'primary' | 'outline'; disabled?: boolean }) => (
  <Pressable accessibilityRole="button" onPress={onPress} disabled={loading || disabled}
    style={({ pressed }) => [s.btn, variant === 'outline' && s.btnOutline, (pressed || loading || disabled) && { opacity: 0.6 }]}>
    {loading ? <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#fff'} /> : <Text style={[s.btnText, variant === 'outline' && { color: COLORS.primary }]}>{title}</Text>}
  </Pressable>
);

export const Field = ({ label, ...p }: TextInputProps & { label: string }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor="#94a3b8" style={s.input} autoCapitalize="none" {...p} />
  </View>
);

export const ErrorText = ({ msg }: { msg?: string }) => msg ? <Text accessibilityRole="alert" style={{ color: COLORS.danger, marginBottom: 10 }}>{msg}</Text> : null;

export const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? { label: status, color: COLORS.muted, bg: '#f1f5f9' };
  return <Text style={[s.badge, { color: m.color, backgroundColor: m.bg }]}>{m.label}</Text>;
};
export const CatBadge = ({ category }: { category: string }) => {
  const m = CAT_META[category] ?? { label: category, color: COLORS.muted };
  return <Text style={[s.badge, { color: m.color, backgroundColor: m.color + '22' }]}>{m.label}</Text>;
};

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  pad: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  muted: { color: COLORS.muted, fontSize: 13 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, backgroundColor: '#fff', color: COLORS.text },
  btn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center', minHeight: 46, justifyContent: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  badge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
