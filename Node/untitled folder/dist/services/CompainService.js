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
const User_1 = __importDefault(require("../models/User"));
const Compain_1 = __importDefault(require("../models/Compain"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const mongoose_1 = __importDefault(require("mongoose"));
const StripeAccounts_1 = __importDefault(require("../classes/StripeAccounts"));
const Transactions_1 = __importDefault(require("../models/Transactions"));
class CompainService {
    store(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const { name, description, id } = req.body;
                if (id) {
                    const updatedCompaign = yield Compain_1.default.findByIdAndUpdate(id, { title: name, description: description, creator: userId }, { new: true });
                    return (updatedCompaign);
                }
                else {
                    const generateRandomReferralCode = () => {
                        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Define the characters to use
                        const codeLength = 9; // Length of the referral code
                        let referralCode = "";
                        for (let i = 0; i < codeLength; i++) {
                            const randomIndex = Math.floor(Math.random() * characters.length);
                            referralCode += characters.charAt(randomIndex);
                        }
                        return referralCode;
                    };
                    // If 'id' is not provided, create a new compaign record
                    const newCompaign = new Compain_1.default({ title: name, description, creator: userId, referralCode: generateRandomReferralCode() });
                    const savedCompaign = yield newCompaign.save();
                    return (savedCompaign);
                }
            }
            catch (error) {
                console.log(error, "error");
                throw new Error('Error creating/updating comapaign record');
            }
        });
    }
    ;
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req;
                let { creator, page, limit, search, filter } = query;
                page = page !== null && page !== void 0 ? page : 1;
                limit = limit !== null && limit !== void 0 ? limit : 10;
                let queryObj = [{ creator: creator, isDeleted: false }];
                //@ts-ignore
                if (search)
                    queryObj.push({ title: { $regex: search, $options: 'i' } });
                if (filter) {
                    const currentDate = new Date();
                    if (filter === 'All-time') {
                        // No need to add any additional filters for "all time."
                    }
                    else if (filter === 'This-month') {
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
                        queryObj.push({
                            //@ts-ignore
                            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
                        });
                    }
                    else if (filter === 'This-year') {
                        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
                        queryObj.push({
                            //@ts-ignore
                            createdAt: { $gte: firstDayOfYear, $lte: lastDayOfYear },
                        });
                    }
                }
                const getTotalCompaginData = (id) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    try {
                        const refUsers = yield User_1.default.find({ campaignId: new mongoose_1.default.Types.ObjectId(id) });
                        let totalRevenue = 0;
                        let totalCommission = 0;
                        const rec = yield Promise.all(refUsers === null || refUsers === void 0 ? void 0 : refUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                            var _c, _d, _e;
                            if (user.firstSubscription) {
                                const curUserSub = yield Subscription_1.default.find({ "plans._id": user.firstSubscription });
                                const plan = (_d = (_c = curUserSub[0]) === null || _c === void 0 ? void 0 : _c.plans) === null || _d === void 0 ? void 0 : _d.find((it) => it._id.toString() == user.firstSubscription.toString());
                                totalRevenue += (_e = plan === null || plan === void 0 ? void 0 : plan.price) !== null && _e !== void 0 ? _e : 0;
                                totalCommission += (plan === null || plan === void 0 ? void 0 : plan.price) ? Math.floor(Number(plan === null || plan === void 0 ? void 0 : plan.price) / 5) : 0;
                            }
                        })));
                        return { totalCommission, totalRevenue };
                    }
                    catch (error) {
                        console.log(error);
                        throw new Error((_b = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error) !== null && _b !== void 0 ? _b : 'Error whil calculation of compagin.');
                    }
                });
                const records = yield Compain_1.default.find({
                    $and: queryObj,
                })
                    .sort({ _id: -1 })
                    .skip(limit * (page - 1))
                    .limit(limit);
                const recordsWithSpecificCounts = yield Promise.all(records.map((record) => __awaiter(this, void 0, void 0, function* () {
                    const campaignId = record._id; // Assuming that _id is the campaignId, adjust this if needed
                    const specificRecordCount = yield User_1.default.countDocuments({ campaignId: campaignId });
                    const dtotal = yield getTotalCompaginData(campaignId);
                    // Create a new object with the specific record count
                    return Object.assign(Object.assign({}, record.toObject()), { specificRecordCount, amount: dtotal.totalRevenue, commission: dtotal.totalCommission });
                })));
                const totalRecords = yield Compain_1.default.countDocuments({
                    $and: queryObj,
                });
                return { records: recordsWithSpecificCounts, totalRecords };
            }
            catch (error) {
                console.error(error);
                return ({ error: 'Error fetching campaigns' });
            }
        });
    }
    count(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req;
                let { creator, filter } = query;
                const currentDate = new Date();
                const queryObj = { creator: creator, isDeleted: false };
                if (filter) {
                    if (filter === 'This week') {
                        const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
                        const lastDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6, 23, 59, 59);
                        const firstDayOfPreviousWeek = new Date(firstDayOfWeek);
                        firstDayOfPreviousWeek.setDate(firstDayOfPreviousWeek.getDate() - 7);
                        const lastDayOfPreviousWeek = new Date(lastDayOfWeek);
                        lastDayOfPreviousWeek.setDate(lastDayOfPreviousWeek.getDate() - 7);
                        const currentWeekQuery = {
                            createdAt: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
                            creator: creator,
                            isDeleted: false
                        };
                        const previousWeekQuery = {
                            createdAt: { $gte: firstDayOfPreviousWeek, $lte: lastDayOfPreviousWeek },
                            creator: creator,
                            isDeleted: false
                        };
                        //@ts-ignore
                        queryObj.createdAt = currentWeekQuery;
                        // Calculate data for the previous week separately
                        const totalCampaignsCountPrevious = yield Compain_1.default.countDocuments(previousWeekQuery);
                        const userCampaignsPreviousWeek = yield Compain_1.default.find(Object.assign({ isDeleted: false }, previousWeekQuery), '_id');
                        const campaignIdsPreviousWeek = userCampaignsPreviousWeek.map((campaign) => campaign._id);
                        const usersWithSameCampaignsPrevious = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsPreviousWeek },
                        });
                        const totalCampaignsCountCurrent = yield Compain_1.default.countDocuments(currentWeekQuery);
                        const userCampaignsCurrent = yield Compain_1.default.find(Object.assign({ isDeleted: false }, currentWeekQuery), '_id');
                        const campaignIdsCurrentWeek = userCampaignsCurrent.map((campaign) => campaign._id);
                        const usersWithSameCampaignsCurrent = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsCurrentWeek },
                        });
                        return {
                            totalCampaignsCountCurrent,
                            totalCampaignsCountPrevious,
                            usersWithSameCampaignsCurrent,
                            usersWithSameCampaignsPrevious,
                        };
                    }
                    else if (filter === 'This month') {
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
                        const firstDayOfPreviousMonth = new Date(firstDayOfMonth);
                        firstDayOfPreviousMonth.setMonth(firstDayOfPreviousMonth.getMonth() - 1);
                        const lastDayOfPreviousMonth = new Date(lastDayOfMonth);
                        lastDayOfPreviousMonth.setMonth(lastDayOfPreviousMonth.getMonth() - 1);
                        const currentMonthQuery = {
                            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
                            creator: creator,
                            isDeleted: false
                        };
                        const previousMonthQuery = {
                            createdAt: { $gte: firstDayOfPreviousMonth, $lte: lastDayOfPreviousMonth },
                            creator: creator,
                            isDeleted: false
                        };
                        //@ts-ignore
                        queryObj.createdAt = currentMonthQuery;
                        const totalCampaignsCountCurrent = yield Compain_1.default.countDocuments(currentMonthQuery);
                        const userCampaignsCurrent = yield Compain_1.default.find(Object.assign({ isDeleted: false }, currentMonthQuery), '_id');
                        const campaignIdsCurrentMonth = userCampaignsCurrent.map((campaign) => campaign._id);
                        const usersWithSameCampaignsCurrent = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsCurrentMonth },
                        });
                        const totalCampaignsCountPrevious = yield Compain_1.default.countDocuments(previousMonthQuery);
                        const userCampaignsPreviousMonth = yield Compain_1.default.find(Object.assign({ isDeleted: false }, previousMonthQuery), '_id');
                        const campaignIdsPreviousMonth = userCampaignsPreviousMonth.map((campaign) => campaign._id);
                        const usersWithSameCampaignsPrevious = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsPreviousMonth },
                        });
                        return {
                            totalCampaignsCountCurrent,
                            totalCampaignsCountPrevious,
                            usersWithSameCampaignsCurrent,
                            usersWithSameCampaignsPrevious,
                        };
                    }
                    else if (filter === 'This year') {
                        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
                        const firstDayOfPreviousYear = new Date(firstDayOfYear);
                        firstDayOfPreviousYear.setFullYear(firstDayOfPreviousYear.getFullYear() - 1);
                        const lastDayOfPreviousYear = new Date(lastDayOfYear);
                        lastDayOfPreviousYear.setFullYear(lastDayOfPreviousYear.getFullYear() - 1);
                        const currentYearQuery = {
                            createdAt: { $gte: firstDayOfYear, $lte: lastDayOfYear },
                            creator: creator,
                            isDeleted: false
                        };
                        const previousYearQuery = {
                            createdAt: { $gte: firstDayOfPreviousYear, $lte: lastDayOfPreviousYear },
                            creator: creator,
                            isDeleted: false
                        };
                        //@ts-ignore
                        queryObj.createdAt = currentYearQuery;
                        const totalCampaignsCountCurrent = yield Compain_1.default.countDocuments(currentYearQuery);
                        const userCampaignsCurrentYear = yield Compain_1.default.find(Object.assign({ isDeleted: false }, currentYearQuery), '_id');
                        const campaignIdsCurrentYear = userCampaignsCurrentYear.map((campaign) => campaign._id);
                        const usersWithSameCampaignsCurrent = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsCurrentYear },
                        });
                        const totalCampaignsCountPrevious = yield Compain_1.default.countDocuments(previousYearQuery);
                        const userCampaignsPrevious = yield Compain_1.default.find(previousYearQuery, '_id');
                        const campaignIdsPreviousYear = userCampaignsPrevious.map((campaign) => campaign._id);
                        const usersWithSameCampaignsPrevious = yield User_1.default.countDocuments({
                            campaignId: { $in: campaignIdsPreviousYear },
                        });
                        return {
                            totalCampaignsCountCurrent,
                            totalCampaignsCountPrevious,
                            usersWithSameCampaignsCurrent,
                            usersWithSameCampaignsPrevious,
                        };
                    }
                    else {
                        return { error: 'Invalid filter specified' };
                    }
                }
                const totalCampaignsCount = yield Compain_1.default.countDocuments(queryObj);
                const userCampaigns = yield Compain_1.default.find(queryObj, '_id');
                const campaignIds = userCampaigns.map((campaign) => campaign._id);
                const usersWithSameCampaigns = yield User_1.default.countDocuments({
                    campaignId: { $in: campaignIds },
                });
                return {
                    totalCampaignsCount,
                    usersWithSameCampaigns,
                };
            }
            catch (error) {
                console.error(error);
                return { error: 'Internal server error' };
            }
        });
    }
    destroy(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            if (!Id)
                throw new Error("Campaign ID is required");
            const campiagn = yield Compain_1.default.findById(Id);
            if (!campiagn)
                throw new Error("No Campaign found with this ID.");
            // Instead of deleting the campaign, update the isDeleted flag to true
            campiagn.isDeleted = true;
            // Save the updated campaign document
            const updateCampiagn = yield campiagn.save();
            return updateCampiagn;
        });
    }
    indexById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { campaignId, page, limit, search } = req.query;
                const currentPage = page ? parseInt(page) : 1;
                const recordsPerPage = limit ? parseInt(limit) : 10;
                const campaign = yield Compain_1.default.findById(campaignId);
                // Find users with the specified campaignId in their records
                const users = yield User_1.default.find({ campaignId: campaignId }).select('userName email');
                if (users.length === 0) {
                    // return res.status(404).json({ error: 'No users found with the specified campaign ID' });
                }
                const userIDs = users.map(user => user._id);
                const userSearchCriteria = {
                    _id: { $in: userIDs }
                };
                if (search && search.trim() !== '') {
                    userSearchCriteria['$or'] = [
                        { userName: { $regex: new RegExp(search, 'i') } },
                        { email: { $regex: new RegExp(search, 'i') } }
                    ];
                }
                const totalRecords = yield User_1.default.countDocuments(userSearchCriteria);
                const records = yield User_1.default.find(userSearchCriteria).select('userName email subscription firstSubscription profileUrl')
                    .sort({ _id: -1 })
                    .skip(recordsPerPage * (currentPage - 1))
                    .limit(recordsPerPage);
                const records1 = yield Promise.all(records.map((i) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (i.firstSubscription) {
                        const sub = yield Subscription_1.default.find({ "plans._id": i.firstSubscription });
                        const plan = (_a = sub[0].plans) === null || _a === void 0 ? void 0 : _a.find((it) => it._id.toString() == i.firstSubscription.toString());
                        return Object.assign(Object.assign({}, i._doc), { amount: plan === null || plan === void 0 ? void 0 : plan.price, commission: Math.floor(Number(plan === null || plan === void 0 ? void 0 : plan.price) / 5) });
                    }
                    else {
                        return Object.assign(Object.assign({}, i._doc), { amount: 0, commission: 0 });
                    }
                })));
                return ({ records: records1, totalRecords, campaign });
            }
            catch (error) {
                console.log(error);
                throw Error('Error fetching campaigns');
            }
        });
    }
    referralList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { creator, page, limit, search, filter } = req.query;
                const currentPage = page ? parseInt(page) : 1;
                const recordsPerPage = limit ? parseInt(limit) : 10;
                // Find campaigns created by the specified user
                const campaigns = yield Compain_1.default.find({ creator: creator });
                if (campaigns.length === 0) {
                    return { error: 'No campaigns found with the specified user ID' };
                }
                const campaignIDs = campaigns.map(campaign => campaign._id);
                // Find users associated with the found campaign IDs
                const userSearchCriteria = {
                    campaignId: { $in: campaignIDs }
                };
                if (search && search.trim() !== '') {
                    userSearchCriteria['$or'] = [
                        { userName: { $regex: new RegExp(search, 'i') } },
                        { email: { $regex: new RegExp(search, 'i') } }
                    ];
                }
                if (filter) {
                    const currentDate = new Date();
                    if (filter === 'All-time') {
                    }
                    else if (filter === 'This-month') {
                        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
                        userSearchCriteria.createdAt = {
                            $gte: firstDayOfMonth,
                            $lte: lastDayOfMonth
                        };
                    }
                    else if (filter === 'This-year') {
                        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                        const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
                        userSearchCriteria.createdAt = {
                            $gte: firstDayOfYear,
                            $lte: lastDayOfYear
                        };
                    }
                }
                const totalRecords = yield User_1.default.countDocuments(userSearchCriteria);
                const records = yield User_1.default.find(userSearchCriteria)
                    .select('userName email subscription firstSubscription profileUrl campaignId')
                    .populate({
                    path: 'campaignId',
                    select: 'title',
                    model: 'Compain'
                })
                    .sort({ _id: -1 })
                    .skip(recordsPerPage * (currentPage - 1))
                    .limit(recordsPerPage);
                const records1 = yield Promise.all(records.map((i) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    if (i === null || i === void 0 ? void 0 : i.firstSubscription) {
                        const sub = yield Subscription_1.default.find({ "plans._id": i.firstSubscription });
                        const plan = (_a = sub[0].plans) === null || _a === void 0 ? void 0 : _a.find((it) => it._id.toString() == i.firstSubscription.toString());
                        return Object.assign(Object.assign({}, i._doc), { amount: plan === null || plan === void 0 ? void 0 : plan.price, commission: Math.floor(Number(plan === null || plan === void 0 ? void 0 : plan.price) / 5) });
                    }
                    else {
                        return Object.assign(Object.assign({}, i._doc), { amount: 0, commission: 0 });
                    }
                })));
                return { records: records1, totalRecords };
            }
            catch (error) {
                console.log(error);
                throw new Error('Error fetching campaigns');
            }
        });
    }
    referralChart(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { creator, filter } = req.query;
            try {
                const dateRange = [];
                const currentDate = new Date();
                if (filter === "Last 7 days") {
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(currentDate.getDate() - i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else if (filter === "This month") {
                    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                    for (let i = 0; i <= lastDayOfMonth.getDate(); i++) {
                        const date = new Date(firstDayOfMonth);
                        date.setDate(firstDayOfMonth.getDate() + i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else if (filter === "This year") {
                    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                    for (let i = 0; i <= currentDate.getMonth(); i++) {
                        const date = new Date(firstDayOfYear);
                        date.setMonth(firstDayOfYear.getMonth() + i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else {
                    // Handle unsupported filter values
                    return { error: 'Unsupported filter value' };
                }
                const chartData = {};
                // Find campaigns with the specified creator
                const campaigns = yield Compain_1.default.find({ creator: creator });
                // Implement a function to retrieve the campaign title by campaignId
                const getCampaignTitle = (campaignId) => __awaiter(this, void 0, void 0, function* () {
                    const campaign = yield Compain_1.default.findById(campaignId);
                    return campaign ? campaign.title : 'Unknown Campaign';
                });
                // Loop through the date range and find user counts for each campaign
                for (const date of dateRange) {
                    const graphUsers = yield User_1.default.aggregate([
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(date),
                                    $lt: new Date(date + "T23:59:59.999Z"),
                                },
                                campaignId: { $in: campaigns.map(campaign => campaign._id) }
                            },
                        },
                        {
                            $group: {
                                _id: '$campaignId',
                                count: { $sum: 1 },
                            },
                        },
                    ]);
                    // Process graphUsers to build the chart data for the specific date
                    const dataForDate = yield Promise.all(graphUsers.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const campaignTitle = yield getCampaignTitle(item._id);
                        return {
                            campaignTitle,
                            userCount: item.count,
                        };
                    })));
                    chartData[date] = dataForDate;
                }
                return { chartData };
            }
            catch (error) {
                console.error(error);
                return { error: 'Error finding campaigns and counting users' };
            }
        });
    }
    referralGraph(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { creator, filter } = req.query;
            try {
                const dateRange = [];
                const currentDate = new Date();
                if (filter === "Last 7 days") {
                    for (let i = 7; i >= 0; i--) { // Include today's date
                        const d = new Date();
                        d.setDate(currentDate.getDate() - i);
                        dateRange.push(d);
                    }
                }
                else if (filter === "Last 14 days") {
                    for (let i = 14; i >= 0; i--) { // Include today's date
                        const d = new Date();
                        d.setDate(currentDate.getDate() - i);
                        dateRange.push(d);
                    }
                }
                else if (filter === "Last 28 days") {
                    for (let i = 28; i >= 0; i--) { // Include today's date
                        const d = new Date();
                        d.setDate(currentDate.getDate() - i);
                        dateRange.push(d);
                    }
                }
                else {
                    return { error: 'Unsupported filter value' };
                }
                // Find campaigns with the specified creator
                const campaigns = yield Compain_1.default.find({ creator: creator });
                const userCounts = [];
                let totalReferrals = 0; // Initialize totalReferrals
                let todayReferrals = 0; // Initialize today's referral count
                console.log(dateRange, " ===> dateRange");
                for (const date of dateRange) {
                    const nextDay = new Date(date);
                    // nextDay.setDate(nextDay.getDate() + 1); // Calculate the next day
                    // nextDay.setHours(0, 0, 0, 0); // Set the time to the beginning of the next day
                    const count = yield User_1.default.countDocuments({
                        createdAt: {
                            // $gte: date,
                            // $lt: nextDay,
                            $gte: nextDay.setHours(0, 0, 0, 0),
                            $lt: nextDay.setHours(23, 59, 59, 0),
                        },
                        campaignId: { $in: campaigns.map(campaign => campaign._id) },
                    });
                    userCounts.push({
                        date: date.toISOString().split("T")[0],
                        User: count,
                    });
                    totalReferrals += count;
                    if (date.toDateString() === currentDate.toDateString()) {
                        todayReferrals = count;
                    }
                }
                return { data: userCounts, totalReferrals, todayReferrals };
            }
            catch (error) {
                console.error(error);
                return { error: 'Error finding campaigns and counting users' };
            }
        });
    }
    newReferralList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { creator } = req.query;
                // Calculate the start and end of today's date
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Start of the day
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999); // End of the day
                // Find campaigns created by the specified user
                const campaigns = yield Compain_1.default.find({ creator: creator });
                if (campaigns.length === 0) {
                    return { error: 'No campaigns found with the specified user ID' };
                }
                const campaignIDs = campaigns.map(campaign => campaign._id);
                // Find users associated with the found campaign IDs
                const userSearchCriteria = {
                    campaignId: { $in: campaignIDs },
                    createdAt: {
                        $gte: today,
                        $lte: endOfDay
                    }
                };
                const records = yield User_1.default.find(userSearchCriteria)
                    .select('userName email subscription profileUrl campaignId')
                    .populate({
                    path: 'campaignId',
                    select: 'title',
                    model: 'Compain'
                })
                    .sort({ _id: -1 })
                    .limit(5);
                return { records };
            }
            catch (error) {
                console.log(error);
                throw new Error('Error fetching campaigns');
            }
        });
    }
    getTotalData(req) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const totalCampaigns = (yield Compain_1.default.find({ creator: new mongoose_1.default.Types.ObjectId(userId) })).map((i) => (new mongoose_1.default.Types.ObjectId(i === null || i === void 0 ? void 0 : i._id)));
                const totalRefferals = yield User_1.default.find({ campaignId: { $in: totalCampaigns } }).count();
                const getTotalCompaginData = (allCampaigns) => __awaiter(this, void 0, void 0, function* () {
                    var _d, _e;
                    try {
                        const refUsers = yield User_1.default.find({ campaignId: { $in: allCampaigns } });
                        let totalRevenue = 0;
                        let totalCommission = 0;
                        const rec = yield Promise.all(refUsers === null || refUsers === void 0 ? void 0 : refUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                            var _f, _g, _h;
                            if (user.firstSubscription) {
                                const curUserSub = yield Subscription_1.default.find({ "plans._id": user.firstSubscription });
                                const plan = (_g = (_f = curUserSub[0]) === null || _f === void 0 ? void 0 : _f.plans) === null || _g === void 0 ? void 0 : _g.find((it) => it._id.toString() == user.firstSubscription.toString());
                                totalRevenue += (_h = plan === null || plan === void 0 ? void 0 : plan.price) !== null && _h !== void 0 ? _h : 0;
                                totalCommission += (plan === null || plan === void 0 ? void 0 : plan.price) ? Math.floor(Number(plan === null || plan === void 0 ? void 0 : plan.price) / 5) : 0;
                            }
                        })));
                        return { totalCommission, totalRevenue };
                    }
                    catch (error) {
                        console.log(error);
                        throw new Error((_e = (_d = error === null || error === void 0 ? void 0 : error.message) !== null && _d !== void 0 ? _d : error) !== null && _e !== void 0 ? _e : 'Error whil calculation of compagin.');
                    }
                });
                const { totalCommission, totalRevenue } = yield getTotalCompaginData(totalCampaigns);
                const totalCampaignsCount = (yield Compain_1.default.find({ creator: new mongoose_1.default.Types.ObjectId(userId), isDeleted: { $ne: true } }));
                return ({ totalCompaigns: (_a = totalCampaignsCount === null || totalCampaignsCount === void 0 ? void 0 : totalCampaignsCount.length) !== null && _a !== void 0 ? _a : 0, totalRefferals, totalCommission, totalRevenue });
            }
            catch (error) {
                console.log(error);
                throw Error((_c = (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : error) !== null && _c !== void 0 ? _c : 'Error while fetching data');
            }
        });
    }
    getDashboardOverview(req) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { creator, filter } = req.query;
            try {
                const dateRange = [];
                const currentDate = new Date();
                let minDate;
                if (filter === "This week") {
                    for (let i = currentDate.getDay(); i >= 0; i--) {
                        const date = new Date();
                        date.setDate(currentDate.getDate() - i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                    minDate = new Date().setDate(currentDate.getDate() - currentDate.getDay());
                }
                else if (filter === "This month") {
                    const firstDayOfMonth = new Date(new Date().setFullYear(currentDate.getFullYear(), currentDate.getMonth(), 1));
                    for (let i = 0; i <= currentDate.getDate(); i++) { // Include today's date
                        const date = new Date(firstDayOfMonth);
                        date.setDate(firstDayOfMonth.getDate() + i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                    minDate = new Date(new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), 1)).setHours(0, 0, 0);
                }
                else if (filter === "This year") {
                    const firstDayOfYear = new Date(new Date().setFullYear(currentDate.getFullYear(), 0, 1));
                    for (let i = 0; i <= currentDate.getMonth(); i++) {
                        const date = new Date(firstDayOfYear);
                        date.setMonth(firstDayOfYear.getMonth() + i);
                        console.log(date, " ===> each date");
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                    minDate = new Date().setFullYear(new Date().getFullYear(), 1, 1);
                    console.log(dateRange, " yearl date range");
                }
                else {
                    // Handle unsupported filter values
                    return { error: 'Unsupported filter value' };
                }
                var chartData = [];
                // Find campaigns with the specified creator
                const campaigns = yield Compain_1.default.find({ creator: new mongoose_1.default.Types.ObjectId(userId) });
                // Implement a function to retrieve the campaign title by campaignId
                const getCampaignTitle = (campaignId) => __awaiter(this, void 0, void 0, function* () {
                    const campaign = yield Compain_1.default.findById(campaignId);
                    return campaign ? campaign.title : 'Unknown Campaign';
                });
                // Loop through the date range and find user counts for each campaign
                for (const date of dateRange) {
                    const yearStartDate = new Date(new Date(date).setDate(1)).setHours(0, 0, 0, 0);
                    const yearEndDate = new Date(new Date(date).setDate(31)).setHours(23, 59, 59);
                    const graphUsers = yield User_1.default.aggregate([
                        {
                            $match: {
                                createdAt: {
                                    $gte: filter === "This year" ? new Date(yearStartDate) : new Date(date),
                                    $lt: filter === "This year" ? new Date(yearEndDate) : new Date(date + "T23:59:59.999Z"),
                                },
                                campaignId: { $in: campaigns.map(campaign => campaign._id) }
                            },
                        },
                        // {
                        //   $group: {
                        //     _id: '$campaignId',
                        //     count: { $sum: 1 },
                        //   },
                        // },
                    ]);
                    console.log(new Date(yearStartDate).toString(), new Date(yearEndDate).toString(), " ===> graph users");
                    let dateCommission = 0;
                    // Process graphUsers to build the chart data for the specific date
                    const dataForDate = yield Promise.all(graphUsers.map((i) => __awaiter(this, void 0, void 0, function* () {
                        var _d, _e, _f;
                        const sub = yield Subscription_1.default.find({ "plans._id": i.firstSubscription });
                        if (!sub || !((_d = sub[0]) === null || _d === void 0 ? void 0 : _d.plans)) {
                            dateCommission += 0;
                        }
                        else {
                            const planPrice = (_f = (_e = sub[0].plans) === null || _e === void 0 ? void 0 : _e.find((it) => it._id.toString() == i.firstSubscription.toString())) === null || _f === void 0 ? void 0 : _f.price;
                            dateCommission += Math.floor(Number(planPrice) / 5);
                        }
                    })));
                    const key = filter == 'This week' ? new Date(date).toDateString().substring(0, 3) : filter == 'This month' ? date : filter == 'This year' ? new Date(date).toDateString().substring(4, 7) : 'unknown';
                    // chartData[key] = dateCommission;
                    chartData.push({
                        name: key,
                        earning: dateCommission
                    });
                }
                var totalCommission = 0;
                const refferals = yield User_1.default.find({ campaignId: { $in: campaigns.map(campaign => campaign._id) }, createdAt: { $gte: new Date(minDate), $lte: new Date() } });
                for (let i = 0; i < refferals.length; i++) {
                    const sub = yield Subscription_1.default.find({ "plans._id": refferals[i].firstSubscription });
                    if (!sub || !((_a = sub[0]) === null || _a === void 0 ? void 0 : _a.plans)) {
                        totalCommission += 0;
                    }
                    else {
                        const planPrice = (_c = (_b = sub[0].plans) === null || _b === void 0 ? void 0 : _b.find((it) => it._id.toString() == refferals[i].firstSubscription.toString())) === null || _c === void 0 ? void 0 : _c.price;
                        totalCommission += Math.floor(Number(planPrice) / 5);
                    }
                }
                const campaignsCount = yield Compain_1.default.find({ creator: new mongoose_1.default.Types.ObjectId(userId), isDeleted: { $ne: true }, createdAt: { $gte: new Date(minDate), $lte: new Date() } });
                return { commisionGraphData: chartData, refferals: refferals === null || refferals === void 0 ? void 0 : refferals.length, commision: totalCommission, campaigns: campaignsCount.length };
            }
            catch (error) {
                console.error(error);
                return { error: 'Error finding campaigns and counting users' };
            }
        });
    }
    getDashboardOverview1(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req;
            const { creator, filter } = req.query;
            try {
                const dateRange = [];
                const currentDate = new Date();
                if (filter === "Last 7 days") {
                    for (let i = currentDate.getDay(); i >= 0; i--) {
                        const date = new Date();
                        date.setDate(currentDate.getDate() - i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else if (filter === "This month") {
                    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    for (let i = 0; i <= currentDate.getDate(); i++) { // Include today's date
                        const date = new Date(firstDayOfMonth);
                        date.setDate(firstDayOfMonth.getDate() + i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else if (filter === "This year") {
                    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
                    for (let i = 0; i <= currentDate.getMonth(); i++) {
                        const date = new Date(firstDayOfYear);
                        date.setMonth(firstDayOfYear.getMonth() + i);
                        dateRange.push(date.toISOString().split("T")[0]);
                    }
                }
                else {
                    // Handle unsupported filter values
                    return { error: 'Unsupported filter value' };
                }
                const chartData = {};
                // Find campaigns with the specified creator
                const campaigns = yield Compain_1.default.find({ creator: creator });
                // Implement a function to retrieve the campaign title by campaignId
                const getCampaignTitle = (campaignId) => __awaiter(this, void 0, void 0, function* () {
                    const campaign = yield Compain_1.default.findById(campaignId);
                    return campaign ? campaign.title : 'Unknown Campaign';
                });
                // Loop through the date range and find user counts for each campaign
                for (const date of dateRange) {
                    const graphUsers = yield User_1.default.aggregate([
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(date),
                                    $lt: new Date(date + "T23:59:59.999Z"),
                                },
                                campaignId: { $in: campaigns.map(campaign => campaign._id) }
                            },
                        },
                        {
                            $group: {
                                _id: '$campaignId',
                                count: { $sum: 1 },
                            },
                        },
                    ]);
                    // Process graphUsers to build the chart data for the specific date
                    const dataForDate = yield Promise.all(graphUsers.map((item) => __awaiter(this, void 0, void 0, function* () {
                        const campaignTitle = yield getCampaignTitle(item._id);
                        return {
                            campaignTitle,
                            userCount: item.count,
                        };
                    })));
                    chartData[date] = dataForDate;
                }
                return { chartData };
            }
            catch (error) {
                console.error(error);
                return { error: 'Error finding campaigns and counting users' };
            }
        });
    }
    getCampaignState(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const campaigns = yield Compain_1.default.find({ creator: new mongoose_1.default.Types.ObjectId(userId), isDeleted: { $ne: true } });
                const data = Promise.all(campaigns.map((it) => __awaiter(this, void 0, void 0, function* () {
                    const users = yield User_1.default.find({ campaignId: new mongoose_1.default.Types.ObjectId(it === null || it === void 0 ? void 0 : it._id) });
                    return {
                        name: it === null || it === void 0 ? void 0 : it.title,
                        views: users.length
                    };
                })));
                return data;
            }
            catch (error) {
                console.log(error);
                throw new Error('Error fetching campaigns');
            }
        });
    }
    getIncomeDate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req;
                const reqUser = yield User_1.default.findById(userId);
                const connectAccountId = reqUser.stripeConnectAccountId;
                const balance = yield StripeAccounts_1.default.getBalance(connectAccountId);
                const deleiveredTransactions = yield Transactions_1.default.find({
                    deliveryStatus: 'Completed',
                    referralSuperUser: new mongoose_1.default.Types.ObjectId(userId)
                });
                const recectDeleiveryStatus = yield Transactions_1.default.find({
                    deliveryStatus: 'Completed',
                    referralSuperUser: new mongoose_1.default.Types.ObjectId(userId)
                }).sort({ _id: -1 }).limit(1);
                const getSingleSubscriptionPrice = (id) => __awaiter(this, void 0, void 0, function* () {
                    var _b, _c;
                    if (!id)
                        return 0;
                    const sub = yield Subscription_1.default.find({ "plans._id": id });
                    const planPrice = (_c = (_b = sub[0].plans) === null || _b === void 0 ? void 0 : _b.find((it) => it._id.toString() == id.toString())) === null || _c === void 0 ? void 0 : _c.price;
                    return Math.floor(Number(planPrice) / 5);
                });
                const getPriceOfSupscription = (subId) => __awaiter(this, void 0, void 0, function* () {
                    let totalPrice = 0;
                    if (Array.isArray(subId) && subId.length > 0) {
                        for (let i = 0; i < subId.length; i++) {
                            const singlePrice = yield getSingleSubscriptionPrice(subId[i]);
                            totalPrice += singlePrice;
                        }
                    }
                    else if (subId.length > 0) {
                        totalPrice = yield getSingleSubscriptionPrice(subId);
                    }
                    else {
                        return 0;
                    }
                    return totalPrice;
                });
                const onlySubIdArr = deleiveredTransactions.map((i) => i.plan);
                const totalWithDrawl = (onlySubIdArr === null || onlySubIdArr === void 0 ? void 0 : onlySubIdArr.length) > 0 ? yield getPriceOfSupscription(onlySubIdArr) : 0;
                const recentWithDrawl = ((_a = recectDeleiveryStatus[0]) === null || _a === void 0 ? void 0 : _a.plan) ? yield getPriceOfSupscription(recectDeleiveryStatus[0].plan.toString()) : 0;
                return {
                    availableBalance: balance.available[0].amount,
                    totalWithDrawn: totalWithDrawl,
                    recentWithdrawn: recentWithDrawl
                };
            }
            catch (error) {
                console.log(error);
                throw new Error('Error fetching campaigns');
            }
        });
    }
}
exports.default = new CompainService();
//# sourceMappingURL=CompainService.js.map