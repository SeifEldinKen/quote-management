const isDebuggingMode = (): boolean => {
  return process.env.DEBUG === true;
};

export default isDebuggingMode;
