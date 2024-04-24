import express from "express";
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
} from "./user.validation.js";
import User from "./user.model.js";
import {
  comparePassword,
  generateHashPassword,
} from "../utils/password.functions.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// register

router.post(
  "/user/register",

  async (req, res, next) => {
    const newUser = req.body;

    try {
      const validatedData = await registerUserValidationSchema.validate(
        newUser
      );
      req.body = validatedData;
      next();
    } catch (error) {
      return res.status(401).send({ message: error.message });
    }
  },

  async (req, res) => {
    const newUser = req.body;

    const user = await User.findOne({ email: newUser.email });

    if (user) {
      return res
        .status(401)
        .send({ message: "User with this email already exists" });
    }

    const hashedPassword = await generateHashPassword(newUser.password);

    newUser.password = hashedPassword;

    await User.create(newUser);

    return res.status(201).send({ message: "Registered Successfully " });
  }
);

// login api

router.post(
  "/user/login",

  // validate user login credentials
  async (req, res, next) => {
    let loginCredentials = req.body;

    try {
      let validatedData = await loginUserValidationSchema.validate(
        loginCredentials
      );
      req.body = validatedData;

      next();
    } catch (error) {
      return res.status(400).send(error.message);
    }
  },

  // check email and password and then generate token and send
  async (req, res) => {
    let loginCredentials = req.body;

    let user = await User.findOne({ email: loginCredentials.email });

    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    // console.log(loginCredentials);

    // check for password match

    let passwordMatch = await comparePassword(
      loginCredentials.password,
      user.password
    );

    // console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    // generate token

    let payload = { userId: user._id };

    let token = jwt.sign(payload, "jwtsecretkey@123", { expiresIn: "1d" });

    // console.log(token);

    return res
      .status(200)
      .send({ message: "Logged In", user: user, token: token });
  }
);

export default router;
