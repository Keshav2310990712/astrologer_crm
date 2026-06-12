const express = require('express');
const router = express.Router();
const { 
  getConsultations, getConsultationById, createConsultation, updateConsultation, deleteConsultation 
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Apply JWT protection middleware to all consultation routes

router.route('/')
  .get(getConsultations)
  .post(createConsultation);

router.route('/:id')
  .get(getConsultationById)
  .put(updateConsultation)
  .delete(deleteConsultation);

module.exports = router;
