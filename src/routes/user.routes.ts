import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  registerUser,
} from "../controllers/user.controller.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();
app.use(express.json());


// route - /api/v1/user/new
app.post("/new", registerUser);

// Route - /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);

// Route - /api/v1/user/dynamicID
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);
app.get("/getuser/:phone", getUser)

export default app;
