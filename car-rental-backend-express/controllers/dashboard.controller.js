const Booking = require('../models/booking.model');
const Car = require('../models/car.model');
const User = require('../models/user.model');
const MaintenanceLog = require('../models/maintenance.model');
const mongoose = require('mongoose');

// @desc    Get analytics data for the admin dashboard
// @route   GET /api/dashboard/analytics
// @access  Private (Admin)
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Key Performance Indicators (KPIs)
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalBookings = await Booking.countDocuments({ status: 'CONFIRMED' });
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();

    // New Maintenance Cost KPIs
    const totalMaintenanceCost = await MaintenanceLog.aggregate([
      { $group: { _id: null, total: { $sum: '$cost' } } }
    ]);
    
    const totalMaintenanceLogs = await MaintenanceLog.countDocuments();

    const avgMaintenanceCost = totalMaintenanceLogs > 0 ? (totalMaintenanceCost[0]?.total || 0) / totalMaintenanceLogs : 0;


    // 2. Revenue Per Month Chart Data
    const revenuePerMonth = await Booking.aggregate([
        { $match: { status: 'CONFIRMED' } },
        {
            $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    
    // Format for chart
    const formattedRevenue = revenuePerMonth.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        revenue: item.totalRevenue,
    }));

    // 3. Car Model Popularity Chart Data
    const carPopularity = await Booking.aggregate([
      { $match: { status: 'CONFIRMED' } },
      { $group: { _id: '$car', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }, // Top 5 most booked cars
      {
        $lookup: {
          from: 'cars', // The actual collection name for the Car model
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails'
        }
      },
      { $unwind: '$carDetails' },
      {
        $project: {
          name: { $concat: ['$carDetails.brand', ' ', '$carDetails.model'] },
          count: '$count'
        }
      }
    ]);

    res.json({
      kpis: {
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        totalBookings,
        totalUsers,
        totalCars,
        totalMaintenanceCost: totalMaintenanceCost.length > 0 ? totalMaintenanceCost[0].total : 0,
        avgMaintenanceCost,
      },
      charts: {
        revenuePerMonth: formattedRevenue,
        carPopularity,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
