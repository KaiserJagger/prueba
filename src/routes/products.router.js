
/// productRouter
import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;

    // Configurar los valores por defecto
    const limitValue = limit ? parseInt(limit) : 10;
    const pageValue = page ? parseInt(page) : 1;
    const sortValue = sort === "desc" ? -1 : 1;
    const queryValue = query ? { category: query } : {};

    const count = await Product.countDocuments(queryValue);
    const totalPages = Math.ceil(count / limitValue);

    const skip = (pageValue - 1) * limitValue;
    const products = await Product.find(queryValue)
      .sort({ price: sortValue })
      .skip(skip)
      .limit(limitValue);

    const response = {
      status: "success",
      payload: products,
      totalPages,
      prevPage: pageValue > 1 ? pageValue - 1 : null,
      nextPage: pageValue < totalPages ? pageValue + 1 : null,
      page: pageValue,
      hasPrevPage: pageValue > 1,
      hasNextPage: pageValue < totalPages,
      prevLink: pageValue > 1 ? `/api/products?limit=${limitValue}&page=${pageValue - 1}` : null,
      nextLink: pageValue < totalPages ? `/api/products?limit=${limitValue}&page=${pageValue + 1}` : null
    };

    res.status(200).json(response);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const foundProduct = await Product.findById(id);

    if (!foundProduct) {
      res.status(404).send({ error: "Producto no encontrado" });
    } else {
      res.status(200).json(foundProduct);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    const product = req.body;
    const createdProduct = await Product.create(product);
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/update", async (req, res) => {
  try {
    const product = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(product._id, product, { new: true });

    if (!updatedProduct) {
      res.status(404).send({ error: "Producto no encontrado" });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).send({ error: "Producto no encontrado" });
    } else {
      res.status(200).json(deletedProduct);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
