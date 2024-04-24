import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 55,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 55,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true, trim: true },
  dob: { type: Date, required: false, default: null },
  // gender: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   enum: ["male", "female", "other"],
  // },
  role: { type: String, required: true, trim: true, enum: ["buyer", "seller"] },
});

userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
