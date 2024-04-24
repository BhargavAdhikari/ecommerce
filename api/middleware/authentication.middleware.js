import User from "../user/user.model.js";
import jwt from "jsonwebtoken";

export const isSeller = async (req, res, next) => {
  let authorization = req.headers.authorization;

  let splittedValue = authorization?.split(" ");

  let token = splittedValue?.length === 2 ? splittedValue[1] : undefined;

  let payload;
  try {
    payload = jwt.verify(token, "jwtsecretkey@123");
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let user = await User.findOne({ _id: payload.userId });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (user.role !== "seller") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // console.log(user);
  req.loggedInUserId = user._id;

  // console.log(req);

  next();
};

export const isUser = async (req, res, next) => {
  let authorization = req.headers.authorization;

  let splittedValue = authorization?.split(" ");

  let token = splittedValue?.length === 2 ? splittedValue[1] : undefined;

  let payload;
  try {
    payload = jwt.verify(token, "jwtsecretkey@123");
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let user = await User.findOne({ _id: payload.userId });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // console.log(user);
  req.sellerId = user._id;

  // console.log(req);

  next();
};

export const isBuyer = async (req, res, next) => {
  let authorization = req.headers.authorization;

  let splittedValue = authorization?.split(" ");

  let token = splittedValue?.length === 2 ? splittedValue[1] : undefined;

  let payload;
  try {
    payload = jwt.verify(token, "jwtsecretkey@123");
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let user = await User.findOne({ _id: payload.userId });

  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (user.role !== "buyer") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  // console.log(user);
  req.loggedInUserId = user._id;

  // console.log(req);

  next();
};
