/**
 * 获取当前时刻毫秒级戳
 * @returns 当前时刻时间戳
 */
function getCurrentTimeAsNumber() {
  return new Date().getTime()
}

/**
 * 获取随机字符串，用于生成随机组件 ID
 * @returns 随机字符串
 */
function getRandomKey(): string {
  return `${getCurrentTimeAsNumber()}_${Math.floor(Math.random() * 1000) % 1000}`;
}

export {
  getRandomKey,
  getCurrentTimeAsNumber,
}
