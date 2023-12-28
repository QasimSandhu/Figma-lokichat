"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT,
    databaseURL: process.env.DATABASE_URL,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtTokenExpiration: "4h",
    googleAuth: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
    },
    appleAuth: {
        clientID: process.env.APPLE_SERVICE_ID,
        teamID: process.env.APPLE_TEAM_ID,
        keyIdentifier: process.env.APPLE_KEY_IDENTIFIER,
        keyID: process.env.APPLE_KEY_ID,
    },
    chatGPT: {
        apiKey: process.env.CHATGPT_API_KEY,
        endpoint: process.env.CHATGPT_AZURE_URL,
        davinciApiKey: process.env.CHATGPT_DAVINCI_API_KEY,
        davinciApiURL: process.env.CHATGPT_DAVINCI_API_URL,
    },
    database: {
        driver: process.env.DATABASE_DRIVER
            ? process.env.DATABASE_DRIVER
            : "mongodb",
        databaseName: process.env.DATABASE_NAME
            ? process.env.DATABASE_NAME
            : "lokichat-dev",
        cosmo: {
            endPoint: process.env.COSMOS_END_POINT,
            key: process.env.COSMOS_KEY,
            databaseId: "dbLokiChat",
            containerId: "Items",
        },
        azureTranslator: {
            key: process.env.AZURE_TRANSLATOR_KEY,
            region: process.env.AZURE_TRANSLATOR_REGION,
            endPoint: process.env.AZURE_TRANSLATOR_END_POINT,
        },
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map