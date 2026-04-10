/**
 * コエトモ マスコット: ふわもこAI「コエちゃん」
 * ふわふわの雲のような体 + 大きな耳 + マイクアンテナ
 * キャラ中央配置型 / 1.5頭身 / 6表情
 */
import React from 'react';
import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

type KoeExpression = 'happy' | 'listening' | 'singing' | 'sleepy' | 'love' | 'surprised';

interface MascotSvgProps {
  size?: number;
  expression?: KoeExpression;
}

export const MascotSvg: React.FC<MascotSvgProps> = ({ size = 120, expression = 'happy' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityLabel="コエちゃん（ふわもこAIマスコット）"
    >
      <Defs>
        <RadialGradient id="bodyGrad" cx="45%" cy="35%" r="60%">
          <Stop offset="0%" stopColor="#F3E5F5" />
          <Stop offset="50%" stopColor="#E1BEE7" />
          <Stop offset="100%" stopColor="#CE93D8" />
        </RadialGradient>
        <RadialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#F8BBD0" />
          <Stop offset="100%" stopColor="#F48FB1" stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="innerEar" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#F8BBD0" />
          <Stop offset="100%" stopColor="#CE93D8" />
        </RadialGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="60" cy="110" rx="30" ry="5" fill="#00000015" />

      {/* Fluffy body cloud */}
      <G>
        <Circle cx="45" cy="88" r="16" fill="url(#bodyGrad)" />
        <Circle cx="60" cy="82" r="18" fill="url(#bodyGrad)" />
        <Circle cx="75" cy="88" r="16" fill="url(#bodyGrad)" />
        <Circle cx="50" cy="95" r="14" fill="url(#bodyGrad)" />
        <Circle cx="70" cy="95" r="14" fill="url(#bodyGrad)" />
        <Ellipse cx="60" cy="90" rx="22" ry="16" fill="url(#bodyGrad)" />
      </G>

      {/* Belly highlight */}
      <Ellipse cx="60" cy="88" rx="12" ry="8" fill="#FFFFFF" opacity={0.3} />

      {/* Head (fluffy cloud) */}
      <G>
        <Circle cx="45" cy="40" r="16" fill="url(#bodyGrad)" />
        <Circle cx="60" cy="34" r="20" fill="url(#bodyGrad)" />
        <Circle cx="75" cy="40" r="16" fill="url(#bodyGrad)" />
        <Circle cx="52" cy="50" r="14" fill="url(#bodyGrad)" />
        <Circle cx="68" cy="50" r="14" fill="url(#bodyGrad)" />
        <Ellipse cx="60" cy="42" rx="24" ry="18" fill="url(#bodyGrad)" />
      </G>

      {/* Big floppy ears */}
      <G>
        <Ellipse cx="30" cy="32" rx="12" ry="18" fill="#E1BEE7" rotation="-15" origin="30, 32" />
        <Ellipse cx="30" cy="32" rx="7" ry="12" fill="url(#innerEar)" rotation="-15" origin="30, 32" />
        <Ellipse cx="90" cy="32" rx="12" ry="18" fill="#E1BEE7" rotation="15" origin="90, 32" />
        <Ellipse cx="90" cy="32" rx="7" ry="12" fill="url(#innerEar)" rotation="15" origin="90, 32" />
      </G>

      {/* Microphone antenna */}
      <Path d="M60 18 L60 8" stroke="#CE93D8" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="60" cy="6" r="4" fill="#7B1FA2" />
      <Circle cx="60" cy="6" r="2.5" fill="#E1BEE7" />

      {/* Sound waves from mic (when listening/singing) */}
      {(expression === 'listening' || expression === 'singing') && (
        <G opacity={0.4}>
          <Path d="M52 6 Q48 6 48 2" stroke="#7B1FA2" strokeWidth="1.5" fill="none" />
          <Path d="M68 6 Q72 6 72 2" stroke="#7B1FA2" strokeWidth="1.5" fill="none" />
          {expression === 'singing' && (
            <G>
              <Path d="M46 8 Q42 8 42 3" stroke="#7B1FA2" strokeWidth="1" fill="none" />
              <Path d="M74 8 Q78 8 78 3" stroke="#7B1FA2" strokeWidth="1" fill="none" />
            </G>
          )}
        </G>
      )}

      {/* Eyes */}
      {expression === 'sleepy' ? (
        <G>
          <Path d="M46 40 Q52 36 58 40" stroke="#4A148C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M62 40 Q68 36 74 40" stroke="#4A148C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </G>
      ) : expression === 'love' ? (
        <G>
          <Path d="M44 38 C44 32, 50 32, 50 38 C50 32, 56 32, 56 38 C56 45, 50 48, 50 48 C50 48, 44 45, 44 38 Z" fill="#E91E63" />
          <Path d="M64 38 C64 32, 70 32, 70 38 C70 32, 76 32, 76 38 C76 45, 70 48, 70 48 C70 48, 64 45, 64 38 Z" fill="#E91E63" />
        </G>
      ) : (
        <G>
          <Ellipse cx="50" cy="40" rx={expression === 'surprised' ? 8 : 7} ry={expression === 'surprised' ? 9 : 8} fill="#FFFFFF" />
          <Ellipse cx="70" cy="40" rx={expression === 'surprised' ? 8 : 7} ry={expression === 'surprised' ? 9 : 8} fill="#FFFFFF" />
          <Circle cx="51" cy="40" r={expression === 'surprised' ? 5 : 4.5} fill="#4A148C" />
          <Circle cx="71" cy="40" r={expression === 'surprised' ? 5 : 4.5} fill="#4A148C" />
          <Circle cx="49" cy="37" r="2.5" fill="#FFFFFF" />
          <Circle cx="69" cy="37" r="2.5" fill="#FFFFFF" />
          <Circle cx="53" cy="42" r="1.5" fill="#FFFFFF" opacity={0.6} />
          <Circle cx="73" cy="42" r="1.5" fill="#FFFFFF" opacity={0.6} />
        </G>
      )}

      {/* Cheek blush */}
      <Ellipse cx="38" cy="48" rx="6" ry="3.5" fill="url(#cheekGrad)" opacity={0.7} />
      <Ellipse cx="82" cy="48" rx="6" ry="3.5" fill="url(#cheekGrad)" opacity={0.7} />

      {/* Mouth */}
      {expression === 'happy' ? (
        <Path d="M54 50 Q60 56 66 50" stroke="#7B1FA2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : expression === 'singing' ? (
        <Ellipse cx="60" cy="52" rx="5" ry="6" fill="#7B1FA2" />
      ) : expression === 'listening' ? (
        <Path d="M55 50 Q60 52 65 50" stroke="#7B1FA2" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : expression === 'surprised' ? (
        <Ellipse cx="60" cy="52" rx="4" ry="5" fill="#7B1FA2" />
      ) : expression === 'love' ? (
        <Path d="M54 50 Q60 56 66 50" stroke="#E91E63" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <Path d="M56 51 L64 51" stroke="#7B1FA2" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Tiny arms */}
      <Ellipse cx="34" cy="80" rx="6" ry="4" fill="#E1BEE7" />
      <Ellipse cx="86" cy="80" rx="6" ry="4" fill="#E1BEE7" />

      {/* Tiny feet */}
      <Ellipse cx="48" cy="104" rx="7" ry="4" fill="#CE93D8" />
      <Ellipse cx="72" cy="104" rx="7" ry="4" fill="#CE93D8" />

      {/* Musical notes (when singing) */}
      {expression === 'singing' && (
        <G opacity={0.5}>
          <Path d="M85 30 L85 20 L92 22 L92 32 Z" fill="#7B1FA2" />
          <Circle cx="85" cy="32" r="3" fill="#7B1FA2" />
          <Circle cx="92" cy="34" r="3" fill="#7B1FA2" />
        </G>
      )}
    </Svg>
  );
};
