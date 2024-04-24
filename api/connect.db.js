import mongoose from "mongoose";

const connectDB = () => {
  try {
    mongoose.connect(
      `mongodb+srv://Bhargavadhikari71:bhargav123@cluster0.5a9aw82.mongodb.net/ecommerce?retryWrites=true&w=majority`
    );
    console.log("Database connection established");
  } catch (error) {
    console.log(error.message);
    console.log("connection failed");
  }
};
export default connectDB;
