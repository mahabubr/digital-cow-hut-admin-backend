import { Schema, model } from 'mongoose';
import { breed, category, label, location } from './cow.constants';
import { CowModel, TCow } from './cow.interface';

const cowSchema = new Schema<TCow, CowModel>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, enum: location },
    breed: { type: String, enum: breed },
    weight: { type: Number, required: true },
    label: { type: String, enum: label },
    category: { type: String, enum: category },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Cow = model<TCow, CowModel>('Cow', cowSchema);
