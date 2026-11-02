import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../auth';
import { COLORS } from '../lib/ui';
import { Button, s } from '../components';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={[s.screen, s.pad]}>
      <View style={[s.card, { alignItems: 'center', paddingVertical: 24 }]}>
        <View accessibilityElementsHidden style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: '700' }}>{user?.name?.[0]?.toUpperCase()}</Text>
        </View>
        <Text style={s.h1}>{user?.name}</Text>
        <Text style={s.muted}>{user?.email}</Text>
        <Text style={[s.muted, { textTransform: 'capitalize' }]}>Role: {user?.role}</Text>
      </View>
      <Button title="Keluar" onPress={logout} variant="outline" />
    </View>
  );
}
