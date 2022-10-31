/**
 * 获取随机字符串，用于生成随机组件 ID
 * @returns 随机字符串
 */
export function getRandomKey(): string {
  return `${Date.now().toString(36)}_${Math.floor(Math.random() * 1000) % 1000}`;
}

export function isIEScriptDomLoaded(script: any) {
  return !script.readyState || ['loaded', 'complete'].includes(script.readyState)
}

