import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { apiFetch } from '../lib/api';
import { CatBadge, ErrorText, StatusBadge, s } from '../components';

export default function DetailScreen({ route }: any) {
  const [r, setR] = useState<any>(null);
  const [err, setErr] = useState('');
  useFocusEffect(useCallback(() => {
    apiFetch(`/reports/${route.params.id}`).then((x) => setR(x.data)).catch((e) => setErr(e.message));
  }, [route.params.id]));

  if (!r) return <View style={[s.screen, s.pad]}><ErrorText msg={err} /><Text style={s.muted}>{err ? '' : 'Memuat...'}</Text></View>;
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad}>
      <Image source={{ uri: r.imageUrl }} accessibilityLabel={r.title} style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: '#e2e8f0' }} />
      <Text style={[s.h1, { marginTop: 12 }]}>{r.title}</Text>
      <View style={[s.row, { marginVertical: 8 }]}><CatBadge category={r.category} /><StatusBadge status={r.status} />
        {r.aiConfidence != null && <Text style={s.muted}>AI {(r.aiConfidence * 100).toFixed(1)}%</Text>}</View>
      <Text style={{ marginBottom: 8 }}>{r.description}</Text>
      <Text style={s.muted}>{r.address || `${r.latitude.toFixed(5)}, ${r.longitude.toFixed(5)}`}</Text>
      {r.adminNote && <View style={[s.card, { marginTop: 12, backgroundColor: '#f1f5f9' }]}><Text style={s.label}>Catatan admin</Text><Text>{r.adminNote}</Text></View>}
      <Text style={[s.h2, { marginTop: 16, marginBottom: 8 }]}>Riwayat Status</Text>
      {r.logs?.length ? r.logs.map((l: any) => (
        <View key={l.id} style={[s.card, { padding: 10 }]}>
          <Text style={{ fontWeight: '600' }}>{l.fromStatus} → {l.toStatus}</Text>
          <Text style={s.muted}>{new Date(l.createdAt).toLocaleString('id-ID')}{l.note ? ` · ${l.note}` : ''}</Text>
        </View>
      )) : <Text style={s.muted}>Belum ada perubahan status.</Text>}
    </ScrollView>
  );
}
