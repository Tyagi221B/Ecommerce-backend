import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface ISizeOption extends Document {
  product: Types.ObjectId;
  size: string;
  sizeMultiplier: number;
}

export type ISizeOptionDocument = HydratedDocument<ISizeOption>


const SizeOptionSchema = new Schema<ISizeOption>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: String, required: true },
  sizeMultiplier: { type: Number, required: true },
});

export const SizeOption = model<ISizeOption>('SizeOption', SizeOptionSchema);
