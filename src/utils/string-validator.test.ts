import { stringValidator, paramsValidator } from './string-validator';

describe('String validator', () => {
  const err = {
    code: 'InvalidStringError',
    message: 'Invalid string error',
  };

  it("throws an error when string starts with '@'", () => {
    try {
      stringValidator('@leo');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });
  it("throws an error when string starts with '+'", () => {
    try {
      stringValidator('+leo');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });
  it("throws an error when string starts with '='", () => {
    try {
      stringValidator('=leo');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });
  it("throws an error when string starts with '-'", () => {
    try {
      stringValidator('-leo');
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });
});

describe('Params validator', () => {
  const err = {
    code: 'InvalidStringError',
    message: 'Invalid string error',
  };

  it("throws an error when string starts with '@'", () => {
    const mockParams = {
      firstName: '@leo',
      lastName: 'claudio',
      contact: 123,
    };
    try {
      paramsValidator(mockParams);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it("throws an error when string starts with '+'", () => {
    const mockParams = {
      firstName: '+leo',
      lastName: 'claudio',
      contact: 123,
    };
    try {
      paramsValidator(mockParams);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it("throws an error when string starts with '='", () => {
    const mockParams = {
      firstName: '=leo',
      lastName: 'claudio',
      contact: 123,
    };
    try {
      paramsValidator(mockParams);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });

  it("throws an error when string starts with '-'", () => {
    const mockParams = {
      firstName: '-leo',
      lastName: 'claudio',
      contact: 123,
    };
    try {
      paramsValidator(mockParams);
    } catch (error) {
      expect(error).toEqual(err);
      return;
    }

    throw 'err';
  });
});
