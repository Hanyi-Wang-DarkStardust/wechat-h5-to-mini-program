import React, { Component } from 'react';
import {
  DEFAULT_HEIGHT, DEFAULT_WIDTH, JSAPI_INVOKE_MINI_PROGRAM, WEAPP_OPEN_TAG,
} from './constants';
import { getRandomKey, ixWxSdkInitialized, loadSdkScriptExecutor } from './utils';
import type { IWeAppTag, IWxSignature } from './interface';

class WeappTag extends Component<IWeAppTag> {
  private wxTagId: string = `wx-mini-program-launch-btn_${getRandomKey()}`;

  public async componentDidMount() {
    const { wxSignature, wxSignatureFetcher } = this.props;
    // 1. 检查 wx jssdk 是否加载
    const isSdkReady = await this.loadWxSdkIfNeeded();

    if (!isSdkReady) {
      console.error('微信 SDK 加载失败');
      return;
    }

    // 2. 处理 wx.config 场景
    if (wxSignature) {
      await this.executeWxConfig(wxSignature);
      return;
    }

    const signature = await wxSignatureFetcher?.();
    if (!signature) {
      console.error('微信 SDK 认证失败');
      return;
    }
    await this.executeWxConfig(signature);
  }

  public render() {
    const {
      miniProgramAppId, targetPath, debugMode, childrenRef,
    } = this.props;
    const wxTagStyle: React.CSSProperties = {
      background: debugMode ? 'red' : 'transparent',
      position: 'absolute',
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      top: 0,
      left: 0,
    }
  
    const naviBtnStyle: React.CSSProperties = {
      height: childrenRef.current?.offsetHeight || DEFAULT_HEIGHT,
      width: childrenRef.current?.offsetWidth || DEFAULT_WIDTH,
      opacity: Number(debugMode),
    };

    return (
      <wx-open-launch-weapp
        id={this.wxTagId}
        username={miniProgramAppId}
        path={targetPath}
        style={wxTagStyle}
      >
        <script type='text/wxtag-template'>
          <button type='button' style={naviBtnStyle}>Navi</button>
        </script>
      </wx-open-launch-weapp>
    );
  }

  private loadWxSdkIfNeeded = async () => {
    const { wxInstance } = this.props;
    if (ixWxSdkInitialized(wxInstance)) {
      return true;
    }
    
    return new Promise((resolve, reject) => {
      loadSdkScriptExecutor(resolve, reject, 0);
    })
  };

  private executeWxConfig(signature: IWxSignature) {
    const { debugMode } = this.props;
    const signatureConf = {
      ...signature,
      debug: !!debugMode,
      jsApiList: signature.jsApiList?.includes(JSAPI_INVOKE_MINI_PROGRAM)
        ? signature.jsApiList
        : (signature.jsApiList || []).concat([JSAPI_INVOKE_MINI_PROGRAM]),
      openTagList: [WEAPP_OPEN_TAG],
    }

    window.wx?.config(signatureConf);
    window.wx?.ready(() => {
      this.handleWxConfigReady();
    });
    window.wx?.error((e: unknown) => {
      console.error('微信 SDK 认证失败, 详情:', e);
    });
  }

  private handleWxConfigReady() {
    const btn = document.getElementById(this.wxTagId);
    btn?.addEventListener('launch', (e: unknown) => {
      console.info('跳转小程序组件启动, 详情:', e);
    });
    btn?.addEventListener('error', (e: unknown) => {
      console.error('跳转小程序组件启动失败, 详情:', e);
    });
  }
}

export default WeappTag;
