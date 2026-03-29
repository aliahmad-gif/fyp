import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const MAX_CONCURRENT_3D = 4;

type ViewerSlotContextType = {
  requestSlot: () => boolean;
  releaseSlot: () => void;
};

const ViewerSlotContext = createContext<ViewerSlotContextType | null>(null);

export function ViewerSlotProvider({ children }: { children: React.ReactNode }) {
  const countRef = useRef(0);
  const [, setTick] = useState(0);
  const requestSlot = useCallback(() => {
    if (countRef.current >= MAX_CONCURRENT_3D) return false;
    countRef.current += 1;
    setTick((t) => t + 1);
    return true;
  }, []);
  const releaseSlot = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setTick((t) => t + 1);
  }, []);

  const api = React.useMemo<ViewerSlotContextType>(
    () => ({ requestSlot, releaseSlot }),
    [requestSlot, releaseSlot]
  );

  return (
    <ViewerSlotContext.Provider value={api}>
      {children}
    </ViewerSlotContext.Provider>
  );
}

export function useViewerSlot() {
  const ctx = useContext(ViewerSlotContext);
  return ctx;
}
