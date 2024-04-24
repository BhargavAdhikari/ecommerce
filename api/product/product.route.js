import express from "express";
// import jwt from "jsonwebtoken";
// import User from "../user/user.model.js";
import { addProductValidationSchema } from "./product.validate.js";
import { Product } from "./product.model.js";
import {
  isBuyer,
  isSeller,
  isUser,
} from "../middleware/authentication.middleware.js";
// import mongoose from "mongoose";
import { checkMongoIdValidity } from "../middleware/check.mongo.id.validity.js";
import { paginationValidationSchema } from "../utils/page.validation.js";
import { validateReqBody } from "../middleware/reqbody.validate.middleware.js";

const router = express.Router();

router.post(
  "/product/add",

  // check access token

  isSeller,

  async (req, res, next) => {
    let newProduct = req.body;
    // console.log(newProduct);
    newProduct.sellerID = req.loggedInUserId;

    try {
      req.body = await addProductValidationSchema.validate(newProduct);

      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  },

  async (req, res) => {
    let validatedData = req.body;

    await Product.create(validatedData);

    return res
      .status(201)
      .send({ message: "New Product is added successfully " });
  }
);

// get product by id

router.get(
  "/product/get/:id",
  isUser,

  checkMongoIdValidity,

  async (req, res) => {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .send({ message: "The product doesn't exist in the database" });
    }

    return res
      .status(201)
      .send({ message: "The requested Mongo id is: ", product });
  }
);

router.delete(
  "/product/delete/:id",
  isSeller,
  checkMongoIdValidity,

  async (req, res) => {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(201)
        .send({ message: "The product doesn't exist for deletion" });
    }

    // console.log(product.sellerID);
    // console.log(req.loggedInUserId);

    const isOwnerOfProduct = product.sellerID.equals(req.loggedInUserId);

    if (!isOwnerOfProduct) {
      return res
        .status(403)
        .send({ message: "This is not the owner of the product" });
    }

    // console.log(product);
    await Product.deleteOne({ _id: product._id });

    return res
      .status(201)
      .send({ message: "The product is deleted sccessfully" });
  }
);

router.put(
  "/product/edit/:id",
  isSeller,

  checkMongoIdValidity,

  async (req, res, next) => {
    const newValues = req.body;

    // newValues.sellerID = req.loggedInUserId;

    // console.log(newValues);

    try {
      req.body = await addProductValidationSchema.validate(newValues);

      // console.log();
      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  },

  async (req, res, next) => {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(401)
        .send({ message: "The product doesn't exist for editing" });
    }

    const isOwnerOfProduct = product.sellerID.equals(req.loggedInUserId);

    if (!isOwnerOfProduct) {
      return res
        .status(403)
        .send({ message: "This is not the owner of the product" });
    }

    let newValues = req.body;

    // finally edit the product

    await Product.updateOne({ _id: productId }, { $set: { ...newValues } });

    return res
      .status(201)
      .send({ message: "The product is edited successfully" });
  }
);

router.post(
  "/product/list/buyer",
  isBuyer,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    const { page, limit } = req.body;

    const skip = (page - 1) * limit;

    const productList = await Product.aggregate([
      { $match: {} },

      { $skip: skip },

      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).send(productList);
  }
);

router.post(
  "/product/list/seller",
  isSeller,
  validateReqBody(paginationValidationSchema),
  async (req, res) => {
    const { page, limit } = req.body;

    const skip = (page - 1) * limit;

    const productList = await Product.aggregate([
      { $match: { sellerID: req.loggedInUserId } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          image: 1,
          description: 1,
        },
      },
    ]);

    return res.status(200).send(productList);
  }
);

export default router;
