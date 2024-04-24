import mongoose from "mongoose";

export const checkMongoIdValidity = (req, res, next) => {
  const id = req.params.id;

  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) {
    return res.status(400).send({ message: "The mongo id is not valid " });
  }

  next();
};
