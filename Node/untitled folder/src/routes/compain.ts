import express from 'express';
import CompainController from '../controllers/CompainController';

const router = express.Router();

router.post('/store', CompainController.store);
router.get('/index', CompainController.index);
router.delete('/destroy/:Id', CompainController.destroy);
router.get('/indexById', CompainController.indexById);
router.get('/count', CompainController.count);
router.get('/referralList', CompainController.referralList);
router.get('/referralChart', CompainController.referralChart);
router.get('/referralGraph', CompainController.referralGraph);
router.get('/newReferralList', CompainController.newReferralList);
/////////////////Super User Routes//////////////////////////
router.get('/getTotalData', CompainController.getTotalData);
router.get('/getDashboardOverview', CompainController.getDashboardOverview);
router.get('/campaignState', CompainController.getCampaignState);
router.get('/getIncomeData', CompainController.getIncomeData);

export default router;
