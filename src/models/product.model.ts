// models/Product.ts
import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface IProduct {
  name: string;
  productCode: string;
  description: string;
  stock?: string;
  category: string;
  basePrice: number;
  dimensions: {
    height: number;
    width: number;
    weight: number;
  };
  defaultSize: string;
  createdDate: Date;
  media: Types.ObjectId[];
  sizeOptions: Types.ObjectId[];
  metalOptions: Types.ObjectId[];
  solitaireOptions: Types.ObjectId[];
  diamondQualityOptions: Types.ObjectId[];
}

export type IProductDocument = HydratedDocument<IProduct>;

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  productCode: { type: String, required: true, unique: true },
  description: String,
  stock: String,
  category: String,
  basePrice: Number,
  dimensions: {
    height: Number,
    width: Number,
    weight: Number,
  },
  defaultSize: String,
  createdDate: { type: Date, default: Date.now },
  media: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  sizeOptions: [{ type: Schema.Types.ObjectId, ref: 'SizeOption' }],
  metalOptions: [{ type: Schema.Types.ObjectId, ref: 'MetalOption' }],
  solitaireOptions: [{ type: Schema.Types.ObjectId, ref: 'SolitaireOption' }],
  diamondQualityOptions: [{ type: Schema.Types.ObjectId, ref: 'DiamondQualityOption' }],
});

export const Product = model<IProduct>('Product', ProductSchema);
