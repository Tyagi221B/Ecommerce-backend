import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model.js';
import { LivePrice } from '../models/LivePrice.js';
import { SizeOption } from '../models/SizeOption.js';
import { MetalOption } from '../models/MetalOptions.js';
import { SolitaireOption } from '../models/SolitaireOption.js';
import { DiamondQualityOption } from '../models/DiamondQualityOptions.js';

export const calculatePrice = async (req: Request, res: Response, next: NextFunction) => {
  const {
    productId,
    sizeOptionId,
    metalOptionId,
    solitaireOptionId,
    diamondQualityOptionId,
  } = req.body;

  try {
    // Fetch product and selected options
    const [product, sizeOption, metalOption, solitaireOption, diamondQualityOption] = await Promise.all([
      Product.findById(productId),
      SizeOption.findById(sizeOptionId),
      MetalOption.findById(metalOptionId),
      SolitaireOption.findById(solitaireOptionId),
      DiamondQualityOption.findById(diamondQualityOptionId),
    ]);

    if (!product || !sizeOption || !metalOption || !solitaireOption || !diamondQualityOption) {
      res.status(404);
      throw new Error('Invalid product or options selected');
    }

    // Fetch live prices
    const [goldPrice, diamondPrice, solitairePrice] = await Promise.all([
      LivePrice.findOne({ materialType: 'gold' }),
      LivePrice.findOne({ materialType: 'diamond' }),
      LivePrice.findOne({ materialType: 'solitaire' }),
    ]);

    if (!goldPrice || !diamondPrice || !solitairePrice) {
      res.status(500);
      throw new Error('Live prices not available');
    }

    // Calculate price components
    const goldCost =
      metalOption.metalWeight * goldPrice.pricePerUnit * metalOption.metalPriceMultiplier;
    const diamondCost = product.dimensions.weight * diamondPrice.pricePerUnit * diamondQualityOption.diamondPriceMultiplier;
    const solitaireCost =
      solitaireOption.caratSize * solitairePrice.pricePerUnit * solitaireOption.solitairePriceMultiplier;

    const sizeMultiplier = sizeOption.sizeMultiplier;

    // Making charges and GST (Assuming some constants or calculations)
    const makingCharges = (goldCost + diamondCost + solitaireCost) * 0.1; // Example: 10% of total material cost
    const subtotal = (goldCost + diamondCost + solitaireCost + makingCharges) * sizeMultiplier;
    const gst = subtotal * 0.03; // Example: 3% GST
    const totalPrice = subtotal + gst;

    res.json({
      goldCost,
      diamondCost,
      solitaireCost,
      makingCharges,
      gst,
      totalPrice,
    });
  } catch (err) {
    next(err);
  }
};
