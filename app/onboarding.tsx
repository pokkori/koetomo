import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { setOnboardingDoneAsync } from '../lib/streak';
import MicSVG from '../components/svg/MicSVG';
import HeartSVG from '../components/svg/HeartSVG';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icon: <MicSVG size={64} color={Colors.primaryLight} />,
    title: '声で話しかけるだけ',
    description: 'マイクボタンをタップして、その日の気持ちや出来事を声で話しかけてください。タイピング不要です。',
  },
  {
    id: 2,
    icon: <HeartSVG size={64} color="#FBBF24" />,
    title: 'AIが相づちを打ちながら聴く',
    description: 'コエトモがあなたの話を温かく聴き、共感しながら相づちを打ちます。批判もアドバイスもしません。',
  },
  {
    id: 3,
    icon: <MicSVG size={64} color={Colors.emotion.calm} />,
    title: '自動で日記に変換',
    description: '話し終わると、AIが自動で日記テキストに整理。感情グラフで「今日の自分」を可視化します。',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * next, animated: true });
      setCurrentIndex(next);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await setOnboardingDoneAsync();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* スキップボタン（常に右上に表示） */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleFinish}
        accessibilityRole="button"
        accessibilityLabel="オンボーディングをスキップする"
      >
        <Text style={styles.skipText}>スキップ</Text>
      </TouchableOpacity>

      {/* スライドコンテンツ */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        accessibilityRole="scrollbar"
        accessibilityLabel={`オンボーディング ${currentIndex + 1} / ${SLIDES.length}`}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: SCREEN_WIDTH }]}>
            <View
              style={styles.iconContainer}
              accessibilityElementsHidden
            >
              {slide.icon}
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ページインジケーター */}
      <View style={styles.dotsRow} accessible={false}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* 次へ / 始めるボタン */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={goNext}
        accessibilityRole="button"
        accessibilityLabel={currentIndex < SLIDES.length - 1 ? '次のページへ' : 'コエトモを始める'}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex < SLIDES.length - 1 ? '次へ' : '始める'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingBottom: 48,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: 15,
  },
  scrollView: {
    flex: 1,
    marginTop: 80,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  nextButton: {
    width: SCREEN_WIDTH - 48,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
