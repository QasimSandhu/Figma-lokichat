"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
require("./config/passport.config");
const connect_flash_1 = __importDefault(require("connect-flash"));
const api_1 = __importDefault(require("./routes/api"));
const config_1 = __importDefault(require("./config/config"));
const cors_config_1 = __importDefault(require("./config/cors.config"));
const SocketIO_1 = require("./classes/SocketIO");
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
require("./jobs/GoalNotifications");
const GoalNotifications_1 = __importDefault(require("./jobs/GoalNotifications"));
const scheduleKernelPath = './schedules/kernal';
if (fs_1.default.existsSync(scheduleKernelPath)) {
    _a = scheduleKernelPath, Promise.resolve().then(() => __importStar(require(_a)));
}
const observerKernelPath = './observers/kernal';
if (fs_1.default.existsSync(observerKernelPath)) {
    _b = observerKernelPath, Promise.resolve().then(() => __importStar(require(_b)));
}
const HttpResponseMiddleware_1 = __importDefault(require("./middleware/HttpResponseMiddleware"));
const referralCrone_1 = require("./referralCrone");
const renewPlanCrone_1 = require("./renewPlanCrone");
const port = config_1.default.port;
const app = (0, express_1.default)();
if (config_1.default.database.driver == 'mongodb') {
    mongoose_1.default.set('strictQuery', false);
    function startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongoose_1.default.connect(config_1.default.databaseURL, {
                // useNewUrlParser: true,
                dbName: config_1.default.database.databaseName,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 30000,
            });
            console.log('Connected to MongoDB successfully!');
        });
    }
    startServer();
}
Sentry.init({
    dsn: 'https://d550342e00f21b155a952bd236bec10d@o4506239524012032.ingest.sentry.io/4506267954774016',
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        new profiling_node_1.ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});
app.use(HttpResponseMiddleware_1.default);
app.use((0, compression_1.default)());
app.use((0, connect_flash_1.default)());
// app.use(express.json({ limit: '100mb' }));
// app.use(express.raw({ limit: '100mb' }));
// app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(body_parser_1.default.json({ limit: '1000mb' }));
app.use(body_parser_1.default.raw({ limit: '1000mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '1000mb', extended: true, parameterLimit: 1000000 }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: config_1.default.jwtSecretKey,
    resave: true,
    saveUninitialized: true
}));
app.use((0, cors_1.default)(cors_config_1.default));
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs server-staging.');
});
app.use('/jobs', GoalNotifications_1.default);
app.use('/api', api_1.default);
app.get('/getUser', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status_code: 404,
        message: "Oops! The requested resource was not found on this server."
    });
});
//crone jobs
(0, referralCrone_1.resetExpiraySubscriptionCrone)();
(0, renewPlanCrone_1.resetPlanData)();
// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
const httpServer = (0, http_1.createServer)(app);
(0, SocketIO_1.setupSocketIO)(httpServer);
app.set('port', port);
httpServer.listen(port, '0.0.0.0', () => {
    return console.log(`Express is listening at http://localhost:${config_1.default.port}`);
});
httpServer.timeout = 6000000; // 1hour
//# sourceMappingURL=app.js.map