const Car = require('../models/car.model');
const Report = require('../models/report.model');
const ActivityLog = require('../models/activity-log.model');

exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    const activityLog = new ActivityLog({
      car: car._id,
      activityType: 'CAR_CREATED',
      description: `New car "${car.brand} ${car.model}" created.`,
    });
    await activityLog.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAvailableCars = async (req, res) => {
  try {
    const cars = (await Car.find({ status: 'AVAILABLE' })).sort((a, b) => {
      return a.price - b.price;
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (
      req.body.totalKilometers !== undefined &&
      req.body.totalKilometers > car.totalKilometers
    ) {
      const kilometersDriven =
        req.body.totalKilometers - car.totalKilometers;
      car.kilometersSinceLastMaintenance += kilometersDriven;
    }

    Object.assign(car, req.body);
    await car.save();

    const activityLog = new ActivityLog({
      car: car._id,
      activityType: 'CAR_UPDATED',
      description: `Car "${car.brand} ${car.model}" updated.`,
    });
    await activityLog.save();

    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    await car.remove();

    const activityLog = new ActivityLog({
      car: car._id,
      activityType: 'CAR_DELETED',
      description: `Car "${car.brand} ${car.model}" deleted.`,
    });
    await activityLog.save();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCarStatus = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const oldStatus = car.status;
    car.status = req.body.status;

    if (req.body.status === 'AVAILABLE') {
      car.kilometersSinceLastMaintenance = 0;
      car.lastMaintenanceDate = new Date();
      if (oldStatus === 'MAINTENANCE') {
        const activityLog = new ActivityLog({
          car: car._id,
          activityType: 'MAINTENANCE_COMPLETED',
          description: `Car "${car.brand} ${car.model}" maintenance completed and set to AVAILABLE.`,
        });
        await activityLog.save();
      }
    }

    const activityLog = new ActivityLog({
      car: car._id,
      activityType: 'STATUS_CHANGED',
      description: `Car "${car.brand} ${car.model}" status changed from ${oldStatus} to ${req.body.status}.`,
    });
    await activityLog.save();

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.simulateLocationUpdate = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.status !== 'RESERVED') {
      return res.status(400).json({ message: 'Car is not reserved' });
    }

    const randomLatitude = parseFloat(
      (Math.random() * (90 - -90) + -90).toFixed(6),
    );
    const randomLongitude = parseFloat(
      (Math.random() * (180 - -180) + -180).toFixed(6),
    );

    car.currentLocation = {
      latitude: randomLatitude,
      longitude: randomLongitude,
    };

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReport = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const report = new Report({
      ...req.body,
      car: req.params.id,
    });
    await report.save();

    const activityLog = new ActivityLog({
      car: car._id,
      activityType: 'REPORT_ADDED',
      description: `Report "${report.description}" added to car "${car.brand} ${car.model}".`,
    });
    await activityLog.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReportsByCarId = async (req, res) => {
  try {
    const reports = await Report.find({ car: req.params.id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCarStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ status: 'AVAILABLE' });
    const maintenanceCars = await Car.countDocuments({ status: 'MAINTENANCE' });
    const reservedCars = await Car.countDocuments({ status: 'RESERVED' });
    const needsMaintenanceSoon = await Car.countDocuments({
      status: { $ne: 'MAINTENANCE' },
      kilometersSinceLastMaintenance: { $gte: 10000 },
    });

    res.json({
      totalCars,
      availableCars,
      maintenanceCars,
      reservedCars,
      needsMaintenanceSoon,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActivityLogsByCarId = async (req, res) => {
  try {
    const activityLogs = await ActivityLog.find({ car: req.params.id });
    res.json(activityLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
