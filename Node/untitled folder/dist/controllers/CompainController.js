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
const requestHelper_1 = require("../lib/helpers/requestHelper");
const CompainService_1 = __importDefault(require("../services/CompainService"));
const HandleCompaignResource_1 = __importDefault(require("../resources/Compaign/HandleCompaignResource"));
const HandleCompaignCreateResource_1 = __importDefault(require("../resources/Compaign/HandleCompaignCreateResource"));
class CompainController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.store, HandleCompaignCreateResource_1.default);
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.index, HandleCompaignResource_1.default);
        });
    }
    count(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.count, HandleCompaignResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.destroy, HandleCompaignResource_1.default);
        });
    }
    indexById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.indexById, HandleCompaignResource_1.default);
        });
    }
    referralList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.referralList, HandleCompaignResource_1.default);
        });
    }
    referralChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.referralChart, HandleCompaignResource_1.default);
        });
    }
    referralGraph(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.referralGraph, HandleCompaignResource_1.default);
        });
    }
    newReferralList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.newReferralList, HandleCompaignResource_1.default);
        });
    }
    //////////////////Super User Data////////////////////////////////////
    getTotalData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.getTotalData, null);
        });
    }
    getDashboardOverview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.getDashboardOverview, null);
        });
    }
    getCampaignState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.getCampaignState, null);
        });
    }
    getIncomeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, null, CompainService_1.default.getIncomeDate, null);
        });
    }
}
exports.default = new CompainController();
//# sourceMappingURL=CompainController.js.map