import React, { useRef, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { classifyImage, apiFetch, uploadImage } from '../lib/api';
import { InputRef, Button, ErrorText, Field, KeyboardScroll, s } from '../components';
import { CAT_META, COLORS } from '../lib/ui';

const CATS = ['organic', 'plastic', 'paper'] as const;

export default function NewReportScreen({ navigation }: any) {
  const [uri, setUri] = useState<string | null>(null);
  const [category, setCategory] = useState<(typeof CATS)[number] | null>(null);
  const [conf, setConf] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState<'' | 'ai' | 'gps' | 'send'>('');
  const [err, setErr] = useState('');
  const descRef = useRef<InputRef>(null);

  const detect = async (u: string) => {
    setBusy('ai'); setErr('');
    try {
      const r = await classifyImage(u);
      setCategory(r.prediction.category); setConf(r.prediction.confidence);
    } catch (e: any) {
      // AI gagal tidak boleh memblokir laporan: user tetap bisa pilih kategori manual
      setErr(`${e.message}. Pilih kategori secara manual.`);
    } finally { setBusy(''); }
  };

  const pick = async (camera: boolean) => {
    const perm = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return setErr('Izin kamera/galeri ditolak. Aktifkan di pengaturan.');
    const r = await (camera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (r.canceled) return;
    setUri(r.assets[0].uri); setCategory(null); setConf(null);
    detect(r.assets[0].uri);
  };

  const locate = async () => {
    setBusy('gps'); setErr('');
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) throw new Error('Izin lokasi ditolak');
      const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords(p.coords);
      try {
        const [a] = await Location.reverseGeocodeAsync(p.coords);
        setAddress([a?.street, a?.district, a?.city].filter(Boolean).join(', '));
      } catch { /* alamat opsional */ }
    } catch (e: any) { setErr(e.message); } finally { setBusy(''); }
  };

  const submit = async () => {
    if (!uri) return setErr('Foto wajib diisi');
    if (!category) return setErr('Pilih kategori sampah');
    if (!coords) return setErr('Ambil lokasi GPS dulu');
    if (title.trim().length < 3) return setErr('Judul minimal 3 karakter');
    if (desc.trim().length < 5) return setErr('Deskripsi minimal 5 karakter');
    setBusy('send'); setErr('');
    try {
      const image_url = await uploadImage(uri);
      await apiFetch('/reports', { method: 'POST', body: JSON.stringify({
        title: title.trim(), description: desc.trim(), category, image_url, address: address || undefined,
        latitude: coords.latitude, longitude: coords.longitude, ...(conf != null && { ai_confidence: conf }) }) });
      Alert.alert('Berhasil', 'Laporan terkirim.', [{ text: 'OK', onPress: () => navigation.replace('History') }]);
    } catch (e: any) { setErr(e.message); } finally { setBusy(''); }
  };

  return (
    <KeyboardScroll>
      <Text style={s.h2}>1. Foto sampah</Text>
      {uri && <Image source={{ uri }} accessibilityLabel="Foto sampah" style={{ width: '100%', height: 220, borderRadius: 12, marginVertical: 10, backgroundColor: '#e2e8f0' }} />}
      <View style={[s.row, { marginVertical: 8 }]}>
        <View style={{ flex: 1 }}><Button title="Kamera" onPress={() => pick(true)} variant="outline" /></View>
        <View style={{ flex: 1 }}><Button title="Galeri" onPress={() => pick(false)} variant="outline" /></View>
      </View>

      <Text style={[s.h2, { marginTop: 12 }]}>2. Kategori {busy === 'ai' && '(AI mendeteksi...)'}</Text>
      {conf != null && <Text style={[s.muted, { marginTop: 4 }]}>Deteksi AI: {CAT_META[category!]?.label} ({(conf * 100).toFixed(1)}%). Ubah jika salah.</Text>}
      {/* ponytail: ambang tetap 80%, model tidak punya kelas "bukan sampah" */}
      {conf != null && conf < 0.8 && (
        <Text accessibilityRole="alert" style={{ marginTop: 6, padding: 10, borderRadius: 8, backgroundColor: '#fef3c7', color: '#78350f', fontSize: 13 }}>
          Keyakinan AI rendah. Periksa kategori sebelum mengirim.
        </Text>
      )}
      <View style={[s.row, { marginVertical: 8 }]}>
        {CATS.map((c) => (
          <View key={c} style={{ flex: 1 }}><Button title={CAT_META[c].label} variant={category === c ? 'primary' : 'outline'} onPress={() => setCategory(c)} /></View>
        ))}
      </View>

      <Text style={[s.h2, { marginTop: 12 }]}>3. Lokasi</Text>
      <View style={{ marginVertical: 8 }}><Button title={coords ? 'Perbarui Lokasi' : 'Gunakan Lokasi Saat Ini'} onPress={locate} loading={busy === 'gps'} variant="outline" /></View>
      {coords && <Text style={[s.muted, { marginBottom: 8 }]}>{address || 'Alamat tidak tersedia'} ({coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)})</Text>}

      <Text style={[s.h2, { marginVertical: 8 }]}>4. Detail</Text>
      <Field label="Judul" value={title} onChangeText={setTitle} autoCapitalize="sentences" maxLength={100} onSubmitEditing={() => descRef.current?.focus()} />
      <Field ref={descRef} label="Deskripsi" value={desc} onChangeText={setDesc} multiline numberOfLines={3} autoCapitalize="sentences" />
      <ErrorText msg={err} />
      <Button title="Kirim Laporan" onPress={submit} loading={busy === 'send'} disabled={busy === 'ai'} />
    </KeyboardScroll>
  );
}
