import React, { useCallback, useEffect, useRef } from 'react';
import { JSAPI_INVOKE_MINI_PROGRAM, WEAPP_OPEN_TAG } from './constants';
import { getRandomKey } from './core/utils';
import { loadSdkScriptExecutor, ixWxSdkInitialized } from './core/sdk-loader';
import type { IWeAppTag, IWxSignature } from './interface';
import { getNaviBtnStyle, getWxTagStyle } from './core/styles';

const WeappTag: React.FC<IWeAppTag> = (props: IWeAppTag) => {
  const {
    targetPath,
    miniProgramAppId,
    logger = window?.console,
    debugMode = false,
    wxInstance = window?.wx,
    wxSignature,
    wxSignatureFetcher,
    childrenRef,
  } = props;

  const wxTagIdRef = useRef<string>(`wx-mini-program-launch-btn_${getRandomKey()}`);

  const loadWxSdkIfNeeded = useCallback(async () => {
    if (ixWxSdkInitialized(wxInstance)) {
      return true;
    }
    
    return new Promise((resolve) => {
      loadSdkScriptExecutor(resolve, 0);
    })
  }, [wxInstance]);

  const handleWxConfigReady = useCallback(() => {
    const btn = document.getElementById(wxTagIdRef.current);
    btn?.addEventListener('launch', (e: unknown) => {
      logger.info('跳转小程序组件启动, 详情:', e);
    });
    btn?.addEventListener('error', (e: unknown) => {
      logger.error('跳转小程序组件启动失败, 详情:', e);
    });
  }, [logger]);

  const executeWxConfig = useCallback((signature: IWxSignature) => {
    const signatureConf = {
      ...signature,
      debug: !!debugMode,
      jsApiList: signature.jsApiList?.includes(JSAPI_INVOKE_MINI_PROGRAM)
        ? signature.jsApiList
        : (signature.jsApiList || []).concat([JSAPI_INVOKE_MINI_PROGRAM]),
      openTagList: [WEAPP_OPEN_TAG],
    }

    wxInstance.config(signatureConf);
    wxInstance.ready(() => {
      handleWxConfigReady();
    });
    wxInstance.error((e: unknown) => {
      logger.error('微信 SDK 认证失败, 详情:', e);
    });
  }, [debugMode, handleWxConfigReady, logger, wxInstance]);

  useEffect(() => {
    async function componentDidMount() {
      // 1. 检查 wx jssdk 是否加载
      const isSdkReady = await loadWxSdkIfNeeded();

      if (!isSdkReady) {
        logger.error('微信 SDK 加载失败');
        return;
      }

      // 2. 处理 wx.config 场景
      if (wxSignature) {
        await executeWxConfig(wxSignature);
        return;
      }

      const signature = await wxSignatureFetcher?.();
      if (!signature) {
        logger.error('微信 SDK 认证失败');
        return;
      }
      await executeWxConfig(signature);
    }

    componentDidMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <wx-open-launch-weapp
      id={wxTagIdRef.current}
      username={miniProgramAppId}
      path={targetPath}
      style={getWxTagStyle(debugMode)}
    >
      <script type='text/wxtag-template'>
        <button type='button' style={getNaviBtnStyle(childrenRef, debugMode)}>Navi</button>
      </script>
    </wx-open-launch-weapp>
  );
}


export default WeappTag;
