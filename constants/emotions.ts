export interface EmotionCategory {
  id: string;
  label: string;
  color: string;
  svgPath: string;
}

// SVGパスは24x24 viewBox基準
// joy: 太陽（放射線+円）
// anger: 炎
// sadness: 雨粒
// anxiety: 波線
// tired: バッテリー低下
// calm: 月
// happy: 星

export const EMOTIONS: EmotionCategory[] = [
  {
    id: 'joy',
    label: '喜び',
    color: '#FFD93D',
    svgPath: 'M12 2a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zM2 12a1 1 0 011-1h2a1 1 0 010 2H3a1 1 0 01-1-1zm16 0a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1zM5.636 5.636a1 1 0 011.414 0L8.464 7.05a1 1 0 01-1.414 1.414L5.636 7.05a1 1 0 010-1.414zm10.314 10.314a1 1 0 011.414 0l1.414 1.414a1 1 0 01-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zm-10.314 0a1 1 0 010 1.414l-1.414 1.414a1 1 0 01-1.414-1.414l1.414-1.414a1 1 0 011.414 0zm10.314-10.314a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 1.414L17.364 7.05a1 1 0 01-1.414 0zM12 8a4 4 0 100 8 4 4 0 000-8z',
  },
  {
    id: 'anger',
    label: '怒り',
    color: '#E63946',
    svgPath: 'M13.5 2c.28 0 .54.12.72.33l5 6A1 1 0 0118.5 10H15v.27c1.17.41 2 1.52 2 2.73a3 3 0 01-3 3 3 3 0 01-3-3c0-1.21.83-2.32 2-2.73V10H9.5a1 1 0 01-.78-1.62l4-5.05A.98.98 0 0113.5 2zm-2.36 12.62a1 1 0 010 1.41l-1.5 1.5a1 1 0 01-1.41-1.41l1.5-1.5a1 1 0 011.41 0zm5.72 0a1 1 0 011.41 0l1.5 1.5a1 1 0 01-1.41 1.41l-1.5-1.5a1 1 0 010-1.41zM12 18a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1z',
  },
  {
    id: 'sadness',
    label: '悲しみ',
    color: '#4A90D9',
    svgPath: 'M12 2a8 8 0 00-8 8c0 2.14.84 4.08 2.2 5.52L12 22l5.8-6.48A7.97 7.97 0 0020 10a8 8 0 00-8-8zm0 2a6 6 0 016 6c0 1.6-.63 3.05-1.65 4.13L12 19.2l-4.35-5.07A5.98 5.98 0 016 10a6 6 0 016-6zm0 2a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z',
  },
  {
    id: 'anxiety',
    label: '不安',
    color: '#9B59B6',
    svgPath: 'M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4zm0 9a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm0-5a1.25 1.25 0 110 2.5A1.25 1.25 0 0112 8z',
  },
  {
    id: 'tired',
    label: '疲労',
    color: '#95A5A6',
    svgPath: 'M17 6H7a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1zm-1 9H8v-2h8v2zm0-4H8v-2h8v2zm2-8H6a3 3 0 00-3 3v14a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3zm1 17a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1h12a1 1 0 011 1v14z',
  },
  {
    id: 'calm',
    label: '平静',
    color: '#2DD4BF',
    svgPath: 'M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z',
  },
  {
    id: 'happy',
    label: '幸せ',
    color: '#D4AF37',
    svgPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
];

export type EmotionId = 'joy' | 'anger' | 'sadness' | 'anxiety' | 'tired' | 'calm' | 'happy';

export function getEmotionById(id: string): EmotionCategory | undefined {
  return EMOTIONS.find((e) => e.id === id);
}
