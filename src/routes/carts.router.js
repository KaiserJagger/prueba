
// cartsRouter
import { Router } from "express";
import { CartManager } from "../managers/CartManager.js";
import Product from "../models/product.model.js";

const router = Router();

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartManager.findById(cartId).populate("products");

    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = new CartManager();
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await CartManager.findById(cartId);

    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).send({ error: "Producto no encontrado" });
      } else {
        cart.products.push(product);
        await cart.save();
        res.status(201).json(cart);
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartManager.findById(cartId);

    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      cart.products = [];
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await CartManager.findById(cartId);

    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      cart.products = cart.products.filter((product) => product._id != productId);
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;
    const cart = await CartManager.findById(cartId);

    if (!cart) {
      res.status(404).send({ error: "Carrito no encontrado" });
    } else {
      cart.products = products;
      await cart.save();
      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;