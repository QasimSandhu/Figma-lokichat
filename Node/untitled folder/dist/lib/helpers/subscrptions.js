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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRemainingWords = exports.updateStreamWordsCounter = exports.updateUserWordsCounter = void 0;
const FREE_WORDS_LIMIT = 10000;
const ALLOWED_WORDS_LIMIT = 300;
const findMatchingPlan = (subscriptionId, subscriptions) => {
    for (const subscription of subscriptions) {
        const matchingPlan = subscription.plans.find((plan) => { var _a; return ((_a = plan === null || plan === void 0 ? void 0 : plan._id) === null || _a === void 0 ? void 0 : _a.toString()) === (subscriptionId === null || subscriptionId === void 0 ? void 0 : subscriptionId.toString()); });
        if (matchingPlan)
            return matchingPlan;
    }
    return null;
};
const updateUserWordsCounter = (user, response, subscriptions) => __awaiter(void 0, void 0, void 0, function* () {
    let wordCount;
    const characterCount = response.replace(/ /g, "").length;
    wordCount = Math.ceil(characterCount / 7);
    const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
    const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
    if (matchingPlanTitle) {
        if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) && (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + wordCount) {
            const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount);
            throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
    }
    if (!user.subscription) {
        let limit = FREE_WORDS_LIMIT;
        if (userWordsCount < limit && limit < userWordsCount + wordCount) {
            const remainingLimit = (limit - userWordsCount);
            throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
    }
    try {
        user.wordsCount = userWordsCount + wordCount;
        yield user.save();
    }
    catch (error) {
        console.error("Error updating wordsCount:", error);
    }
});
exports.updateUserWordsCounter = updateUserWordsCounter;
const updateStreamWordsCounter = (user, response, subscriptions) => __awaiter(void 0, void 0, void 0, function* () {
    let wordCount;
    const characterCount = response.replace(/ /g, "").length;
    wordCount = Math.ceil(characterCount / 7);
    const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
    const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
    if (matchingPlanTitle) {
        if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) && (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + wordCount) {
            const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount);
            user.wordsCount = matchingPlanTitle.wordsAllowed;
            // throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
        else {
            user.wordsCount = user.wordsCount + wordCount;
        }
    }
    if (!user.subscription) {
        let limit = FREE_WORDS_LIMIT;
        if (userWordsCount < limit && limit < userWordsCount + wordCount) {
            const remainingLimit = (limit - userWordsCount);
            user.wordsCount = FREE_WORDS_LIMIT;
            // throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
        else {
            user.wordsCount = user.wordsCount + wordCount;
        }
    }
    try {
        // user.wordsCount = userWordsCount + wordCount;
        yield user.save();
    }
    catch (error) {
        console.error("Error updating wordsCount:", error);
    }
});
exports.updateStreamWordsCounter = updateStreamWordsCounter;
const verifyRemainingWords = (user, subscriptions) => __awaiter(void 0, void 0, void 0, function* () {
    const userWordsCount = (user === null || user === void 0 ? void 0 : user.wordsCount) || 0;
    const matchingPlanTitle = findMatchingPlan(user.subscription, subscriptions);
    if (matchingPlanTitle) {
        if (userWordsCount >= (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed)) {
            throw new Error("limit exceed please buy more words");
        }
        if (userWordsCount < (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) &&
            (matchingPlanTitle === null || matchingPlanTitle === void 0 ? void 0 : matchingPlanTitle.wordsAllowed) < userWordsCount + ALLOWED_WORDS_LIMIT) {
            const remainingLimit = (matchingPlanTitle.wordsAllowed - userWordsCount);
            throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
    }
    if (!user.subscription) {
        let limit = FREE_WORDS_LIMIT;
        if (userWordsCount >= limit) {
            throw new Error("Free limit exceed please buy subscription");
        }
        if (userWordsCount < limit && limit < userWordsCount + ALLOWED_WORDS_LIMIT) {
            const remainingLimit = (limit - userWordsCount);
            throw new Error(`Your remaining limit is ${remainingLimit} words.`);
        }
    }
});
exports.verifyRemainingWords = verifyRemainingWords;
//# sourceMappingURL=subscrptions.js.map