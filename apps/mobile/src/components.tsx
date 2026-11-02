import React from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, ScrollViewProps, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { HeaderHeightContext } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CAT_META, COLORS, STATUS_META } from './lib/ui';

export const Button = ({ title, onPress, loading, variant = 'primary', disabled }: { title: string; onPress: () => void; loading?: boolean; variant?: 'primary' | 'outline'; disabled?: boolean }) => (
  <Pressable accessibilityRole="button" onPress={onPress} disabled={loading || disabled}
    style={({ pressed }) => [s.btn, variant === 'outline' && s.btnOutline, (pressed || loading || disabled) && { opacity: 0.6 }]}>
    {loading ? <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#fff'} /> : <Text style={[s.btnText, variant === 'outline' && { color: COLORS.primary }]}>{title}</Text>}
  </Pressable>
);

// ponytail: tipe minimal; @types/react ganda di monorepo membuat ComponentRef<TextInput> jadi never
export type InputRef = { focus(): void };
export const Field = ({ label, ...p }: TextInputProps & { label: string; ref?: React.RefObject<InputRef | null> }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput accessibilityLabel={label} placeholderTextColor="#94a3b8" style={[s.input, p.multiline && { minHeight: 96, textAlignVertical: 'top' }]} autoCapitalize="none" autoCorrect={false} returnKeyType={p.multiline ? 'default' : 'next'} {...(p as TextInputProps)} />
  </View>
);

// Edge-to-edge (SDK 58) mematikan adjustResize di Android: 'padding' di kedua platform.
export const KeyboardScroll = ({ contentContainerStyle, ...p }: ScrollViewProps) => {
  const { bottom } = useSafeAreaInsets();
  const header = React.useContext(HeaderHeightContext as React.Context<number | undefined>) ?? 0;
  return (
    <KeyboardAvoidingView style={s.screen} behavior="padding" keyboardVerticalOffset={header}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        contentContainerStyle={[s.pad, { paddingBottom: bottom + 24 }, contentContainerStyle]} {...p} />
    </KeyboardAvoidingView>
  );
};

export const ErrorText = ({ msg }: { msg?: string }) => msg ? <Text accessibilityRole="alert" style={{ color: COLORS.danger, marginBottom: 10 }}>{msg}</Text> : null;

export const StatusBadge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] ?? { label: status, color: COLORS.muted, bg: '#f1f5f9' };
  return <Text style={[s.badge, { color: m.color, backgroundColor: m.bg }]}>{m.label}</Text>;
};
export const CatBadge = ({ category }: { category: string }) => {
  const m = CAT_META[category] ?? { label: category, color: COLORS.muted, bg: '#f1f5f9' };
  return <Text style={[s.badge, { color: m.color, backgroundColor: m.bg }]}>{m.label}</Text>;
};

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  pad: { padding: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12 },
  h1: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  muted: { color: COLORS.muted, fontSize: 13 },
  label: { fontSize: 12, fontWeight: '600', color: '#475569', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, minHeight: 48, backgroundColor: '#fff', color: COLORS.text },
  btn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  badge: { fontSize: 11, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

// Skeleton: kotak abu berdenyut (native driver, tanpa dependensi baru)
export const Skeleton = ({ height = 16, width = '100%', style }: { height?: number; width?: number | `${number}%`; style?: object }) => {
  const o = React.useRef(new Animated.Value(0.4)).current;
  React.useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0.4, duration: 700, useNativeDriver: true })]));
    a.start(); return () => a.stop();
  }, [o]);
  return <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[{ height, width, borderRadius: 8, backgroundColor: '#e2e8f0', opacity: o }, style]} />;
};
export const CardSkeleton = () => (
  <View style={s.card}><Skeleton height={18} width="70%" /><Skeleton height={12} width="35%" style={{ marginVertical: 8 }} /><Skeleton height={16} width="50%" /></View>
);
