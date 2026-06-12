const Client = require('../models/Client');
const Consultation = require('../models/Consultation');

// Helper to seed mock data if the database is empty for this user
const seedIfEmpty = async (astrologerId) => {
  const clientCount = await Client.countDocuments({ astrologer: astrologerId });
  if (clientCount > 0) return;

  console.log(`Seeding mock data for astrologer: ${astrologerId}...`);

  // 1. Create Mock Clients
  const mockClients = await Client.create([
    { name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43210', astrologer: astrologerId },
    { name: 'Ethan Vance', email: 'ethan.vance@example.com', phone: '+1 (555) 234-5678', astrologer: astrologerId },
    { name: 'Nisha Sen', email: 'nisha.sen@example.com', phone: '+91 99887 76655', astrologer: astrologerId },
    { name: 'David Miller', email: 'david.m@example.com', phone: '+1 (555) 876-5432', astrologer: astrologerId },
    { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 91234 56789', astrologer: astrologerId },
  ]);

  // 2. Create Mock Consultations distributed across the last 6 months + today/tomorrow
  const now = new Date();
  
  // Date helper offset
  const getPastDate = (monthsAgo, dayOffset = 15) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - monthsAgo);
    d.setDate(dayOffset);
    return d;
  };

  const mockConsultations = [
    // 5 months ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(5, 10), status: 'Completed', amount: 120, notes: 'Detailed Kundli analysis' },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(5, 22), status: 'Completed', amount: 80, notes: 'General relationship alignment' },
    
    // 4 months ago
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(4, 5), status: 'Completed', amount: 150 },
    { client: mockClients[3]._id, astrologer: astrologerId, type: 'Vastu Consultation', date: getPastDate(4, 18), status: 'Completed', amount: 250 },
    { client: mockClients[4]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(4, 25), status: 'Cancelled', amount: 120 },

    // 3 months ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(3, 12), status: 'Completed', amount: 100 },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(3, 27), status: 'Completed', amount: 80 },

    // 2 months ago
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(2, 8), status: 'Completed', amount: 150 },
    { client: mockClients[3]._id, astrologer: astrologerId, type: 'Vastu Consultation', date: getPastDate(2, 14), status: 'Completed', amount: 300 },
    { client: mockClients[4]._id, astrologer: astrologerId, type: 'Vedic Reading', date: getPastDate(2, 28), status: 'Completed', amount: 120 },

    // 1 month ago
    { client: mockClients[0]._id, astrologer: astrologerId, type: 'Kundali Matching', date: getPastDate(1, 4), status: 'Completed', amount: 200 },
    { client: mockClients[1]._id, astrologer: astrologerId, type: 'Tarot Alignment', date: getPastDate(1, 15), status: 'Completed', amount: 90 },
    { client: mockClients[2]._id, astrologer: astrologerId, type: 'Numerology Audit', date: getPastDate(1, 24), status: 'Completed', amount: 150 },

    // Current month (Today's appointments and other dates)
    { 
      client: mockClients[0]._id, 
      astrologer: astrologerId, 
      type: 'Kundali Matching', 
      date: new Date(new Date().setHours(14, 30, 0, 0)), // Today at 2:30 PM
      status: 'Scheduled', 
      amount: 250 
    },
    { 
      client: mockClients[1]._id, 
      astrologer: astrologerId, 
      type: 'Tarot Alignment', 
      date: new Date(new Date().setHours(17, 0, 0, 0)), // Today at 5:00 PM
      status: 'Scheduled', 
      amount: 100 
    },
    { 
      client: mockClients[2]._id, 
      astrologer: astrologerId, 
      type: 'Numerology Reading', 
      date: new Date(new Date().setDate(now.getDate() + 1)), // Tomorrow
      status: 'Scheduled', 
      amount: 150 
    },
  ];

  await Consultation.create(mockConsultations);
  console.log('Mock database seeding successfully completed!');
};

// @desc    Get dashboard metrics (Total clients, consultations, revenue, today's count)
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const astrologerId = req.user._id;

    // Seed mock data if none exists
    await seedIfEmpty(astrologerId);

    // Calculate metrics
    const totalClients = await Client.countDocuments({ astrologer: astrologerId });
    const totalConsultations = await Consultation.countDocuments({ astrologer: astrologerId });
    
    // Revenue Aggregate (Sum of completed consultation amounts)
    const revenueResult = await Consultation.aggregate([
      { $match: { astrologer: astrologerId, status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Today's appointments count
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayAppointments = await Consultation.countDocuments({
      astrologer: astrologerId,
      date: { $gte: startOfToday, $lte: endOfToday },
      status: 'Scheduled'
    });

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        totalConsultations,
        revenue,
        todayAppointments
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats' });
  }
};

// @desc    Get dashboard analytics (Monthly consultations and revenue trends)
// @route   GET /api/dashboard/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const astrologerId = req.user._id;

    // Seed mock data if none exists
    await seedIfEmpty(astrologerId);

    // Get date range for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const consultations = await Consultation.find({
      astrologer: astrologerId,
      date: { $gte: sixMonthsAgo }
    }).sort({ date: 1 });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};

    // Initialize map with last 6 months keys to ensure no gaps
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      monthlyData[mName] = { month: mName, consultations: 0, revenue: 0 };
    }

    // Populate actual figures
    consultations.forEach((c) => {
      const mName = months[new Date(c.date).getMonth()];
      if (monthlyData[mName]) {
        monthlyData[mName].consultations += 1;
        if (c.status === 'Completed') {
          monthlyData[mName].revenue += c.amount;
        }
      }
    });

    const chartData = Object.values(monthlyData);

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving analytics data' });
  }
};

module.exports = {
  getStats,
  getAnalytics,
};
