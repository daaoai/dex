import { useEffect, useRef } from 'react';

function useEffectAfterMount(fn: () => void, deps: unknown[]) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn();
    } else {
      isMountingRef.current = false;
    }
  }, deps);
}

export default useEffectAfterMount;
