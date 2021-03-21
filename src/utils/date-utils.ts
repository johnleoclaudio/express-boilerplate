import moment from 'moment-timezone';

export const startOfTheDay = (date?: Date | string) => {
  if (date)
    return moment(date)
      .tz('Asia/Manila')
      .startOf('day')
      .toDate();
  return moment(new Date())
    .tz('Asia/Manila')
    .startOf('day')
    .toDate();
};

export const endOfTheDay = (date?: Date | string) => {
  if (date)
    return moment(date)
      .tz('Asia/Manila')
      .endOf('day')
      .toDate();
  return moment(new Date())
    .tz('Asia/Manila')
    .endOf('day')
    .toDate();
};
