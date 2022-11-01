# 微信 H5 跳转小程序页面通用解决方案

一个开箱即用的微信H5跳转微信小程序的 HOC 组件
## 背景

对于H5开发来说，微信H5这一媒介想必大家并不陌生。微信作为目前国内最大的互联网生态环境，其内置浏览器与小程序的流量可谓是不可轻视。

我们知道，H5的功能局限性较大，并不能胜任许多涉及到关系列表以及部分原生能力的功能，越来越多的需求希望能够将用户从微信H5的平台导流至小程序，以实现原生能力的调用。

而在导流需求的开发过程中，微信js sdk原生标签的独特性与逻辑的复杂性使得许多开发者踩坑无数。基于此，本仓库将此类原生标签进行封装，提供对应的生命周期钩子，提供开箱即用的 HOC 组件。

## 优势

1. 开箱即用：提供完备通用的能力封装，仅需暴露最少的组件 props 供接入方传入

2. 轻量：全 ESM 打包，引入成本极低

3. 生命周期：暴露生命周期钩子与上报工具，提供日志调试能力与上报能力的拓展

## 技术栈

TypeScript + React Hooks


## 使用方法


### 1. 安装
```bash
npm i wechat-h5-to-mini-program-hoc
```

### 2. 使用
```typescript
// normal import
import WechatH5ToMiniProgramHOC from wechat-h5-to-mini-program-hoc;
// dynamic import 
// const WechatH5ToMiniProgramHOC = lazy(() => import('wechat-h5-to-mini-program-hoc'));

import { ComponentA, ComponentB } from './components';

const demoApp = (props) => {
  useEffect(() => {
    // some business logic ...
  }, []);

  // 调用业务方法，获取微信签名。
  // 通常需要通过业务后台下发，建议封装成 Promise 或者异步函数
  const getWxSignature = useCallback(async () => {
      const { nonceStr, signature, timestamp } = await fetch('XXXXX', {
          credentials: 'include',
      }).then(resp => resp.json());

      return {
        beta: true,
        appId: 'XXXXXX',  // 公众号 APPId
        timestamp,
        nonceStr,
        signature,
      };
    }, []);

  return (
    <div>
      <ComponentA />
      <WechatH5ToMiniProgramHOC
        targetPath='packages/mini-program/pageA'
        miniProgramAppId='gh_XXXX'
        wxSignatureFetcher={getWxSignature}
      >
        <ComponentB>
      </WechatH5ToMiniProgramHOC>
    </div>
  )
}
```

