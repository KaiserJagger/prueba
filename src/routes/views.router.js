import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Paginate from '../paginate.js'

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const count = await Product.countDocuments({});
    const totalPages = Math.ceil(count / pageSize);
    const skip = (pageNumber - 1) * pageSize;

    const products = await Product.find({})
      .skip(skip)
      .limit(pageSize)
      .lean();

      const paginatedResults = new Paginate(products, pageNumber, pageSize )

      res.render("products", {
        products: paginatedResults.paginatedItems,
        pageNumber: paginatedResults.currentPage,
        totalPages: paginatedResults.totalPages,
      });
    } catch (err) {
      res.status(400).send(err);
    }
});

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).lean();
    res.render("product-details", { product });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/carts/:cid/add-to-cart/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await Cart.findById(cartId);
    const product = await Product.findById(productId);

    cart.products.push(product);
    await cart.save();

    res.redirect(`/carts/${cartId}`);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId).populate("products").lean();
    res.render("cart-details", { cart });
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;