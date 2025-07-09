function createLogger(context) {
    return {
      debug: (...args) => console.debug(`[${context}]`, ...args),
      info: (...args) => console.info(`[${context}]`, ...args),
      warn: (...args) => console.warn(`[${context}]`, ...args),
      error: (...args) => console.error(`[${context}]`, ...args),
    };
  }
  
  export default createLogger;