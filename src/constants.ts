/**
 * 微信 JSSDK 脚本 CDN 链接
 */
export const WX_JSSDK_LINK = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';

/**
 * 微信 JSSDK script 标签 ID
 */
export const WX_JSSDK_SCRIPT_ID = '@@X-Protal:wx-js-sdk-script-1.6.0';

/**
 * 需要注册的微信开放标签名称
 * @description 微信H5跳转微信小程序标签
 */
export const WEAPP_OPEN_TAG = 'wx-open-launch-weapp';

/**
 * 需要认证的 JSAPI 名称
 * @description 由于跳转微信小程序能力仅需要 invokeMiniProgramAPI ，此处默认添加
 * 当用户传入签名信息时，同样也会自动增加此 jsApiList
 */
export const JSAPI_INVOKE_MINI_PROGRAM = 'invokeMiniProgramAPI';

/**
 * 微信开放标签默认样式高度
 */
export const DEFAULT_HEIGHT = '100%';

/**
 * 微信开放标签默认样式宽度
 */
export const DEFAULT_WIDTH = '100%';
