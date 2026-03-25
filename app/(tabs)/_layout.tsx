import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons'

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: false,
      tabBarButton: HapticTab,
    }}>
      <Tabs.Screen
        name='main'
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
        />
      <Tabs.Screen
        name='earnings'
        options={{
          title: "Ganancias",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='dollar' color={color} />
        }}
      />
      <Tabs.Screen
        name='subscriptions'
        options={{
          title: "Suscripciones",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='credit-card' color={color} />
        }}
      />
      <Tabs.Screen
        name='pieChart'
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='circle-o' color={color}/>
        }}
      />
    </Tabs>
  );
}
