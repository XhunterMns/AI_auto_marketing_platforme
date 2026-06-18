const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const campaignQueue = new Queue("campaignQueue", {
  connection,
  defaultJobOptions: {
    attempts: 5,                       // retry failed jobs (e.g. Telegram 429)
    backoff: { type: "exponential", delay: 5000 }, // 5s, 10s, 20s, 40s, ...
    removeOnComplete: { age: 24 * 3600, count: 1000 },
    removeOnFail: { age: 7 * 24 * 3600 },
  },
});

module.exports = campaignQueue;
