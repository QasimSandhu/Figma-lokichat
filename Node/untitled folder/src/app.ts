import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import { createServer } from 'http';
import passport from 'passport';
import './config/passport.config';
import flash from 'connect-flash';
import router from './routes/api';
import config from './config/config';
import corsConfig from './config/cors.config';
import { setupSocketIO } from './classes/SocketIO';
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import './jobs/GoalNotifications';
import jobs from './jobs/GoalNotifications';

const scheduleKernelPath = './schedules/kernal';
if (fs.existsSync(scheduleKernelPath)) {
  import(scheduleKernelPath);
}

const observerKernelPath = './observers/kernal';
if (fs.existsSync(observerKernelPath)) {
  import(observerKernelPath);
}

import httpResponseMiddleware from './middleware/HttpResponseMiddleware';
import { resetExpiraySubscriptionCrone } from './referralCrone';
import { resetPlanData } from './renewPlanCrone';

const port: any = config.port;
const app = express();

if(config.database.driver == 'mongodb'){
  mongoose.set('strictQuery', false);
  async function startServer() {
    await mongoose.connect(config.databaseURL as any, {
      // useNewUrlParser: true,
      dbName: config.database.databaseName,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    } as any);
    console.log('Connected to MongoDB successfully!');
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
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

app.use(httpResponseMiddleware);
app.use(compression());
app.use(flash());

// app.use(express.json({ limit: '100mb' }));
// app.use(express.raw({ limit: '100mb' }));
// app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.raw({limit: '1000mb'}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true, parameterLimit: 1000000}));
app.use(express.json());

app.use(session({
  secret: config.jwtSecretKey,
  resave: true,
  saveUninitialized: true
}));

app.use(cors(corsConfig));

app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res) => {
  res.send('Welcome to NodeJs server-staging.');
});

app.use('/jobs', jobs);

app.use('/api', router);

app.get('/getUser', (req, res) => {
  res.status(200).json({status: 'OK'});
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status_code: 404,
    message: "Oops! The requested resource was not found on this server."
  });
});
//crone jobs
resetExpiraySubscriptionCrone()
resetPlanData()

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

const httpServer = createServer(app);

setupSocketIO(httpServer);

app.set('port', port);

httpServer.listen(port, '0.0.0.0', () => {
  return console.log(`Express is listening at http://localhost:${config.port}`);
});

httpServer.timeout = 6000000 // 1hour