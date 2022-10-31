import type { IWxInstance } from 'global';
import { isIEScriptDomLoaded } from './utils';
import { WX_JSSDK_LINK, WX_JSSDK_SCRIPT_ID, WX_SDK_LOAD_RETRY_TIMES } from '../constants';

export function ixWxSdkInitialized(wxInstace?: IWxInstance) {
  return Boolean(wxInstace || window?.wx);
}

export function loadSdkScriptExecutor(resolve: (value: unknown) => void, hadRetry = 0) {
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
      loadSdkScriptExecutor(resolve, hadRetry + 1);
      return;
    }
    resolve(false);
  }

  (sdkScript as any).onreadystatechange = sdkScript.onload;

  sdkScript.onerror = () => {
    sdkScript.parentNode?.removeChild?.(sdkScript);
    if (hadRetry < WX_SDK_LOAD_RETRY_TIMES) {
      loadSdkScriptExecutor(resolve, hadRetry + 1);
      return;
    }
    resolve(false);
  }
}
