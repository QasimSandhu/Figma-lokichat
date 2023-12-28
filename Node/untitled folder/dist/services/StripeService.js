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
const lodash_1 = require("lodash");
const Notifications_1 = __importDefault(require("../models/Notifications"));
const User_1 = __importDefault(require("../models/User"));
const StripeAccounts_1 = __importDefault(require("../classes/StripeAccounts"));
const stripe_1 = __importDefault(require("stripe"));
const Transactions_1 = __importDefault(require("../models/Transactions"));
const mongoose_1 = __importDefault(require("mongoose"));
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            //@ts-ignore
            apiVersion: '2023-10-16'
        });
    }
    getStripeSetupUrl(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const reqUser = yield User_1.default.findById(userId);
            const link = yield StripeAccounts_1.default.createAccountLink(reqUser.stripeConnectAccountId, 'https://stripe.com/docs', 'https://stripe.com/docs');
            return link;
        });
    }
    getStripeLoginLink(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const reqUser = yield User_1.default.findById(userId);
            const linkObject = yield StripeAccounts_1.default.createLoginLink(reqUser.stripeConnectAccountId);
            return linkObject;
        });
    }
    getConnectAccountDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const reqUser = yield User_1.default.findById(userId);
            const details = yield StripeAccounts_1.default.getConnectAccountDetails(reqUser.stripeConnectAccountId);
            return details;
        });
    }
    findCharge(pmId, start = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payment_method_details = yield this.stripe.paymentMethods.retrieve(pmId);
                let sobj = start == '' ? {} : { starting_after: start };
                let charges = yield this.stripe.charges.list(Object.assign({ created: {
                        gte: payment_method_details.created - 36000
                    }, limit: 1000000 }, sobj));
                // const charges = await this.stripe.charges.search({
                //   query: `metadata[\'payment_method\']:\'${payment_method_id}\'`,
                // });
                console.log(charges, payment_method_details, pmId, charges.data.length, 'charges and pm id');
                let refCharge = charges.data.find(i => i.payment_method == pmId);
                let refBalanceTransaction = {};
                if (!refCharge) {
                    refBalanceTransaction = yield this.findCharge(pmId, charges.data[90].id);
                    return refBalanceTransaction;
                }
                else {
                    // console.log(refCharge, "refcharge");
                    refBalanceTransaction = yield this.stripe.balanceTransactions.retrieve(refCharge.balance_transaction);
                    console.log(refBalanceTransaction, ' balanceTransaction');
                    return refBalanceTransaction;
                }
            }
            catch (error) {
                console.log(error);
                throw new Error('charge not found');
            }
        });
    }
    getStatics(payment_method_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment_method_details = yield this.stripe.paymentMethods.retrieve(payment_method_id);
            const charges = yield this.stripe.charges.list(Object.assign({ created: {
                    gte: payment_method_details.created - 36000
                }, limit: 1000000 }, {}));
            // const charges = await this.stripe.charges.search({
            //   query: `metadata[\'payment_method\']:\'${payment_method_id}\'`,
            // });
            console.log(charges, payment_method_details, payment_method_id, charges.data.length, 'charges and pm id');
            // const refCharge = charges.data.find(i => i.payment_method == payment_method_id);
            // if (!refCharge) throw new Error('Charge not found!')
            // console.log(refCharge,"refcharge");
            // let refCharge = await this.findCharge(payment_method_id)
            // console.log(refCharge?.balance_transaction, "refchargeOutside");
            // const refBalanceTransaction = await this.stripe.balanceTransactions.retrieve(refCharge.balance_transaction as string)
            const refBalanceTransaction = yield this.findCharge(payment_method_id);
            console.log(refBalanceTransaction, 'OUtSide Balance Transaction ');
            console.log(refBalanceTransaction, new Date(Number(refBalanceTransaction.available_on) * 1000), " ===> balence transaction");
            if (new Date() > new Date(Number(refBalanceTransaction.available_on) * 1000) && refBalanceTransaction.status == 'available') {
                //good to go , means charge is ok, transaction available date passed and transaction is now available detected through status of transaction
                return true;
            }
            else {
                throw new Error(`Transaction is in Pending State, Not Available yet.Try after ${new Date(refBalanceTransaction.available_on * 1000)}`);
            }
        });
    }
    sendMoneyToConnectedAccount(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, body } = req;
                const { amount, againstUser } = body;
                const referredUser = yield User_1.default.findById(againstUser).populate('currentTransactionId');
                const referredPayment = referredUser.currentTransactionId;
                if (referredPayment.deliveryStatus == 'Completed') {
                    throw new Error('Commission already deleivered.');
                }
                const reqUser = yield User_1.default.findById(userId);
                // await StripeAccounts.getBalance(reqUser.stripeConnectAccountId)
                const currentTransactionId = referredPayment._id;
                const pmId = referredPayment.paymentId;
                const isAmountReadyToPayout = yield new StripeService().getStatics(pmId);
                if (isAmountReadyToPayout != true) {
                    throw new Error('Payment not available yet.');
                }
                const transfer = yield StripeAccounts_1.default.transferToConnectAccount(reqUser.stripeConnectAccountId, amount);
                console.log(transfer, ' Transfer');
                const updateTransaction = yield Transactions_1.default.findByIdAndUpdate(currentTransactionId, {
                    $set: {
                        refferalConnectAccountTransferid: transfer.id,
                        deliveryStatus: 'Completed',
                        deleiveredAt: new Date()
                    }
                });
                return updateTransaction;
                console.log('everything Ok');
                return {};
            }
            catch (error) {
                console.log(error);
                throw new Error((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
            }
        });
    }
    getUserPendingTransactions(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const transactions = yield Transactions_1.default.find({
                    referralSuperUser: new mongoose_1.default.Types.ObjectId(userId),
                    deliveryStatus: 'Pending',
                }).populate('user').populate('campaignId').populate('subscription');
                return transactions;
            }
            catch (error) {
                console.log(error);
                throw new Error((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
            }
        });
    }
    getUserTransactionsHistory(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const transactions = yield Transactions_1.default.find({
                    referralSuperUser: new mongoose_1.default.Types.ObjectId(userId),
                    deliveryStatus: 'Completed',
                }).populate('user').populate('campaignId').populate('subscription');
                return transactions;
            }
            catch (error) {
                console.log(error);
                throw new Error((_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error);
            }
        });
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const notifications = yield Notifications_1.default.find({ receivers: { $in: userId } });
            return notifications;
        });
    }
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { message, from, receivers, readBy } = body;
            const goal = new Notifications_1.default({
                user: userId,
                message,
                from,
                receivers,
                readBy: readBy || [],
            });
            yield goal.save();
            return goal;
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, userId } = req;
            const { notificationsList } = body;
            if (notificationsList === false) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: false }, { new: true });
            }
            else if (notificationsList === true) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: true }, { new: true });
            }
            else if (Array.isArray(notificationsList) && (0, lodash_1.size)(notificationsList) > 0) {
                return yield User_1.default.findByIdAndUpdate(userId, { notificationsList: notificationsList }, { new: true });
            }
            else
                throw new Error('invalid user notifications list');
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { params } = req;
            const { notificationId } = params;
            return "";
        });
    }
}
exports.default = new StripeService();
//# sourceMappingURL=StripeService.js.map