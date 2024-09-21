import express from "express";
import { adminOnly } from "../middlewares/auth.js";

import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

// @route   GET /api/products
// @desc    Get all products
app.get('/all', getAllProducts);

// @route   GET /api/products/:id
// @desc    Get product by ID
app.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a new product
app.post('/new', createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
app.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
app.delete('/:id', deleteProduct);


// To get, update, delete Product
// app
//   .route("/:id")
//   .get(getSingleProduct)
//   .put(adminOnly, singleUpload, updateProduct)
//   .delete(adminOnly, deleteProduct);

export default app;


// import { validateRequest } from '../middlewares/validateRequest';
// import { createProductValidator, updateProductValidator } from '../middlewares/validators/productValidator';

// // ...

// router.post('/', createProductValidator, validateRequest, asyncHandler(createProduct));

// router.post(
//   '/',
//   createProductValidator,  // Apply creation validators
//   validateRequest,        // Validate the request
//   asyncHandler(createProduct)
// );

// // @route   PUT /api/products/:id
// // @desc    Update a product
// router.put(
//   '/:id',
//   updateProductValidator,  // Apply update validators
//   validateRequest,        // Validate the request
//   asyncHandler(updateProduct)
// );