const Client = require('../models/Client');
const Consultation = require('../models/Consultation');

// @desc    Get all clients for the logged-in astrologer (with search and pagination)
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res) => {
  try {
    const astrologerId = req.user._id;
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Build query criteria
    const query = { astrologer: astrologerId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Get total count
    const total = await Client.countDocuments(query);

    // Fetch paginated results
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: clients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error in getClients:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving clients list' });
  }
};

// @desc    Get a single client details
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Verify owner
    if (client.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this client' });
    }

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error in getClientById:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving client details' });
  }
};

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    const astrologerId = req.user._id;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Please provide name and email' });
    }

    // Check if client with this email already exists under this astrologer
    const clientExists = await Client.findOne({ email, astrologer: astrologerId });
    if (clientExists) {
      return res.status(400).json({ success: false, message: 'A client with this email is already registered under your profile' });
    }

    const client = await Client.create({
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      timeOfBirth,
      placeOfBirth,
      astrologer: astrologerId,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error('Error in createClient:', error.message);
    res.status(500).json({ success: false, message: 'Server error creating client' });
  }
};

// @desc    Update a client details
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, timeOfBirth, placeOfBirth } = req.body;
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Verify owner
    if (client.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this client' });
    }

    // Check if updated email conflicts with another client's email under this astrologer
    if (email && email !== client.email) {
      const emailConflict = await Client.findOne({ email, astrologer: req.user._id });
      if (emailConflict) {
        return res.status(400).json({ success: false, message: 'Another client is already registered under this email' });
      }
    }

    // Apply updates
    client.name = name || client.name;
    client.email = email || client.email;
    client.phone = phone !== undefined ? phone : client.phone;
    client.dateOfBirth = dateOfBirth !== undefined ? (dateOfBirth ? new Date(dateOfBirth) : null) : client.dateOfBirth;
    client.timeOfBirth = timeOfBirth !== undefined ? timeOfBirth : client.timeOfBirth;
    client.placeOfBirth = placeOfBirth !== undefined ? placeOfBirth : client.placeOfBirth;

    const updatedClient = await client.save();

    res.status(200).json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    console.error('Error in updateClient:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating client details' });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    // Verify owner
    if (client.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this client' });
    }

    // Delete associated consultations first to keep clean database integrity
    await Consultation.deleteMany({ client: client._id });

    // Delete the client
    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Client and all associated consultations successfully deleted',
    });
  } catch (error) {
    console.error('Error in deleteClient:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting client' });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
