import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Basic product information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  images: {
    type: [String],
    required: true,
  },
  size: {
    type: {
      height: Number,
      width: Number,
      length: Number,
    },
    required: true,
  },
  weight: {
    type: {
      net: Number,
      diamond: Number,
      gold: Number,
    },
    required: true,
  },
  purity: {
    type: String,
    required: true,
  },

  // Additional product details
  basicInfo: {
    type: {
      productType: String,
      brand: String,
      itemPackageQuantity: Number,
      gender: String,
    },
    required: true,
  },
  diamondInfo: {
    type: {
      color: String,
      clarity: String,
      caratWeight: Number,
      pieces: Number,
    },
    required: true,
  },
  metalInfo: {
    type: {
      purity: String,
      metal: String,
      netWeight: Number,
    },
    required: true,
  },
  certification: {
    type: {
      diamondCertification: String,
      hallmarkLicense: String,
    },
    required: true,
  },
  priceBreakup: {
    type: [{
      component: String,
      name: String,
      rate: String,
      weight: String,
      discount: String,
      finalValue: String,
    }],
    required: true,
  },
  tags: {
    type: [String],
  },

  // Timestamps for tracking creation and modification
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;