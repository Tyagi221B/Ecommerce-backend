import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface ISolitaireOption extends Document {
  product: Types.ObjectId;
  caratSize: number;
  shape: string;
  clarity: string;
  color: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  solitairePriceMultiplier: number;
}

export type ISolitaireOptionDocument = HydratedDocument<ISolitaireOption>

const SolitaireOptionSchema = new Schema<ISolitaireOption>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  caratSize: { type: Number, required: true },
  shape: String,
  clarity: String,
  color: String,
  cut: String,
  polish: String,
  symmetry: String,
  fluorescence: String,
  solitairePriceMultiplier: { type: Number, required: true },
});

export const SolitaireOption = model<ISolitaireOption>('SolitaireOption', SolitaireOptionSchema);
