import { Request } from 'express';
import { TryCatch } from '../middlewares/error.js';
import Category from '../models/category.model.js';
import ErrorHandler from '../utils/utility-class.js';
import { NewCategoryRequestBody } from '../types/types.js';


const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Category.find();
  return res.status(200).json({
    success: true,
    categories,
  });
});


const createCategory = TryCatch(async (req: Request<{}, {}, NewCategoryRequestBody>, res, next) => {
  const { name } = req.body;
  console.log("this is req.body ",req.body);
  console.log("this is photoPath ",req.file?.path);
  console.log("this is  name ",name);

  let photoPath;

  try {
    photoPath = req.file?.path; 
  } catch (error) {
    return next(new ErrorHandler("Error Uploading Photo", 400));
  }

  if (!photoPath) return next(new ErrorHandler("Please add Photo", 400));
  if (!name) return next(new ErrorHandler("Please enter All Fields", 400));

  try {
    const newCategory = await Category.create({
      name: name.toLowerCase(),
      photo: photoPath,
    });

    return res.status(201).json({
      success: true,
      message: "Category Created Successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log("errrrrrrrrr")
    return next(error); 
  }
});

const getSingleCategory = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) return next(new ErrorHandler("Category Not Found", 404));

  return res.status(200).json({
    success: true,
    category,
  });
});

const updateCategory = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const photo = req.file;

  const category = await Category.findById(id);

  if (!category) return next(new ErrorHandler("Category Not Found", 404));

  if (photo) {
    // Implement logic to delete old category photo before updating
    category.photo = photo.path;
  }

  if (name) category.name = name;

  await category.save();

  return res.status(200).json({
    success: true,
    message: "Category Updated Successfully",
    category,
  });
});

export {getAllCategories, updateCategory, createCategory , getSingleCategory}