import stringify from 'json-stringify-pretty-compact';

interface ILogger {
  message: string;
  error?: any;
  info?: any;
}

const logger = (log: ILogger) => {
  const { message, error, info } = log;
  console.log(
    '======================== START ==================================',
  );
  console.log(message);
  if (info) console.log(info);
  if (error) {
    // try catch block because JSON might have circular dependency which will throw
    // error if try to stringify it
    try {
      console.log('Error', error);
      console.log('Error response', error.response);
      console.log(
        'Error response data',
        error.response &&
          stringify(error.response.data, { maxLength: 50, indent: 4 }),
      );
    } catch (e) {
      console.log('Error happened while try to stringify error', e);
    }
  }
  console.log(
    '======================== END ==================================',
  );
};

export default logger;
