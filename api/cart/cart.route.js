import express from "express";
import { isBuyer } from "../middleware/authentication.middleware.js";
import { addItemToCartValidation } from "./cart.validate.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import { Product } from "../product/product.model.js";
import { checkMongoIdValidity } from "../middleware/check.mongo.id.validity.js";

const router = express.Router();

router.post(
  "/cart/item/add",

  isBuyer,

  // validate cart item schema
  async (req, res, next) => {
    const cartItem = req.body;

    try {
      req.body = await addItemToCartValidation.validate(cartItem);

      next();
    } catch (error) {
      return res.status(401).send(error.message);
    }
  },

  async (req, res, next) => {
    // check product id validity

    const productId = req.body.productId;

    const isValidProductId = mongoose.isValidObjectId(productId);

    if (!isValidProductId) {
      return res.status(403).send({ message: "The product id is not valid" });
    }

    next();
  },

  async (req, res) => {
    const cartItem = req.body;

    // attach buyer id to cart item

    cartItem.buyerId = req.loggedInUserId;

    // console.log(cartItem);

    // check if the item is already added to cart

    const item = await Cart.findOne({
      productId: cartItem.productId,
      buyerId: cartItem.buyerId,
    });

    if (item) {
      return res
        .status(401)
        .send({ message: "The item is already added in the cart" });
    }

    // check product quantity is greater than orderedQuantity

    const product = await Product.findOne({ _id: cartItem.productId });

    if (!product) {
      return res.status(402).send({ message: "The product doesn't exist" });
    }

    // console.log(product);

    if (cartItem.orderedQuantity > product.quantity) {
      return res
        .status(401)
        .send({ message: "The ordered quantity exceeds the product quantity" });
    }

    //     // add item to cart

    await Cart.create(cartItem);

    return res.status(201).send({ message: "The item is added to cart" });
  }
);

// flush the cart / delete many

router.delete("/cart/flush", isBuyer, async (req, res) => {
  await Cart.deleteMany({ buyerId: req.loggedInUserId });

  return res
    .status(200)
    .send({ message: "All the items in the carts is removed" });
});

// remove selected items in the cart
router.delete(
  "/cart/item/remove/:id",
  isBuyer,
  checkMongoIdValidity,
  async (req, res) => {
    const productId = req.params.id;

    await Cart.deleteOne({ productId: productId, buyerId: req.loggedInUserId });

    return res
      .status(200)
      .send({ message: "The selected item is removed from the cart" });
  }
);

router.get(
  "/cart/item/list",
  isBuyer,

  async (req, res) => {
    const cartDetails = await Cart.aggregate([
      { $match: { buyerId: req.loggedInUserId } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          name: { $first: "$productDetails.name" },
          brand: { $first: "$productDetails.brand" },
          price: { $first: "$productDetails.price" },
          quantity: { $first: "$productDetails.quantity" },
          category: { $first: "$productDetails.category" },
          availableQuantity: { $first: "$productDetails.quantity" },
          productId: 1,
          orderedQuantity: 1,
        },
      },
    ]);

    // console.log(cartDetails);

    return res.status(200).send({ cartItemDetails: cartDetails });
  }
);

export default router;
