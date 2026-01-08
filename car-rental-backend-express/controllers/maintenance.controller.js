const MaintenanceLog = require('../models/maintenance.model');
const Car = require('../models/car.model');
const ActivityLog = require('../models/activity-log.model');

// @desc    Add a new maintenance log for a car
// @route   POST /api/maintenance/:carId
// @access  Private (Admin)
exports.addMaintenanceLog = async (req, res) => {
  const { description, cost } = req.body;
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const newLog = new MaintenanceLog({
      car: carId,
      description,
      cost,
    });

    await newLog.save();

    // When a maintenance log is added, we assume the car is being serviced.
    // We reset the KM since last maintenance and set its status to AVAILABLE,
    // as if the service is now complete.
    car.kilometersSinceLastMaintenance = 0;
    car.lastMaintenanceDate = new Date();
    car.status = 'AVAILABLE';
    
    await car.save();
    
    // Create a system activity log
    const activityLog = new ActivityLog({
        car: car._id,
        activityType: 'MAINTENANCE_COMPLETED',
        description: `Maintenance logged: "${description}". Car set to AVAILABLE.`,
    });
    await activityLog.save();


    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all maintenance logs for a specific car
// @route   GET /api/maintenance/:carId
// @access  Private (Admin)
exports.getMaintenanceLogsForCar = async (req, res) => {
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const logs = await MaintenanceLog.find({ car: carId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
