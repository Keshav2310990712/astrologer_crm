const express = require('express');
const router = express.Router();
const { 
  getClients, getClientById, createClient, updateClient, deleteClient 
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Apply JWT protection middleware to all client routes

router.route('/')
  .get(getClients)
  .post(createClient);

router.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

module.exports = router;
