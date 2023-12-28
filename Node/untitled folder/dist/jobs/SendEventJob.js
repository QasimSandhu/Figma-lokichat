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
const ioredis_1 = __importDefault(require("ioredis"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
class SendEventJob {
    static init(redisOptions = redis_config_1.default) {
        this.redisClient = new ioredis_1.default(redisOptions);
    }
    static add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.redisClient) {
                this.init();
            }
            return this.redisClient.lpush(redis_config_1.default.queueName, JSON.stringify(data));
        });
    }
    static process() {
        this.redisClient.blpop(redis_config_1.default.queueName, 0, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.error(err);
                return;
            }
            const jobData = JSON.parse(data[1]);
            console.log({ jobData });
            // Do something with the job data
        }));
    }
}
exports.default = SendEventJob;
//# sourceMappingURL=SendEventJob.js.map