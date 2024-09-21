// validators/productValidator.ts

import { body, ValidationChain, checkSchema } from 'express-validator';

// Validation rules for creating a product
const createProductValidator: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Product name is required')
    .isString()
    .withMessage('Product name must be a string'),

  body('productCode')
    .notEmpty()
    .withMessage('Product code is required')
    .isString()
    .withMessage('Product code must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isString()
    .withMessage('Category must be a string'),

  body('basePrice')
    .notEmpty()
    .withMessage('Base price is required')
    .isFloat({ gt: 0 })
    .withMessage('Base price must be a number greater than 0'),

  body('dimensions')
    .notEmpty()
    .withMessage('Dimensions are required')
    .isObject()
    .withMessage('Dimensions must be an object'),

  body('dimensions.height')
    .notEmpty()
    .withMessage('Height is required')
    .isFloat({ gt: 0 })
    .withMessage('Height must be a number greater than 0'),

  body('dimensions.width')
    .notEmpty()
    .withMessage('Width is required')
    .isFloat({ gt: 0 })
    .withMessage('Width must be a number greater than 0'),

  body('dimensions.weight')
    .notEmpty()
    .withMessage('Weight is required')
    .isFloat({ gt: 0 })
    .withMessage('Weight must be a number greater than 0'),

  body('defaultSize')
    .notEmpty()
    .withMessage('Default size is required')
    .isString()
    .withMessage('Default size must be a string'),

  body('media')
    .optional()
    .isArray()
    .withMessage('Media must be an array'),

  body('media.*.mediaType')
    .notEmpty()
    .withMessage('Media type is required')
    .isIn(['image', 'video'])
    .withMessage('Media type must be either image or video'),

  body('media.*.mediaURL')
    .notEmpty()
    .withMessage('Media URL is required')
    .isURL()
    .withMessage('Media URL must be a valid URL'),

  body('media.*.displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('sizeOptions')
    .optional()
    .isArray()
    .withMessage('Size options must be an array'),

  body('sizeOptions.*.size')
    .notEmpty()
    .withMessage('Size is required')
    .isString()
    .withMessage('Size must be a string'),

  body('sizeOptions.*.sizeMultiplier')
    .notEmpty()
    .withMessage('Size multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Size multiplier must be a number greater than 0'),

  body('metalOptions')
    .optional()
    .isArray()
    .withMessage('Metal options must be an array'),

  body('metalOptions.*.metalType')
    .notEmpty()
    .withMessage('Metal type is required')
    .isIn(['14kt', '18kt'])
    .withMessage('Metal type must be either 14kt or 18kt'),

  body('metalOptions.*.metalColor')
    .notEmpty()
    .withMessage('Metal color is required')
    .isIn(['yellow', 'white', 'rose'])
    .withMessage('Metal color must be yellow, white, or rose'),

  body('metalOptions.*.metalWeight')
    .notEmpty()
    .withMessage('Metal weight is required')
    .isFloat({ gt: 0 })
    .withMessage('Metal weight must be a number greater than 0'),

  body('metalOptions.*.metalPriceMultiplier')
    .notEmpty()
    .withMessage('Metal price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Metal price multiplier must be a number greater than 0'),

  body('solitaireOptions')
    .optional()
    .isArray()
    .withMessage('Solitaire options must be an array'),

  body('solitaireOptions.*.caratSize')
    .notEmpty()
    .withMessage('Carat size is required')
    .isFloat({ gt: 0 })
    .withMessage('Carat size must be a number greater than 0'),

  body('solitaireOptions.*.shape')
    .optional()
    .isString()
    .withMessage('Shape must be a string'),

  body('solitaireOptions.*.clarity')
    .optional()
    .isString()
    .withMessage('Clarity must be a string'),

  body('solitaireOptions.*.color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),

  body('solitaireOptions.*.cut')
    .optional()
    .isString()
    .withMessage('Cut must be a string'),

  body('solitaireOptions.*.polish')
    .optional()
    .isString()
    .withMessage('Polish must be a string'),

  body('solitaireOptions.*.symmetry')
    .optional()
    .isString()
    .withMessage('Symmetry must be a string'),

  body('solitaireOptions.*.fluorescence')
    .optional()
    .isString()
    .withMessage('Fluorescence must be a string'),

  body('solitaireOptions.*.solitairePriceMultiplier')
    .notEmpty()
    .withMessage('Solitaire price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Solitaire price multiplier must be a number greater than 0'),

  body('diamondQualityOptions')
    .optional()
    .isArray()
    .withMessage('Diamond quality options must be an array'),

  body('diamondQualityOptions.*.qualityGrade')
    .notEmpty()
    .withMessage('Quality grade is required')
    .isString()
    .withMessage('Quality grade must be a string'),

  body('diamondQualityOptions.*.diamondPriceMultiplier')
    .notEmpty()
    .withMessage('Diamond price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Diamond price multiplier must be a number greater than 0'),
];

// Validation rules for updating a product
const updateProductValidator: ValidationChain[] = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isString()
    .withMessage('Product name must be a string'),

  body('productCode')
    .optional()
    .notEmpty()
    .withMessage('Product code cannot be empty')
    .isString()
    .withMessage('Product code must be a string'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isString()
    .withMessage('Category must be a string'),

  body('basePrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Base price must be a number greater than 0'),

  body('dimensions')
    .optional()
    .isObject()
    .withMessage('Dimensions must be an object'),

  body('dimensions.height')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Height must be a number greater than 0'),

  body('dimensions.width')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Width must be a number greater than 0'),

  body('dimensions.weight')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Weight must be a number greater than 0'),

  body('defaultSize')
    .optional()
    .notEmpty()
    .withMessage('Default size cannot be empty')
    .isString()
    .withMessage('Default size must be a string'),

  body('media')
    .optional()
    .isArray()
    .withMessage('Media must be an array'),

  body('media.*.mediaType')
    .optional()
    .notEmpty()
    .withMessage('Media type is required')
    .isIn(['image', 'video'])
    .withMessage('Media type must be either image or video'),

  body('media.*.mediaURL')
    .optional()
    .notEmpty()
    .withMessage('Media URL is required')
    .isURL()
    .withMessage('Media URL must be a valid URL'),

  body('media.*.displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),

  body('sizeOptions')
    .optional()
    .isArray()
    .withMessage('Size options must be an array'),

  body('sizeOptions.*.size')
    .optional()
    .notEmpty()
    .withMessage('Size is required')
    .isString()
    .withMessage('Size must be a string'),

  body('sizeOptions.*.sizeMultiplier')
    .optional()
    .notEmpty()
    .withMessage('Size multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Size multiplier must be a number greater than 0'),

  body('metalOptions')
    .optional()
    .isArray()
    .withMessage('Metal options must be an array'),

  body('metalOptions.*.metalType')
    .optional()
    .notEmpty()
    .withMessage('Metal type is required')
    .isIn(['14kt', '18kt'])
    .withMessage('Metal type must be either 14kt or 18kt'),

  body('metalOptions.*.metalColor')
    .optional()
    .notEmpty()
    .withMessage('Metal color is required')
    .isIn(['yellow', 'white', 'rose'])
    .withMessage('Metal color must be yellow, white, or rose'),

  body('metalOptions.*.metalWeight')
    .optional()
    .notEmpty()
    .withMessage('Metal weight is required')
    .isFloat({ gt: 0 })
    .withMessage('Metal weight must be a number greater than 0'),

  body('metalOptions.*.metalPriceMultiplier')
    .optional()
    .notEmpty()
    .withMessage('Metal price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Metal price multiplier must be a number greater than 0'),

  body('solitaireOptions')
    .optional()
    .isArray()
    .withMessage('Solitaire options must be an array'),

  body('solitaireOptions.*.caratSize')
    .optional()
    .notEmpty()
    .withMessage('Carat size is required')
    .isFloat({ gt: 0 })
    .withMessage('Carat size must be a number greater than 0'),

  body('solitaireOptions.*.shape')
    .optional()
    .isString()
    .withMessage('Shape must be a string'),

  body('solitaireOptions.*.clarity')
    .optional()
    .isString()
    .withMessage('Clarity must be a string'),

  body('solitaireOptions.*.color')
    .optional()
    .isString()
    .withMessage('Color must be a string'),

  body('solitaireOptions.*.cut')
    .optional()
    .isString()
    .withMessage('Cut must be a string'),

  body('solitaireOptions.*.polish')
    .optional()
    .isString()
    .withMessage('Polish must be a string'),

  body('solitaireOptions.*.symmetry')
    .optional()
    .isString()
    .withMessage('Symmetry must be a string'),

  body('solitaireOptions.*.fluorescence')
    .optional()
    .isString()
    .withMessage('Fluorescence must be a string'),

  body('solitaireOptions.*.solitairePriceMultiplier')
    .optional()
    .notEmpty()
    .withMessage('Solitaire price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Solitaire price multiplier must be a number greater than 0'),

  body('diamondQualityOptions')
    .optional()
    .isArray()
    .withMessage('Diamond quality options must be an array'),

  body('diamondQualityOptions.*.qualityGrade')
    .optional()
    .notEmpty()
    .withMessage('Quality grade is required')
    .isString()
    .withMessage('Quality grade must be a string'),

  body('diamondQualityOptions.*.diamondPriceMultiplier')
    .optional()
    .notEmpty()
    .withMessage('Diamond price multiplier is required')
    .isFloat({ gt: 0 })
    .withMessage('Diamond price multiplier must be a number greater than 0'),
];

export { createProductValidator, updateProductValidator };
