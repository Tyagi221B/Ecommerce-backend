import express from 'express';
import { connectDB } from './utils/features.js';
import userRoute from './routes/user.js';


const port = 4000;

const app = express();
connectDB("mongodb+srv://ashmittyagigms:Uh5CzAjOqPo4zXBN@cluster0.avlbwzc.mongodb.net/");

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});
app.use("/api/v1/user", userRoute);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});