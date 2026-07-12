import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B1F33',
          borderTopColor: '#C9A24D33',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#C9A24D',
        tabBarInactiveTintColor: '#ffffff55',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cortes"
        options={{
          title: 'Cortes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lavadores"
        options={{
          title: 'Lavadores',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="retroalimentacion"
        options={{
          title: 'Opiniones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
  name="promociones"
  options={{
    title: 'Promociones',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="pricetag-outline" size={size} color={color} />
    ),
  }}
/>
    </Tabs>
  );
}