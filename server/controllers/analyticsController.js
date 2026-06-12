const Client = require('../models/Client');
const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');

// Helper to seed mock data if the database is empty for this user (same logic as dashboard)
const seedIfEmpty = async (astrologerId) => {
  const clientCount = await Client.countDocuments({ astrologer: astrologerId });
  if (clientCount > 0) return;

  console.log(`[Analytics] Seeding mock data for astrologer: ${astrologerId}...`);

  const mockClients = await Client.create([
    { name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43210', astrologer: astrologerId },
    { name: 'Ethan Vance', email: 'ethan.vance@example.com', phone: '+1 (555) 234-5678', astrologer: astrologerId },
    { name: 'Nisha Sen', email: 'nisha.sen@example.com', phone: '+91 99887 76655', astrologer: astrologerId },
    { name: 'David Miller', email: 'david.m@example.com', phone: '+1 (555) 876-5432', astrologer: astrologerId },
    { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 91234 56789', astrologer: astrologerId },
  ]);

  const now = new Date();
  const getPastDate = (monthsAgo, dayOffset = 15) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(dayOffset);
    return d;
  };

  // Adjust mock client creation dates to match past months for monthly growth chart
  for (let i = 0; i < mockClients.length; i++) {
    // Distribute client signup dates over past 5 months
    const creationDate = getPastDate(i, 5);
    await Client.findByIdAndUpdate(mockClients[i]._id, { createdAt: creationDate });
  }

  const mockConsultations = [
    // 5 months ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(5, 10), status: 'Completed', amount: 120, fee: 120, notes: 'Detailed Kundli analysis' },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(5, 22), status: 'Completed', amount: 80, fee: 80, notes: 'Relationship alignment' },
    
    // 4 months ago
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(4, 5), status: 'Completed', amount: 150, fee: 150 },
    { client: mockClients[3]._id, astrologer: astrologerId, type: 'Vastu Consultation', date: getPastDate(4, 18), status: 'Completed', amount: 250, fee: 250 },
    { client: mockClients[4]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(4, 25), status: 'Cancelled', amount: 120, fee: 120 },

    // 3 months ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(3, 12), status: 'Completed', amount: 100, fee: 100 },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(3, 27), status: 'Completed', amount: 80, fee: 80 },

    // 2 months ago
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(2, 8), status: 'Completed', amount: 150, fee: 150 },
    { client: mockClients[3]._id, astrologer: astrologerId, type: 'Vastu Consultation', date: getPastDate(2, 14), status: 'Completed', amount: 300, fee: 300 },
    { client: mockClients[4]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(2, 28), status: 'Completed', amount: 120, fee: 120 },

    // 1 month ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Kundali Matching', date: getPastDate(1, 4), status: 'Completed', amount: 200, fee: 200 },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(1, 15), status: 'Completed', amount: 90, fee: 90 },
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(1, 24), status: 'Completed', amount: 150, fee: 150 },

    // Current month
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Kundali Matching', date: new Date(new Date().setHours(14, 30, 0, 0)), status: 'Completed', amount: 250, fee: 250 },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: new Date(new Date().setHours(17, 0, 0, 0)), status: 'Scheduled', amount: 100, fee: 100 },
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Reading', date: new Date(new Date().setDate(now.getDate() + 1)), status: 'Scheduled', amount: 150, fee: 150 },
  ];

  await Consultation.create(mockConsultations);
  console.log('[Analytics] Mock database seeding successfully completed!');
};

// @desc    Get collective analytics graphs data
// @route   GET /api/analytics
// @access  Private
const getAnalyticsData = async (req, res) => {
  try {
    const astrologerId = req.user._id;

    // Seed mock data if none exists
    await seedIfEmpty(astrologerId);

    // Date range helper for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // 1. PIPELINE: Revenue Trend & Consultations Count (Last 6 Months)
    const consultations = await Consultation.find({
      astrologer: astrologerId,
      date: { $gte: sixMonthsAgo }
    }).sort({ date: 1 });

    const monthlyDataMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      monthlyDataMap[mName] = { month: mName, consultations: 0, revenue: 0 };
    }

    consultations.forEach((c) => {
      const mName = months[new Date(c.date).getMonth()];
      if (monthlyDataMap[mName]) {
        monthlyDataMap[mName].consultations += 1;
        if (c.status === 'Completed') {
          monthlyDataMap[mName].revenue += c.fee;
        }
      }
    });
    const revenueTrend = Object.values(monthlyDataMap);

    // 2. PIPELINE: Consultation Status Distribution (Pie Chart)
    const statusDistributionResult = await Consultation.aggregate([
      { $match: { astrologer: astrologerId } },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } }
    ]);

    const statuses = ['Scheduled', 'Completed', 'Cancelled'];
    const statusDistribution = statuses.map((status) => {
      const found = statusDistributionResult.find((s) => s.name === status);
      return { name: status, value: found ? found.value : 0 };
    });

    // 3. PIPELINE: Top Clients by total fees paid (Bar Chart)
    const topClients = await Consultation.aggregate([
      { $match: { astrologer: astrologerId, status: 'Completed' } },
      { $group: { _id: '$client', totalSpent: { $sum: '$fee' }, count: { $sum: 1 } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'clientInfo'
        }
      },
      { $unwind: { path: '$clientInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          name: { $ifNull: ['$clientInfo.name', 'Anonymous Client'] },
          revenue: '$totalSpent',
          sessions: '$count'
        }
      }
    ]);

    // 4. PIPELINE: Monthly Client Onboarding Growth (Line Chart)
    const clients = await Client.find({
      astrologer: astrologerId,
      createdAt: { $gte: sixMonthsAgo }
    }).sort({ createdAt: 1 });

    const monthlyGrowthMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      monthlyGrowthMap[mName] = { month: mName, newClients: 0 };
    }

    clients.forEach((client) => {
      const mName = months[new Date(client.createdAt).getMonth()];
      if (monthlyGrowthMap[mName]) {
        monthlyGrowthMap[mName].newClients += 1;
      }
    });
    const monthlyGrowth = Object.values(monthlyGrowthMap);

    res.status(200).json({
      success: true,
      data: {
        revenueTrend,
        statusDistribution,
        topClients,
        monthlyGrowth,
      }
    });
  } catch (error) {
    console.error('Error in getAnalyticsData:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics data' });
  }
};

module.exports = {
  getAnalyticsData,
};
