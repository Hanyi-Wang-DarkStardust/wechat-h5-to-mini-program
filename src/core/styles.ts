import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../constants';

export function getWxTagStyle(isDebugMode: boolean): React.CSSProperties {
  return {
    background: isDebugMode ? 'red' : 'transparent',
    position: 'absolute',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    top: 0,
    left: 0,
  };
}

export const useNaviBtnStyle = (domRef: React.RefObject<HTMLDivElement>, isDebugMode: boolean) => {
  const [height, setHeight] = useState<React.CSSProperties['height']>(DEFAULT_HEIGHT);
  const [width, setWidth] = useState<React.CSSProperties['width']>(DEFAULT_WIDTH);

  useEffect(() => {
    setHeight(domRef.current?.offsetHeight || DEFAULT_HEIGHT);
    setWidth(domRef.current?.offsetWidth || DEFAULT_WIDTH);
  }, [domRef]);

  return useMemo(() => ({
    height: height || DEFAULT_HEIGHT,
    width: width || DEFAULT_WIDTH,
    opacity: Number(isDebugMode),
  }), [height, isDebugMode, width]);
};
