import {
  sequenceValidator,
  duplicateValidator,
  pinValidator,
  birthdayValidator,
} from './pin-validator';

describe('Sequence validator', () => {
  const err = {
    code: 'SequentialNumbersNotAllowedError',
    message: 'Sequential numbers are not allowed',
  };

  it('catches sequential numbers', () => {
    const input = '123456';
    try {
      sequenceValidator(input);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it('catches sequential numbers', () => {
    const input = '345678';
    try {
      sequenceValidator(input);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it('catches sequential numbers', () => {
    const input = '789012';
    try {
      sequenceValidator(input);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it('catches sequential numbers', () => {
    const input = '789012';
    try {
      sequenceValidator(input);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it('accepts non sequential numbers', () => {
    const input = '971357';
    const res = sequenceValidator(input);
    expect(res).toEqual(true);
  });
});

describe('Duplicate validator', () => {
  const err = {
    code: 'RepeatingNumbersNotAllowedError',
    message: 'Repeating numbers are not allowed',
  };
  it('catches 3 consecutive repeating numbers', () => {
    try {
      duplicateValidator('111345');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }
    throw 'err';
  });

  it('catches 3 consecutive repeating numbers', () => {
    try {
      duplicateValidator('112233');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }
    throw 'err';
  });

  it('only allows 2 repeating numbers', () => {
    const res = duplicateValidator('637911');
    expect(res).toEqual(true);
  });
  it('only allows 2 consecutive repeating numbers', () => {
    const res = duplicateValidator('117118');
    expect(res).toEqual(true);
  });
});

describe('Birthday combination validatin', () => {
  const err = {
    code: 'WeakPinPatternError',
    message: 'Weak pattern error',
  };
  it('works - 061595', () => {
    const bday = new Date('June 15, 1995');
    const pin = '061595';
    try {
      birthdayValidator(bday, pin);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }
    throw 'err';
  });
  it('works - 150695', () => {
    const bday = new Date('June 15, 1995');
    const pin = '150695';
    try {
      birthdayValidator(bday, pin);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }
    throw 'err';
  });
  it('works - 951506', () => {
    const bday = new Date('June 15, 1995');
    const pin = '951506';
    try {
      birthdayValidator(bday, pin);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }
    throw 'err';
  });

  it('works - 474619', () => {
    const bday = new Date('June 15, 1995');
    const pin = '474619';
    const res = birthdayValidator(bday, pin);
    expect(res).toEqual(true);
  });
});

describe('pinValidator', () => {
  const err1 = {
    code: 'SequentialNumbersNotAllowedError',
    message: 'Sequential numbers are not allowed',
  };

  const err2 = {
    code: 'RepeatingNumbersNotAllowedError',
    message: 'Repeating numbers are not allowed',
  };

  it('works - 123456', () => {
    try {
      pinValidator('123456');
    } catch (error) {
      expect(error).toEqual(err1);
    }
  });

  it('works - 654321', () => {
    try {
      pinValidator('654321');
    } catch (error) {
      expect(error).toEqual(err1);
    }
  });

  it('works - 911145', () => {
    try {
      pinValidator('911145');
    } catch (error) {
      expect(error).toEqual(err2);
    }
  });

  it('works - 112233', () => {
    try {
      pinValidator('112233');
    } catch (error) {
      expect(error).toEqual(err2);
    }
  });

  it('works - 332211', () => {
    try {
      pinValidator('332211');
    } catch (error) {
      expect(error).toEqual(err2);
    }
  });
  it('works - 123567', () => {
    try {
      pinValidator('123567');
    } catch (error) {
      expect(error).toEqual(err1);
    }
  });
  it('works - 123968', () => {
    try {
      pinValidator('123968');
    } catch (error) {
      expect(error).toEqual(err1);
    }
  });
  it('works - 712369', () => {
    try {
      pinValidator('712369');
    } catch (error) {
      expect(error).toEqual(err1);
    }
  });
});
