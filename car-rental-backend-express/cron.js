const cron = require('node-cron');
const Car = require('./models/car.model.js');
const ActivityLog = require('./models/activity-log.model.js');
const { getRandomActivity } = require('./utils/utils.js');

cron.schedule('* * * * *', async () => {
  console.log('Running in-use car activity simulation cron job...');

  try {
    // Fetch the full car object to update KM
    const inUseCars = await Car.find({ status: 'RESERVED' });

    console.log(
      `Found ${inUseCars.length} in-use car(s). Simulating telematics/usage activities...`,
    );

    for (const car of inUseCars) {
      // --- Existing activity log simulation ---
      const numActivities = Math.floor(Math.random() * 2); // Reduced for less log spam
      for (let i = 0; i < numActivities; i++) {
        const activity = getRandomActivity();
        const activityLog = new ActivityLog({
          car: car._id,
          activityType: activity.type,
          description: activity.description,
        });
        await activityLog.save();
      }

      // --- New Kilometer Simulation ---
      const kilometersToAdd = Math.floor(Math.random() * (300 - 50 + 1)) + 50;
      car.totalKilometers += kilometersToAdd;
      car.kilometersSinceLastMaintenance += kilometersToAdd;
      
      await car.save();
      console.log(`Updated car ${car.brand} ${car.model}: Added ${kilometersToAdd} km.`);
    }

    console.log('In-use activity and kilometer simulation completed successfully.');
  } catch (error) {
    console.error(
      'Error during in-use activity simulation cron job',
      error.stack,
    );
  }
});
