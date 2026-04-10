import { useState } from 'react';

export function useRewardedAd() {
  const [isLoaded] = useState(true);

  const showAd = async (onReward: () => void) => {
    onReward();
  };

  return { isLoaded, showAd };
}
