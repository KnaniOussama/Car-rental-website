const cron = require('node-cron');
const Car = require('./models/car.model.js');
const ActivityLog = require('./models/activity-log.model.js');
const { getRandomActivity } = require('./utils/utils.js');

cron.schedule('* * * * *', async () => {
  console.log('Running in-use car activity simulation cron job...');

  try {
    const inUseCars = await Car.find({ status: 'RESERVED' }).select('_id');

    console.log(
      `Found ${inUseCars.length} in-use car(s). Simulating telematics/usage activities...`,
    );

    for (const car of inUseCars) {
      const numActivities = Math.floor(Math.random() * 4);

      for (let i = 0; i < numActivities; i++) {
        const activity = getRandomActivity();
        const activityLog = new ActivityLog({
          car: car._id,
          activityType: activity.type,
          description: activity.description,
        });
        await activityLog.save();
      }
    }

    console.log('In-use activity simulation completed successfully.');
  } catch (error) {
    console.error(
      'Error during in-use activity simulation cron job',
      error.stack,
    );
  }
});
