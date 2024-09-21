import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface IMetalOption extends Document {
  product: Types.ObjectId;
  metalType: '14kt' | '18kt';
  metalColor: 'yellow' | 'white' | 'rose';
  metalWeight: number;
  metalPriceMultiplier: number;

}

export type IMetalOptionDocument = HydratedDocument<IMetalOption>;


const MetalOptionSchema = new Schema<IMetalOption>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  metalType: { type: String, enum: ['14kt', '18kt'], required: true },
  metalColor: { type: String, enum: ['yellow', 'white', 'rose'], required: true },
  metalWeight: { type: Number, required: true },
  metalPriceMultiplier: { type: Number, required: true },
});

export const MetalOption = model<IMetalOption>('MetalOption', MetalOptionSchema);
