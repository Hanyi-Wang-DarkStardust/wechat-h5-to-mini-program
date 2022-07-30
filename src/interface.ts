import type React from 'react';

export interface ICoreConfig {
  /**
   * 公众号 Appid，用于 wx.config 认证使用
   */
  officialAccountappId: string;

  /**
   * 需要跳转的小程序 Appid
   */
  miniProgramAppId: string;
}

export interface IWxSignature {
  /**
   * 微信认证专用：公众号 Appid
   */
   officialAccountappId: ICoreConfig['officialAccountappId'];

  /**
   * 微信认证专用：时间戳
   */
  timestamp: string;

  /**
   * 微信认证专用：nonceStr
   */
  nonceStr: string;

  /**
   * 微信认证专用：签名字段
   */
  signature: string;

  /**
   * 额外需要认证的 jsAPI
   */
  jsApiList?: Array<string>;
}


/**
 * 微信开放标签封装组件核心 props
 */
interface IWeAppTagCore<T> {
  /**
   * 需要跳转的小程序 pathname
   */
  targetPath: string;
  
  /**
   * 小程序 APPID
   */
  miniProgramAppId: string;

  /**
   * 是否开启调试模式
   */
  debugMode?: boolean;

  /**
   * 外部传入的微信签名
   * @description 如果传入外部微信签名，则会直接使用该配置进行 wx.config 操作
   */
  wxSignature?: T;

  /**
   * wx jssdk 实例，如果不传入将从 window.wx 中获取，若都没有则将启动内部初始化流程
   */
  wxInstance?: any;

  /**
   * 用于获取微信签名的函数，随后会利用返回值进行 wx.config 操作
   */
  wxSignatureFetcher?: () => Promise<T | null>;
}

/**
 * 开放标签封装组件 props
 */
export interface IWeAppTag<T extends IWxSignature = IWxSignature> extends IWeAppTagCore<T> {
  childrenRef: React.RefObject<HTMLDivElement>;
}

/**
 * H5跳转微信小程序组件 props
 */
export interface IWechatH5ToMiniProgram<T extends IWxSignature = IWxSignature> extends IWeAppTagCore<T> {
  /**
   * 需要包裹的子组件
   */
  children: JSX.Element;

  /**
   * 外部传入的 className，用于覆盖样式或 DOM 操作使用
   */
  className?: string;

  /**
   * 外部传入的 style，用于覆盖样式
   */
  style?: React.CSSProperties;
}
