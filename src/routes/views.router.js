// import { Router } from "express";
// import { ProductManager } from "../managers/ProductManager.js";

// const router = Router();

// const prod = new ProductManager("./data/products.json");

// router.get("/home", (req, res) => {
//     const products = prod.getProducts();
//     res.render("home", {products: products});
// });

// router.get("/realtimeproducts", async (req, res) => {
//     try {
//         const product = prod.getProducts();
//         res.render("realTimeProducts", { products: product });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// export default router;

import express from "express";
import productModel from "../models/product.model.js";

const router = express.Router();

// Ruta para la vista home
router.get("/home", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error al obtener los productos desde la base de datos");
  }
});

// Ruta para la vista de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();
    res.render("realtimeproducts", { products });
  } catch (err) {
    res.status(500).send("Error al obtener los productos desde la base de datos");
  }
});

export default router;

