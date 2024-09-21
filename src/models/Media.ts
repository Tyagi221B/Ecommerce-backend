// models/Media.ts
import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface IMedia {
  product: Types.ObjectId;
  mediaType: 'image' | 'video';
  mediaURL: string;
  displayOrder: number;
}

export type IMediaDocument = HydratedDocument<IMedia>;

const MediaSchema = new Schema<IMedia>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  mediaURL: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
});

export const Media = model<IMedia>('Media', MediaSchema);
