import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';

import { createCategory, updateCategory, getAllCategories, getSingleCategory } from '../controllers/category.controller.js';


const app = express.Router();

app.get("/all", getAllCategories)

app.post("/new", adminOnly ,singleUpload, createCategory)

app
  .route("/:id")
  .get(getSingleCategory)
  .put(adminOnly, singleUpload, updateCategory)
  // .delete(adminOnly, deleteProduct);


export default app;