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
const GoalRequest_1 = require("../requests/goal/GoalRequest");
const requestHelper_1 = require("../lib/helpers/requestHelper");
const GoalResource_1 = __importDefault(require("../resources/Goal/GoalResource"));
const GetAllGoalResources_1 = __importDefault(require("../resources/Goal/GetAllGoalResources"));
const GetGoalResources_1 = __importDefault(require("../resources/Goal/GetGoalResources"));
const GoalsService_1 = __importDefault(require("../services/GoalsService"));
const GoalStatsResource_1 = __importDefault(require("../resources/Goal/GoalStatsResource"));
class GoalsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.IndexGoalRequest, GoalsService_1.default.index, GetGoalResources_1.default);
        });
    }
    indexByPagination(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.IndexGoalRequest, GoalsService_1.default.indexByPagination, GetAllGoalResources_1.default);
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.HandleGoalRequest, GoalsService_1.default.store, GoalResource_1.default);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.ShowGoalRequest, GoalsService_1.default.show, GoalResource_1.default);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.UpdateGoalRequest, GoalsService_1.default.update, GoalResource_1.default);
        });
    }
    destroy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.DestroyGoalRequest, GoalsService_1.default.destroy, GoalResource_1.default);
        });
    }
    stats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, requestHelper_1.handleRequest)(req, res, GoalRequest_1.IndexGoalRequest, GoalsService_1.default.stats, GoalStatsResource_1.default);
        });
    }
}
exports.default = new GoalsController();
//# sourceMappingURL=GoalController.js.map