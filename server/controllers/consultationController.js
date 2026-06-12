const Consultation = require('../models/Consultation');
const Client = require('../models/Client');

// @desc    Get all consultations for the logged-in astrologer
// @route   GET /api/consultations
// @access  Private
const getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ astrologer: req.user._id })
      .populate('client', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error('Error in getConsultations:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving consultations schedule' });
  }
};

// @desc    Get a single consultation by ID
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('client', 'name email');

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    // Verify owner
    if (consultation.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this consultation' });
    }

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error('Error in getConsultationById:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving consultation details' });
  }
};

// @desc    Book a new consultation
// @route   POST /api/consultations
// @access  Private
const createConsultation = async (req, res) => {
  try {
    const { client, date, duration, notes, fee } = req.body;
    const astrologerId = req.user._id;

    // Validate fields
    if (!client || !date || !duration || fee === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide client, date, duration and fee' });
    }

    // Verify client belongs to this astrologer
    const clientExists = await Client.findOne({ _id: client, astrologer: astrologerId });
    if (!clientExists) {
      return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
    }

    const consultation = await Consultation.create({
      client,
      date: new Date(date),
      duration: Number(duration),
      status: 'Scheduled',
      notes: notes || '',
      fee: Number(fee),
      astrologer: astrologerId,
    });

    const populatedConsultation = await Consultation.findById(consultation._id).populate('client', 'name email');

    res.status(201).json({
      success: true,
      data: populatedConsultation,
    });
  } catch (error) {
    console.error('Error in createConsultation:', error.message);
    res.status(500).json({ success: false, message: 'Server error booking consultation' });
  }
};

// @desc    Update a consultation details
// @route   PUT /api/consultations/:id
// @access  Private
const updateConsultation = async (req, res) => {
  try {
    const { client, date, duration, status, notes, fee } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    // Verify owner
    if (consultation.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to modify this consultation' });
    }

    // Validate client change if provided
    if (client && client !== consultation.client.toString()) {
      const clientExists = await Client.findOne({ _id: client, astrologer: req.user._id });
      if (!clientExists) {
        return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
      }
      consultation.client = client;
    }

    // Apply updates
    consultation.date = date ? new Date(date) : consultation.date;
    consultation.duration = duration !== undefined ? Number(duration) : consultation.duration;
    consultation.status = status || consultation.status;
    consultation.notes = notes !== undefined ? notes : consultation.notes;
    consultation.fee = fee !== undefined ? Number(fee) : consultation.fee;

    const updatedConsultation = await consultation.save();
    const populatedConsultation = await Consultation.findById(updatedConsultation._id).populate('client', 'name email');

    res.status(200).json({
      success: true,
      data: populatedConsultation,
    });
  } catch (error) {
    console.error('Error in updateConsultation:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating consultation details' });
  }
};

// @desc    Delete a consultation
// @route   DELETE /api/consultations/:id
// @access  Private
const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: 'Consultation not found' });
    }

    // Verify owner
    if (consultation.astrologer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this consultation' });
    }

    await Consultation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Consultation successfully cancelled and deleted',
    });
  } catch (error) {
    console.error('Error in deleteConsultation:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting consultation' });
  }
};

module.exports = {
  getConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
};
