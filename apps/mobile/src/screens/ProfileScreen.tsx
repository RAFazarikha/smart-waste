import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../auth';
import { Button, s } from '../components';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={[s.screen, s.pad]}>
      <View style={s.card}>
        <Text style={s.h1}>{user?.name}</Text>
        <Text style={s.muted}>{user?.email}</Text>
        <Text style={[s.muted, { textTransform: 'capitalize' }]}>Role: {user?.role}</Text>
      </View>
      <Button title="Keluar" onPress={logout} variant="outline" />
    </View>
  );
}
