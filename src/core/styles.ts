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

export function getNaviBtnStyle(domRef: React.RefObject<HTMLDivElement>, isDebugMode: boolean): React.CSSProperties {
  return {
    height: domRef.current?.offsetHeight || DEFAULT_HEIGHT,
    width: domRef.current?.offsetWidth || DEFAULT_WIDTH,
    opacity: Number(isDebugMode),
  };
}

