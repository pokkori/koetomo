/**
 * VFX共通コンポーネント
 *
 * 全18本のExpo/React Nativeスマホアプリで使用可能。
 * Reanimated v4専用。旧Animated API / Easing.linear 使用禁止。
 *
 * コンポーネント一覧:
 *   ScreenShake        - 画面シェイク（light/medium/heavy）
 *   FlashOverlay       - 全画面フラッシュ（white/red/gold）
 *   HitStop            - ヒットストップ（フリーズフレーム）
 *   ParticleSystem     - コンボパーティクル（4段階: 10/20/40個）
 *   ScorePopup         - スコアポップアップ（浮き上がり+フェードアウト）
 *   Confetti           - 紙吹雪（リザルト/新記録/花火3連）
 *   BackgroundParticles- 背景浮遊パーティクル（タイトル/メニュー）
 *   StaggerFadeIn      - staggerフェードイン（タイトル/リザルト）
 *   GlowPulseButton    - グロー付パルスボタン（タイトル）
 *   ScoreCountUp       - スコアカウントアップ（リザルト）
 */

export { ScreenShake } from './ScreenShake';
export { FlashOverlay } from './FlashOverlay';
export { HitStop } from './HitStop';
export { ParticleSystem, getComboStage, getComboConfig } from './ParticleSystem';
export type { ComboStage } from './ParticleSystem';
export { ScorePopup } from './ScorePopup';
export { Confetti } from './Confetti';
export { BackgroundParticles } from './BackgroundParticles';
export { StaggerFadeIn } from './StaggerFadeIn';
export { GlowPulseButton } from './GlowPulseButton';
export { ScoreCountUp } from './ScoreCountUp';
