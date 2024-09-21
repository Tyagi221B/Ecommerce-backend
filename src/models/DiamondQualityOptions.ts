import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface IDiamondQualityOption {
  product: Types.ObjectId;
  qualityGrade: string;
  diamondPriceMultiplier: number;
}

export type IDiamondQualityOptionDocument = HydratedDocument<IDiamondQualityOption>;

const DiamondQualityOptionSchema = new Schema<IDiamondQualityOption>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qualityGrade: { type: String, required: true },
  diamondPriceMultiplier: { type: Number, required: true },
});

export const DiamondQualityOption = model<IDiamondQualityOption>(
  'DiamondQualityOption',
  DiamondQualityOptionSchema
);
