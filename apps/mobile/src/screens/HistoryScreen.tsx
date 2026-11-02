import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiFetch } from '../lib/api';
import { Button, CardSkeleton, CatBadge, ErrorText, StatusBadge, s } from '../components';

export default function HistoryScreen({ navigation }: any) {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState({ n: 1, last: 1 });
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);

  const load = useCallback(async (n = 1, reset = true) => {
    if (!reset) setMore(true);
    try {
      const r = await apiFetch(`/reports?page=${n}&limit=10`);
      setRows((p) => (reset ? r.data : [...p, ...r.data])); setPage({ n, last: r.meta.totalPages }); setErr('');
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); setMore(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={s.screen}>
      {err ? (
        <View style={[s.pad, { alignItems: 'center', gap: 8 }]}>
          <ErrorText msg={err} />
          <Button title="Coba Lagi" onPress={() => load(1, true)} variant="outline" />
        </View>
      ) : null}
      <FlatList data={rows} keyExtractor={(r) => r.id} contentContainerStyle={s.pad}
        refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }}
        onEndReached={() => !more && page.n < page.last && load(page.n + 1, false)} onEndReachedThreshold={0.4}
        ListFooterComponent={more ? <ActivityIndicator style={{ marginVertical: 16 }} /> : undefined}
        ListEmptyComponent={loading ? <><CardSkeleton /><CardSkeleton /><CardSkeleton /></> : err ? undefined : <Text style={[s.muted, { textAlign: 'center', marginTop: 40 }]}>Belum ada laporan.</Text>}
        renderItem={({ item: r }) => (
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Detail', { id: r.id })} style={s.card}>
            <Text style={s.h2}>{r.title}</Text>
            <Text style={[s.muted, { marginVertical: 4 }]}>{new Date(r.createdAt).toLocaleDateString('id-ID')}</Text>
            <View style={s.row}><CatBadge category={r.category} /><StatusBadge status={r.status} /></View>
          </Pressable>
        )} />
    </View>
  );
}
