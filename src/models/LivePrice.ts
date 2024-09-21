import { Schema, model, Document, HydratedDocument } from 'mongoose';

export interface ILivePrice extends Document {
  materialType: 'gold' | 'diamond' | 'solitaire';
  pricePerUnit: number;
  lastUpdated: Date;
}

export type ILivePriceDocument = HydratedDocument<ILivePrice>;


const LivePriceSchema = new Schema<ILivePrice>({
  materialType: { type: String, enum: ['gold', 'diamond', 'solitaire'], required: true },
  pricePerUnit: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export const LivePrice = model<ILivePrice>('LivePrice', LivePriceSchema);
