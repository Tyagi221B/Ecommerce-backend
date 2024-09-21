import { LivePrice } from '../models/LivePrice.js';
import axios from 'axios';

export const updateLivePrices = async () => {
  try {
    // Example API endpoints
    const [goldResponse, diamondResponse, solitaireResponse] = await Promise.all([
      axios.get('API_ENDPOINT_FOR_GOLD_PRICE'),
      axios.get('API_ENDPOINT_FOR_DIAMOND_PRICE'),
      axios.get('API_ENDPOINT_FOR_SOLITAIRE_PRICE'),
    ]);

    const goldPrice = goldResponse.data.price;
    const diamondPrice = diamondResponse.data.price;
    const solitairePrice = solitaireResponse.data.price;

    await Promise.all([
      LivePrice.findOneAndUpdate(
        { materialType: 'gold' },
        { pricePerUnit: goldPrice, lastUpdated: new Date() },
        { upsert: true }
      ),
      LivePrice.findOneAndUpdate(
        { materialType: 'diamond' },
        { pricePerUnit: diamondPrice, lastUpdated: new Date() },
        { upsert: true }
      ),
      LivePrice.findOneAndUpdate(
        { materialType: 'solitaire' },
        { pricePerUnit: solitairePrice, lastUpdated: new Date() },
        { upsert: true }
      ),
    ]);
  } catch (err) {
    console.error('Error updating live prices:', err);
  }
};
