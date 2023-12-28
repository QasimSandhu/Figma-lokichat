"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPlanData = void 0;
const cron = require('node-cron');
const User_1 = __importDefault(require("./models/User"));
const resetPlanData = () => {
    cron.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const currentDate = new Date();
            currentDate.setUTCHours(0, 0, 0, 0); // Set the time to midnight in UTC
            const next30Days = new Date(currentDate);
            next30Days.setDate(currentDate.getDate() + 30);
            const nextDay = new Date(currentDate);
            nextDay.setDate(currentDate.getDate() + 1); // Calculate the next day
            const users = yield User_1.default.find({
                subscriptionRenewalDate: {
                    $gte: currentDate,
                    $lt: nextDay,
                },
            });
            for (const user of users) {
                user.subscriptionRenewalDate = next30Days;
                user.audioCount = 0;
                user.wordsCount = 0;
                user.imagesCount = 0;
                //TODO: Set other users attributes on the basis of current user plan
                yield user.save();
            }
            console.log(`Updated ${users.length} user records.`);
        }
        catch (error) {
            console.error("Cron job error:", error);
        }
    }));
};
exports.resetPlanData = resetPlanData;
//# sourceMappingURL=renewPlanCrone.js.map