export interface IRedisConfig {
  host: string;
  port: number;
  queueName: string;
}

const redisConfig: IRedisConfig = {
  host: 'localhost',
  port: 6379,
  queueName: 'my-queue',
};

export default redisConfig;