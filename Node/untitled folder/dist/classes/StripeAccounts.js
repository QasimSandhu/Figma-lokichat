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
const { BlobServiceClient } = require("@azure/storage-blob");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripe_1 = __importDefault(require("stripe"));
class StripeAccount {
    constructor() {
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            // @ts-ignore
            apiVersion: '2023-10-16',
        });
        this.connectionString = "DefaultEndpointsProtocol=https;AccountName=first1122;AccountKey=d4EB3gn9Uvl891S7WPoVqhumDyA4s8C25SUU6V2j6Etm8+M6eTfc7UVzRkX545wrqdJSBH0Ibgpj+AStB2U4ng==;EndpointSuffix=core.windows.net";
        this.containerName = process.env.AZURE_CONTAINER_NAME || "mycontainer";
        this.postBatchUrl = "https://kamran.cognitiveservices.azure.com/translator/text/batch/v1.1";
        this.route = "/batches";
        this.key = process.env.AZURE_TRANSLATION_REQUEST_KEY || "b4c76100cd944086a32a94d2a0cc15f4";
        this.targetContainer = "https://first1122.blob.core.windows.net/mycontainer";
        this.token = 'sp=racwdli&st=2023-10-10T16:24:04Z&se=2025-10-11T00:24:04Z&spr=https&sv=2022-11-02&sr=c&sig=sygRuMTuD0JsSyR9EfgMY1qb5Zoj%2FnkUFnurObSxmyk%3D';
    }
    createConnectAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.stripe.accounts.create({
                    type: 'express',
                });
                return account;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    getConnectAccountDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.stripe.accounts.retrieve(id);
                return account;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    deleteConnectAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const delDetails = yield this.stripe.accounts.del(id);
                return delDetails;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    rejectConnectAccount(id, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rejDetails = yield this.stripe.accounts.reject(id, { reason });
                return rejDetails;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    listConnectAccounts(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accounts = yield this.stripe.accounts.list({ limit: typeof (limit) == "number" ? limit : 10 });
                return accounts;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    createAccountLink(id, refresh_url, return_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountLinkObject = yield this.stripe.accountLinks.create({
                    account: id,
                    refresh_url,
                    return_url,
                    type: 'account_onboarding'
                });
                return accountLinkObject;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    createLoginLink(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountLinkObject = yield this.stripe.accounts.createLoginLink(id);
                return accountLinkObject;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    transferToConnectAccount(toAccountId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transfer = yield this.stripe.transfers.create({
                    destination: toAccountId,
                    amount,
                    currency: 'usd'
                });
                return transfer;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    retrieveTransfer(transferId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transfer = yield this.stripe.transfers.retrieve(transferId);
                return transfer;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    listTransfers(limit = 10, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = { limit };
                if (typeof accountId == 'string')
                    query[`destination`] = accountId;
                const transfers = yield this.stripe.transfers.list(query);
                return transfers;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    transferReversal(transferId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reversalTransfer = yield this.stripe.transfers.createReversal(transferId, {
                    amount
                });
                return reversalTransfer;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    retrieveATransferReversal(transferId, transferReversalId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reversalTransfer = yield this.stripe.transfers.retrieveReversal(transferId, transferReversalId);
                return reversalTransfer;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    listTransfersReversals(limit = 10, transferId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transfers = yield this.stripe.transfers.listReversals(transferId, { limit });
                return transfers;
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
    getBalance(connectedAccountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.stripe.balance.retrieve({ stripeAccount: connectedAccountId });
            }
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });
    }
}
exports.default = new StripeAccount();
//# sourceMappingURL=StripeAccounts.js.map