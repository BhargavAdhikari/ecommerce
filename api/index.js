import express from "express";
import connectDB from "./connect.db.js";
import userRouter from "./user/user.route.js";
import productRouter from "./product/product.route.js";
import cartRouter from "./cart/cart.route.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

connectDB();

app.use(userRouter);
app.use(productRouter);
app.use(cartRouter);

// cors

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
