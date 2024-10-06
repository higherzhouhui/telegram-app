import { useCallback, useEffect, useRef } from 'react';
/**
 * Check Typescript section
 * and use your path to adsgram types
 */

export interface useAdsgramParams {
  blockId: string;
  onReward: () => void;
  onError?: (result: any) => void;
}

export function useAdsgram({ blockId, onReward, onError }: useAdsgramParams): () => Promise<void> {
  const AdControllerRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    let _window = window as any
    AdControllerRef.current = _window.Adsgram?.init({ blockId, debug: true, debugBannerType: 'FullscreenMedia' });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => {
          // user watch ad till the end
          onReward();
        })
        .catch((result: any) => {
          // user get error during playing ad or skip ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }
  }, [onError, onReward]);
}