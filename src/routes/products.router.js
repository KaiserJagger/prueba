import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const router = Router();
// const prod = new ProductManager("./data/products.json");

router.get("/", (req, res) => {
    let { limit } = req.query;
    if (limit) {
        res.status(200).send(prod.getProducts().slice(0, +limit));
    } else {
        res.status(200).send(prod.getProducts());
    }
});
router.get("/", async (req, res) => {
    let { limit } = req.query;
    try {
        const productos = await prod.getProducts();
        if (limit) {
            res.status(200).send(productos.slice(0, +limit));
        } else {
            res.status(200).send(productos);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
router.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    try {
        const foundprod = await prod.getProductById(id);
        if (foundprod === false) {
            res.status(404).send({ error: "Producto no encontrado" });
        } else {
            res.status(200).send(foundprod);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/create", async (req, res) => {
    const producto = req.body;
    try {
        const result = await prod.addProduct(producto);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
router.put("/update", async (req, res) => {
    const producto = req.body;
    try {
        const result = await prod.updateProduct(producto);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    try {
        const result = await prod.deleteProduct(id);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(200).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;

// import { Router } from 'express'
// import productModel from '../models/product.model.js'

// const router = Router()

// router.get('/', async (req, res) => {
//     // res.send('Listando los pokemones...')
//     // const pokemons = await pokeModel.find()
//     const productos = await productModel.find().lean().exec()
//     console.log(productos)
//     res.render('realtimeproducts', { productos })
// })

// router.get('/realtimeproducts/:id', async (req, res) => {
//     const id = req.params.id
//     const productos = await productModel.findhome({ id }).lean().exec()
//     res.render('update', { productos })
// })

// router.get('/realtimeproducts', (req, res) => {
//     res.render('realtimeproducts', {})
// })

// router.get('/:id', async (req, res) => {
//     const id = req.params.id
//     const productos = await productModel.findOne({ id }).lean().exec()
//     res.render('home', {
//         productos
//     })
// })

// router.post('/', async (req, res) => {
//     const productNew = req.body
//     const productGenerated = new productModel(productNew)
//     await productGenerated.save()
//     res.redirect(`/home`)
// })

// router.put('/:id', async (req, res) => {
//     const id = req.params.id
//     console.log(id)
//     const productNewData = req.body
//     console.log(productNewData)
//     try {
//         await productModel.updateOne({ id }, { ...productNewData })
//     } catch(err) {
//         console.log('error.....')
//         res.send({err})
//     }
// })

// router.delete('/:id', async (req, res) => {
//     const id = req.params.id
//     try {
//         await productModel.deleteOne({ id })
//         res.send(`Producto con  ${id} borrado exitosamente!`)
//     } catch (err) {
//         res.send({err})
//     }
// })

// export default router