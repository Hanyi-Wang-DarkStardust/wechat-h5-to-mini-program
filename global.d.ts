import type React from 'react';

interface WxOpenLaunchWeappTag extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  username: string;
  path: string;
}

/**
 * wx sdk 实例对象部分方法集合
 */
interface IWxInstance {
  /**
   * 微信认证
   */
  config: (param: any) => void;

  /**
   * 微信认证准备完毕事件
   */
  ready: (callback: () => void) => void;

  /**
   * 微信认证失败事件
   */
  error: (callback: (e?: unknown) => void) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wx-open-launch-weapp': WxOpenLaunchWeappTag,
    }
  }

  interface Window {
    wx?: IWxInstance;
  }
}