"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CompainController_1 = __importDefault(require("../controllers/CompainController"));
const router = express_1.default.Router();
router.post('/store', CompainController_1.default.store);
router.get('/index', CompainController_1.default.index);
router.delete('/destroy/:Id', CompainController_1.default.destroy);
router.get('/indexById', CompainController_1.default.indexById);
router.get('/count', CompainController_1.default.count);
router.get('/referralList', CompainController_1.default.referralList);
router.get('/referralChart', CompainController_1.default.referralChart);
router.get('/referralGraph', CompainController_1.default.referralGraph);
router.get('/newReferralList', CompainController_1.default.newReferralList);
/////////////////Super User Routes//////////////////////////
router.get('/getTotalData', CompainController_1.default.getTotalData);
router.get('/getDashboardOverview', CompainController_1.default.getDashboardOverview);
router.get('/campaignState', CompainController_1.default.getCampaignState);
router.get('/getIncomeData', CompainController_1.default.getIncomeData);
exports.default = router;
//# sourceMappingURL=compain.js.map