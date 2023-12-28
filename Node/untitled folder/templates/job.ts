import Redis, {RedisOptions} from 'ioredis';
import redisConfig from '../config/redis.config';

class templateNameJob {
  private static redisClient: Redis;

  static init(redisOptions: RedisOptions = redisConfig): void {
    this.redisClient = new Redis(redisOptions);
  }

  static async add(data: Record<string, unknown>): Promise<number> {
    if (!this.redisClient) {
      this.init();
    }
    return this.redisClient.lpush(redisConfig.queueName, JSON.stringify(data));
  }

  static process(): void {
    this.redisClient.blpop(redisConfig.queueName, 0, async (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const jobData = JSON.parse(data[1]);
      console.log({jobData});
      // Do something with the job data
    });
  }
}

export default templateNameJob;
