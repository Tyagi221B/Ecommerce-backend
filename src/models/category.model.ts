import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter category name'],
    trim: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
},
{
  timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
export default Category;