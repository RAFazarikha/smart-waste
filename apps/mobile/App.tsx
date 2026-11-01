import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/auth';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewReportScreen from './src/screens/NewReportScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import DetailScreen from './src/screens/DetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { COLORS } from './src/lib/ui';

const Stack = createNativeStackNavigator();
const opts = { headerStyle: { backgroundColor: COLORS.primary }, headerTintColor: '#fff' };

function Root() {
  const { user, ready } = useAuth();
  if (!ready) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={opts}>
        {!user ? <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} /> : (<>
          <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({ title: 'Smart Waste',
            headerRight: () => (<View style={{ flexDirection: 'row', gap: 16 }}>
              {[['Riwayat', 'History'], ['Profil', 'Profile']].map(([l, r]) => (
                <Pressable key={r} accessibilityRole="button" hitSlop={12} style={{ minHeight: 44, justifyContent: 'center' }} onPress={() => navigation.navigate(r)}><Text style={{ color: '#fff', fontWeight: '600' }}>{l}</Text></Pressable>))}
            </View>) })} />
          <Stack.Screen name="NewReport" component={NewReportScreen} options={{ title: 'Laporkan Sampah' }} />
          <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Riwayat Laporan' }} />
          <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail Laporan' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
        </>)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <AuthProvider><StatusBar style="light" /><Root /></AuthProvider>;
}
