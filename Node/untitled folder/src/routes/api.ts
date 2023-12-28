import express from "express";
import AuthMiddleware from "../middleware/AuthMiddleware";
import chatRoutes from "./chat";
import notebookRoutes from "./notebook";
import authRoutes from "./auth";
import audioRoutes from "./audio";
import voiceListsRoutes from "./voiceLists";
import audioLibraryRoutes from "./audioLibrary";
import profileRoutes from "./profile";
import subscriptions from "./subscription";
import photoGenerationRoutes from "./photoGeneration";
import imageLibraryRoutes from "./imageLibrary";
import goalManagementRoutes from "./goal";
import devicesRoutes from "./devices";
import buyMoreRoutes from "./buyMorePackage";
import translationRuotes from './documentTranslation';
import summaryRoutes from './documentSummary';
import superUserRoutes from './superUser';
import chatTestRoutes from './chatTestRoutes';
import chatListRoutes from './chatListRoutes';
import compaignRoutes from "./compain";
import notificationsRoutes from './notifications';
import stripeRoutes from './stripe'
import stripeWebhookRoute from './stripeWebhook'
import debateRoutes from './debate';
import swaggerUi from "swagger-ui-express";
import SwaggerDocumentation from "../swagger.json";
import SubscriptionController from "../controllers/SubscriptionController";
import LanguageLstRoutes from "./languageList";
import InvitedSuperUser from "./invitedSuperUser";

const router = express.Router();

router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(SwaggerDocumentation, { explorer: true })
);
router.use("/stripeWebhooks", stripeWebhookRoute);
router.use("/chatTest", chatTestRoutes);
router.use("/auth", authRoutes);
router.get('/subscriptions/index', SubscriptionController.index);

router.use(AuthMiddleware.isLoggedIn);
router.use("/audio", audioRoutes);
router.use("/chats", chatRoutes);
router.use("/chat-list", chatListRoutes);
router.use("/notebook", notebookRoutes);
router.use("/voices-list", voiceListsRoutes);
router.use("/audio-library", audioLibraryRoutes);
router.use("/profile", profileRoutes);
router.use("/subscriptions", subscriptions);
router.use("/photo-generation", photoGenerationRoutes);
router.use("/image-library", imageLibraryRoutes);
router.use("/goal", goalManagementRoutes);
router.use("/device", devicesRoutes);
router.use("/buy-more", buyMoreRoutes);
router.use("/document-translation", translationRuotes);
router.use("/document-summary", summaryRoutes);
router.use("/super-user", superUserRoutes);
router.use("/compaign", compaignRoutes);
router.use("/notification", notificationsRoutes);
router.use("/stripe", stripeRoutes);
router.use("/debate", debateRoutes);
router.use("/language-List", LanguageLstRoutes);
router.use("/invite", InvitedSuperUser);




export default router;
