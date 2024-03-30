import { useEffect, useRef } from 'react';

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void | undefined>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function callBackAction() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const intervalId = setInterval(callBackAction, delay);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
};
export default useInterval;
