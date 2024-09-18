import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
// import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

// Importing Routes
import userRoute from "./routes/user.routes.js";
import productRoute from "./routes/products.routes.js";
import orderRoute from "./routes/order.routes.js";
import paymentRoute from "./routes/payment.routes.js";
import dashboardRoute from "./routes/stats.routes.js";
import categoryRoute from "./routes/category.routes.js";
import authRoutes from "./routes/authRoutes.routes.js";
import addressRoutes from "./routes/address.routes.js";

config({
  path: "./.env",
});

console.log(process.env.PORT);

const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
// app.use(morgan("dev"));
app.use(
  cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
  })

);


app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/category", categoryRoute);
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/address', addressRoutes);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Express is working on http://localhost:${port}`);
});
