"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = exports.redisClient = void 0;
const redis_1 = require("redis");
// Create a Redis client
const redisClient = (0, redis_1.createClient)({
    url: 'redis://127.0.0.1:6379'
});
exports.redisClient = redisClient;
// Handle Redis connection events (optional)
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', (err) => {
    console.error(`Redis Error: ${err}`);
});
function closeRedisConnection() {
    redisClient.quit();
}
exports.closeRedisConnection = closeRedisConnection;
//# sourceMappingURL=redis.connection.js.map