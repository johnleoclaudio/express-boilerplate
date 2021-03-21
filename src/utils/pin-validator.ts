import moment from 'moment-timezone';

const sequenceValidatorV2 = (
  str: string,
  pattern: string,
  pattern2: string,
) => {
  const input = str.split('');

  const err = {
    code: 'SequentialNumbersNotAllowedError',
    message: 'Sequential numbers are not allowed',
  };

  input.forEach((item, i) => {
    while (i + 2 !== input.length) {
      const sequence = item + input[i + 1] + input[i + 2];
      if (pattern.includes(sequence)) {
        throw err;
      } else if (pattern2.includes(sequence)) {
        throw err;
      } else {
        return true;
      }
    }
  });
};

export const sequenceValidator = (str: any) => {
  const pattern = '01234567890123456789';
  const pattern2 = '98765432109876543210';
  const err = {
    code: 'SequentialNumbersNotAllowedError',
    message: 'Sequential numbers are not allowed',
  };

  if (pattern.includes(str)) {
    throw err;
  }

  if (pattern2.includes(str)) {
    throw err;
  }

  sequenceValidatorV2(str, pattern, pattern2);

  return true;
};

export const duplicateValidator = str => {
  const input = str.split('');
  const err = {
    code: 'RepeatingNumbersNotAllowedError',
    message: 'Repeating numbers are not allowed',
  };

  // catch 3 consecutive repeating numbers
  input.forEach((item, i) => {
    while (i + 2 !== input.length) {
      if (item === input[i + 1] && input[i + 1] === input[i + 2]) {
        throw err;
      } else {
        return true;
      }
    }
  });

  // catch 2 consecutive repeating numbers
  input.forEach((item, i) => {
    while (i + 2 !== input.length) {
      if (item === input[i + 1] && input[i + 2] === input[i + 3]) {
        throw err;
      } else {
        return true;
      }
    }
  });

  return true;
};

export const birthdayValidator = (birthday: Date, pin: string) => {
  const pattern1 = moment(birthday).format('MMDDYY');
  const pattern2 = moment(birthday).format('DDMMYY');
  const pattern3 = moment(birthday).format('YYDDMM');

  const err = {
    code: 'WeakPinPatternError',
    message: 'Weak pattern error',
  };
  if (pin === pattern1 || pin === pattern2 || pin === pattern3) {
    throw err;
  }

  return true;
};

export const pinValidator = (pin: string) => {
  duplicateValidator(pin);
  sequenceValidator(pin);
};
