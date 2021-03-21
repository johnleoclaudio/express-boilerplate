export const stringValidator = (str: any) => {
  const err = {
    code: 'InvalidStringError',
    message: 'Invalid string error',
  };
  if (
    str.startsWith('@') ||
    str.startsWith('+') ||
    str.startsWith('=') ||
    str.startsWith('-')
  ) {
    throw err;
  }

  return str;
};

export const paramsValidator = (params: any) => {
  if (!params) {
    return params;
  }

  // Disabled password & deviceId validation
  const paramsToValidate = Object.keys(params).filter(
    item =>
      typeof params[item] === 'string' &&
      item != 'password' &&
      item != 'deviceId',
  );

  paramsToValidate.forEach(item => stringValidator(params[item]));
};
