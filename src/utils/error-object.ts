const errorObject = (err: any, tracker?: any) => {
  let errObject;
  if (
    err.name &&
    err.name == 'SequelizeUniqueConstraintError' &&
    err.fields.hasOwnProperty('email')
  ) {
    errObject = {
      code: 'DuplicateUserError',
      message: 'Email must be unique.',
    };
  } else {
    errObject = {
      code: 'SomethingWentWrongError',
      message: err.message,
    };
  }
  if (tracker) tracker.sendError(errObject);
  return errObject;
};

export default errorObject;
