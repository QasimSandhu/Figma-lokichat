const moment = require("moment");

export const isPast = (date: string) => {
  const enteredDate = moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ");
  const currentDate = moment();

  return enteredDate.isBefore(currentDate);
};
