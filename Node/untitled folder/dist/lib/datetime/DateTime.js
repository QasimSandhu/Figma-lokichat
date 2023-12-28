"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPast = void 0;
const moment = require("moment");
const isPast = (date) => {
    const enteredDate = moment(date, "YYYY-MM-DDTHH:mm:ss.SSSZ");
    const currentDate = moment();
    return enteredDate.isBefore(currentDate);
};
exports.isPast = isPast;
//# sourceMappingURL=DateTime.js.map