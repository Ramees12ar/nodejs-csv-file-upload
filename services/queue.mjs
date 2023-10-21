import Bull from "bull";
import config from "config"
import queueJob from "../utils/queueJob.mjs";

const { queueName, queuePort } = config
const csvUploadQueue = new Bull(queueName, {
    redis: queuePort
});

csvUploadQueue.process(queueJob);

// clear completed or failed jobs from redis cache
async function cleanJobs() {
    try {
        await csvUploadQueue.clean(1000, 'completed');
        await csvUploadQueue.clean(1000, 'failed');
    } catch (err) {
        logger.error(JSON.stringify(err));
    }
}
setInterval(cleanJobs, 1 * 60 * 1000); // clean completed or failed jobs from queue
console.log('New Bull instance created for csv files db write');
export default csvUploadQueue;