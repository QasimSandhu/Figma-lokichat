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
exports.resetExpiraySubscriptionCrone = void 0;
const mongoose = require('mongoose');
const cron = require('node-cron');
const User_1 = __importDefault(require("./models/User"));
// Function to reset expired free subscriptions for users
const resetExpiredSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find users whose trial has expired (more than 30 days ago)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const usersToResetFreeSubscription = yield User_1.default.find({
            referralSubscriptionConsumed: true,
            subscriptionReferralExpiration: { $lt: thirtyDaysAgo },
        });
        console.log(usersToResetFreeSubscription, "usersToResetFreeSubscription");
        // Reset free subscriptions for eligible users
        for (const user of usersToResetFreeSubscription) {
            user.subscription = null;
            user.referralSubscriptionConsumed = false;
            user.subscriptionReferralExpiration = null;
            yield user.save();
            console.log(`Free subscription reset for user ${user._id}`);
        }
    }
    catch (error) {
        console.error('Error resetting free subscriptions:', error);
    }
});
const resetExpiraySubscriptionCrone = () => {
    cron.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        // await applyFreeSubscriptions();
        yield resetExpiredSubscriptions();
    }), {
        scheduled: true,
        timezone: 'Asia/Karachi',
    });
};
exports.resetExpiraySubscriptionCrone = resetExpiraySubscriptionCrone;
// Start the cron job
//# sourceMappingURL=referralCrone.js.map