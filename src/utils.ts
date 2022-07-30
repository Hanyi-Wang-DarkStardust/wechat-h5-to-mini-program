import type { IWxInstance } from 'global';
import { WX_JSSDK_LINK, WX_JSSDK_SCRIPT_ID, WX_SDK_LOAD_RETRY_TIMES } from './constants';

/**
 * 获取随机字符串，用于生成随机组件 ID
 * @returns 随机字符串
 */
function getRandomKey(): string {
  return `${Date.now().toString(36)}_${Math.floor(Math.random() * 1000) % 1000}`;
}

function isIEScriptDomLoaded(script: any) {
  return !script.readyState || ['loaded', 'complete'].includes(script.readyState)
}

function ixWxSdkInitialized(wxInstace?: IWxInstance) {
  return Boolean(wxInstace || window?.wx);
}

function loadSdkScriptExecutor(resolve: (value: unknown) => void, reject: (reason?: any) => void, hadRetry = 0) {
  if (ixWxSdkInitialized()) {
    resolve(true);
  }
  const sdkScript = document.createElement('script');
  sdkScript.setAttribute('id', WX_JSSDK_SCRIPT_ID);
  sdkScript.setAttribute('src', WX_JSSDK_LINK);
  document.head.appendChild(sdkScript);

  sdkScript.onload = () => {
    if (!ixWxSdkInitialized() && isIEScriptDomLoaded(sdkScript)) {
      resolve(true);
    }
    if (hadRetry < WX_SDK_LOAD_RETRY_TIMES) {
      loadSdkScriptExecutor(resolve, reject, hadRetry + 1);
      return;
    }
    reject('wx jssdk load failed');
  }

  (sdkScript as any).onreadystatechange = sdkScript.onload;

  sdkScript.onerror = () => {
    sdkScript.parentNode?.removeChild?.(sdkScript);
    if (hadRetry < WX_SDK_LOAD_RETRY_TIMES) {
      loadSdkScriptExecutor(resolve, reject, hadRetry + 1);
      return;
    }
    reject('wx jssdk load failed');
  }
}

export {
  getRandomKey,
  isIEScriptDomLoaded,
  ixWxSdkInitialized,
  loadSdkScriptExecutor,
}
