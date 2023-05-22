import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";


import { ProductManager } from "./managers/ProductManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";

const uri = 'mongodb+srv://kaiserjagger10:0cinco0uno@cluster1.iuhzek3.mongodb.net/'
const port= 8080
const app = express();
app.use(express.json());

app.use("/home", viewsRouter);
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.set('public', __dirname + "/public")

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", viewsRouter);
app.use("/home", viewsRouter);

mongoose.set('strictQuery', true)
try{
    await mongoose.connect(uri, {
        // dbName: 'JaggerStore',
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    const httpServer = app.listen(port, () => {
        console.log("Server corriendo en el puerto " + port);
    });
    const socketServer = new Server(httpServer);

socketServer.on("connection", (socketClient) => {
    const prod = new ProductManager("./data/products.json");
    // const prod = 
    console.log("cliente conectado");
   
    socketClient.on("addProd", (product) => {
        const producto= JSON.parse(product)
        const result = prod.addProduct(producto);
        if (result.error) {
            console.log(result)
            socketClient.emit("error", result);
        } else {
            socketServer.emit("products", prod.getProducts());
            socketClient.emit("result", "Producto agregado");
        }
    });
   
    socketClient.on("deleteProd", (prodId) => {
        const result = prod.deleteProduct(prodId);
        if (result.error) {
            socketClient.emit("error", result);
        } else {
            socketServer.emit("products", prod.getProducts());
            socketClient.emit("result", "Producto eliminado");
        }
    });
   
});
}  catch(err){
    console.log('No se pudo conectar')
}  


