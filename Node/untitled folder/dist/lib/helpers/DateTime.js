"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstDayOfCurrentMonth = void 0;
const getFirstDayOfCurrentMonth = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
};
exports.getFirstDayOfCurrentMonth = getFirstDayOfCurrentMonth;
//# sourceMappingURL=DateTime.js.map