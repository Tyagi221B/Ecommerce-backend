import express from 'express';
import { calculatePrice } from '../controllers/priceController.js';

const app = express.Router();


// @route   POST /api/prices/calculate
// @desc    Calculate price based on selected options
app.post('/calculate', calculatePrice);

export default app;
