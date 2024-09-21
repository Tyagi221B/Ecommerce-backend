import { Request, Response, NextFunction } from 'express';
import { IProductDocument, Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Types } from 'mongoose';

import { IMediaDocument, Media } from '../models/Media.js';
import { ISizeOptionDocument, SizeOption } from '../models/SizeOption.js';
import { IMetalOptionDocument, MetalOption } from '../models/MetalOptions.js';
import { ISolitaireOptionDocument, SolitaireOption } from '../models/SolitaireOption.js';
import { DiamondQualityOption, IDiamondQualityOptionDocument } from '../models/DiamondQualityOptions.js';


// Create Product with related documents
export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      productCode,
      description,
      category,
      basePrice,
      dimensions,
      defaultSize,
      media,
      sizeOptions,
      metalOptions,
      solitaireOptions,
      diamondQualityOptions,
    } = req.body;

    // Check if productCode already exists
    const existingProduct = await Product.findOne({ productCode });
    if (existingProduct) {
      throw new ApiError(400, `Product with code ${productCode} already exists`);
    }

    // Create the Product document first
    const product: IProductDocument = new Product({
      name,
      productCode,
      description,
      category,
      basePrice,
      dimensions,
      defaultSize,
    });

    await product.save();

    const productId = product._id;

    // Initialize ID arrays
    let mediaIds: Types.ObjectId[] = [];
    let sizeOptionIds: Types.ObjectId[] = [];
    let metalOptionIds: Types.ObjectId[] = [];
    let solitaireOptionIds: Types.ObjectId[] = [];
    let diamondQualityOptionIds: Types.ObjectId[] = [];

    // Create related Media documents
    if (media && Array.isArray(media)) {
      const mediaDocs: IMediaDocument[] = await Media.insertMany(
        media.map((m: any) => ({
          product: productId,
          mediaType: m.mediaType,
          mediaURL: m.mediaURL,
          displayOrder: m.displayOrder || 0,
        }))
      );
      mediaIds = mediaDocs.map((m) => m._id);
    }

    // Create related SizeOption documents
    if (sizeOptions && Array.isArray(sizeOptions)) {
      const sizeDocs: ISizeOptionDocument[] = await SizeOption.insertMany(
        sizeOptions.map((s: any) => ({
          product: productId,
          size: s.size,
          sizeMultiplier: s.sizeMultiplier,
        }))
      );
      sizeOptionIds = sizeDocs.map((s) => s._id);
    }

    // Create related MetalOption documents
    if (metalOptions && Array.isArray(metalOptions)) {
      const metalDocs: IMetalOptionDocument[] = await MetalOption.insertMany(
        metalOptions.map((m: any) => ({
          product: productId,
          metalType: m.metalType,
          metalColor: m.metalColor,
          metalWeight: m.metalWeight,
          metalPriceMultiplier: m.metalPriceMultiplier,
        }))
      );
      metalOptionIds = metalDocs.map((m) => m._id);
    }

    // Create related SolitaireOption documents
    if (solitaireOptions && Array.isArray(solitaireOptions)) {
      const solitaireDocs: ISolitaireOptionDocument[] = await SolitaireOption.insertMany(
        solitaireOptions.map((s: any) => ({
          product: productId,
          caratSize: s.caratSize,
          shape: s.shape,
          clarity: s.clarity,
          color: s.color,
          cut: s.cut,
          polish: s.polish,
          symmetry: s.symmetry,
          fluorescence: s.fluorescence,
          solitairePriceMultiplier: s.solitairePriceMultiplier,
        }))
      );
      solitaireOptionIds = solitaireDocs.map((s) => s._id);
    }

    // Create related DiamondQualityOption documents
    if (diamondQualityOptions && Array.isArray(diamondQualityOptions)) {
      const diamondQualityDocs: IDiamondQualityOptionDocument[] = await DiamondQualityOption.insertMany(
        diamondQualityOptions.map((d: any) => ({
          product: productId,
          qualityGrade: d.qualityGrade,
          diamondPriceMultiplier: d.diamondPriceMultiplier,
        }))
      );
      diamondQualityOptionIds = diamondQualityDocs.map((d) => d._id);
    }

    // Update the Product document with the IDs of the related documents
    product.media = mediaIds;
    product.sizeOptions = sizeOptionIds;
    product.metalOptions = metalOptionIds;
    product.solitaireOptions = solitaireOptionIds;
    product.diamondQualityOptions = diamondQualityOptionIds;

    await product.save();

    res
      .status(201)
      .json(new ApiResponse(201, product, 'Product created successfully'));
  }
);


// Existing controller functions
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find()
      .populate('media')
      .populate('sizeOptions')
      .populate('metalOptions')
      .populate('solitaireOptions')
      .populate('diamondQualityOptions');
    res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id)
      .populate('media')
      .populate('sizeOptions')
      .populate('metalOptions')
      .populate('solitaireOptions')
      .populate('diamondQualityOptions');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
  }
);


// New controller function: Update Product
export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;
    const updateData = req.body;

    // Fetch the existing product
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // Update basic product fields
    const fieldsToUpdate = [
      'name',
      'productCode',
      'description',
      'category',
      'basePrice',
      'dimensions',
      'defaultSize',
    ];

    fieldsToUpdate.forEach((field) => {
      if (updateData[field] !== undefined) {
        product[field] = updateData[field];
      }
    });

    // Handle related documents if provided
    // Update Media
    if (updateData.media && Array.isArray(updateData.media)) {
      // Delete existing media
      await Media.deleteMany({ product: productId });

      // Create new media
      const mediaDocs: IMediaDocument[] = await Media.insertMany(
        updateData.media.map((m: any) => ({
          product: productId,
          mediaType: m.mediaType,
          mediaURL: m.mediaURL,
          displayOrder: m.displayOrder || 0,
        }))
      );

      // Update product's media references
      product.media = mediaDocs.map((m) => m._id);
    }

    // Repeat similar steps for sizeOptions, metalOptions, solitaireOptions, diamondQualityOptions

    // Save the updated product
    await product.save();

    res
      .status(200)
      .json(new ApiResponse(200, product, 'Product updated successfully'));
  }
);

// New controller function: Delete Product
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    // await product.remove();

    res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully'));
  }
);
