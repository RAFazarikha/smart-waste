import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiFetch } from '../lib/api';
import { useAuth } from '../auth';
import { COLORS } from '../lib/ui';
import { CatBadge, ErrorText, StatusBadge, s } from '../components';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [st, rp] = await Promise.all([apiFetch('/stats'), apiFetch('/reports?limit=3')]);
      setStats(st); setRecent(rp.data); setErr('');
    } catch (e: any) { setErr(e.message); }
  }, []);
  // fokus ulang saat kembali dari form agar daftar langsung segar
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const active = stats ? stats.pending_count + stats.in_progress_count : 0;
  return (
    <View style={s.screen}>
      <ScrollView contentContainerStyle={[s.pad, { paddingBottom: insets.bottom + 88 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
        <View style={[s.card, { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
          <Text style={{ color: '#d1fae5', fontSize: 13 }}>Halo,</Text>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{user?.name}</Text>
          <Text style={{ color: '#fff', marginTop: 8 }}>{stats ? `${active} laporan sedang aktif` : 'Memuat...'}</Text>
        </View>
        <ErrorText msg={err} />
        {stats && (
          <View style={[s.row, { marginBottom: 12 }]}>
            {[['Total', stats.total_reports], ['Diproses', stats.in_progress_count], ['Selesai', stats.completed_count]].map(([l, v]) => (
              <View key={l as string} style={[s.card, { flex: 1, marginBottom: 0, alignItems: 'center' }]}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text }}>{v}</Text>
                <Text style={s.muted}>{l}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={[s.h2, { marginBottom: 8 }]}>Laporan Terbaru</Text>
        {!recent.length && !err && <Text style={s.muted}>Belum ada laporan. Tekan tombol + untuk membuat.</Text>}
        {recent.map((r) => (
          <Pressable key={r.id} accessibilityRole="button" onPress={() => navigation.navigate('Detail', { id: r.id })} style={s.card}>
            <Text style={s.h2}>{r.title}</Text>
            <View style={[s.row, { marginTop: 6 }]}><CatBadge category={r.category} /><StatusBadge status={r.status} /></View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="Laporkan sampah baru" onPress={() => navigation.navigate('NewReport')}
        style={{ position: 'absolute', right: 20, bottom: insets.bottom + 16, backgroundColor: COLORS.primary, borderRadius: 30, paddingHorizontal: 20, height: 56, justifyContent: 'center', elevation: 6 }}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>+ Laporkan Sampah</Text>
      </Pressable>
    </View>
  );
}
