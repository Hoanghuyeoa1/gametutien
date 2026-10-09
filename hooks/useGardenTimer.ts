// hooks/useGardenTimer.ts
// Hook chuyên trách ticker thời gian thực 1 giây phục vụ tính toán sinh trưởng Linh Điền & Cooldowns

import { useState, useEffect } from 'react';

export interface UseGardenTimerReturn {
  currentTimestamp: number;
}

export function useGardenTimer(intervalMs: number = 1000): UseGardenTimerReturn {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return {
    currentTimestamp
  };
}
