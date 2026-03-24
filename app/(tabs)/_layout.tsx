import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';
import MicSVG from '../../components/svg/MicSVG';
import HeartSVG from '../../components/svg/HeartSVG';
import React from 'react';
import Svg, { Rect, Line } from 'react-native-svg';
import { View } from 'react-native';

function BookSVG({ color }: { color: string }) {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8" />
      <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="8" y1="16" x2="12" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

function UserSVG({ color }: { color: string }) {
  return (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <View style={{ alignItems: 'center' }}>
        <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <Rect x="6" y="3" width="12" height="12" rx="6" stroke={color} strokeWidth="1.8" />
          <Line x1="2" y1="21" x2="22" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      </View>
    </Svg>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        tabBarStyle: {
          backgroundColor: '#252238',
          borderTopColor: Colors.glassCardBorder,
          paddingBottom: 8,
          paddingTop: 4,
          height: 64,
        },
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          headerShown: false,
          tabBarIcon: ({ color }) => <MicSVG size={22} color={color} />,
          tabBarAccessibilityLabel: 'ホーム画面',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '日記',
          headerTitle: '声日記アーカイブ',
          tabBarIcon: ({ color }) => <BookSVG color={color} />,
          tabBarAccessibilityLabel: '日記一覧',
        }}
      />
      <Tabs.Screen
        name="emotion"
        options={{
          title: '感情',
          headerTitle: '感情グラフ',
          tabBarIcon: ({ color }) => <HeartSVG size={22} color={color} />,
          tabBarAccessibilityLabel: '感情グラフ',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'プロフィール',
          headerTitle: 'プロフィール',
          tabBarIcon: ({ color }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Rect x="7" y="3" width="10" height="10" rx="5" stroke={color} strokeWidth="1.8" />
              <Rect x="3" y="17" width="18" height="6" rx="3" stroke={color} strokeWidth="1.8" />
            </Svg>
          ),
          tabBarAccessibilityLabel: 'プロフィールと設定',
        }}
      />
    </Tabs>
  );
}
