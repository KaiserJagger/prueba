import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Product from "./models/product.model.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const uri = 'mongodb+srv://kaiserjagger10:0cinco0uno@cluster1.iuhzek3.mongodb.net/JaggerStore'
const port = 8080;
const app = express();
app.use(express.json());

app.use("/home", viewsRouter);
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/carts", viewsRouter);

mongoose.set('strictQuery', true);

try {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const httpServer = app.listen(port, () => {
    console.log("Server corriendo en el puerto " + port);
  });
  
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socketClient) => {
    console.log("Cliente conectado");

    socketClient.on("addProd", async (product) => {
      const newProduct = new Product(JSON.parse(product));
      try {
        await newProduct.save();
        const products = await Product.find({});
        socketServer.emit("products", products);
        socketClient.emit("result", "Producto agregado");
      } catch (error) {
        socketClient.emit("error", error.message);
      }
    });

    socketClient.on("deleteProd", async (prodId) => {
      try {
        await Product.deleteOne({ _id: prodId });
        const products = await Product.find({});
        socketServer.emit("products", products);
        socketClient.emit("result", "Producto eliminado");
      } catch (error) {
        socketClient.emit("error", error.message);
      }
    });
  });
} catch (err) {
  console.log("No se pudo conectar a la base de datos");
}
