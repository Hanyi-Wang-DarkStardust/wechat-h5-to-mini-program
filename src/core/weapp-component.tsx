import React, { useCallback, useEffect, useRef } from 'react';
import type { IWxInstance } from 'global';
import { JSAPI_INVOKE_MINI_PROGRAM, WEAPP_OPEN_TAG } from '../constants';
import { getRandomKey } from './utils';
import { loadSdkScriptExecutor, isWxSdkInitialized } from './sdk-loader';
import type { IWeAppTag, IWxSignature } from '../interface';
import { getWxTagStyle, useNaviBtnStyle } from './styles';

const WeappTag: React.FC<IWeAppTag> = (props: IWeAppTag) => {
  const {
    targetPath,
    miniProgramAppId,
    logger = window?.console,
    debugMode = false,
    wxInstance,
    wxSignature,
    wxSignatureFetcher,
    childrenRef,
  } = props;

  const wxTagIdRef = useRef<string>(`wx-mini-program-launch-btn_${getRandomKey()}`);

  const loadWxSdkIfNeeded = useCallback(async () => {
    if (isWxSdkInitialized(wxInstance)) {
      return wxInstance || window?.wx;
    }

    return new Promise((resolve) => {
      loadSdkScriptExecutor(resolve, 0);
    });
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

  const executeWxConfig = useCallback((signature: IWxSignature, instance: IWxInstance = wxInstance) => {
    const signatureConf = {
      ...signature,
      debug: !!debugMode,
      jsApiList: signature.jsApiList?.includes(JSAPI_INVOKE_MINI_PROGRAM)
        ? signature.jsApiList
        : (signature.jsApiList || []).concat([JSAPI_INVOKE_MINI_PROGRAM]),
      openTagList: [WEAPP_OPEN_TAG],
    };
    instance?.config(signatureConf);
    instance?.ready(() => {
      handleWxConfigReady();
    });
    instance?.error((e: unknown) => {
      logger.error('微信 SDK 认证失败, 详情:', e);
    });
  }, [debugMode, handleWxConfigReady, logger, wxInstance]);

  useEffect(() => {
    async function componentDidMount() {
      // 1. 检查 wx jssdk 是否加载
      const safeWxInstance = await loadWxSdkIfNeeded();
      if (!safeWxInstance) {
        logger.error('微信 SDK 加载失败');
        return;
      }

      // 2. 处理 wx.config 场景
      if (wxSignature) {
        executeWxConfig(wxSignature, safeWxInstance);
        return;
      }

      const signature = await wxSignatureFetcher?.();
      if (!signature) {
        logger.error('微信 SDK 认证失败');
        return;
      }
      executeWxConfig(signature, safeWxInstance);
    }

    componentDidMount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const btnStyle = useNaviBtnStyle(childrenRef, debugMode);

  return (
    <wx-open-launch-weapp
      id={wxTagIdRef.current}
      username={miniProgramAppId}
      path={targetPath}
      style={getWxTagStyle(debugMode)}
    >
      <script type='text/wxtag-template'>
        <button type='button' style={btnStyle}>Navi</button>
      </script>
    </wx-open-launch-weapp>
  );
}


export default WeappTag;
