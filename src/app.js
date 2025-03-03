import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js';
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js';
import ProductManager from './classes/ProductManager.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => console.log(`Server running on port ${port}`));
const io = new Server(httpServer);

app.set('io', io);

app.use('/', viewsRouter);
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const hbs = handlebars.create({
    helpers: {
        multiply: (a, b) => a * b, // Multiplicar cantidad por precio
        calculateTotal: (products) => products.reduce((total, item) => total + (item.quantity * item.product.price), 0) // Calcular el total
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


mongoose.connect("mongodb+srv://tukics:coder@cluster0.8mbf9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => {
        console.log('No se pudo conectar a la base de datos', error);
        process.exit(1);
    });


    io.on('connection', async (socket) => {
        const PM = new ProductManager();
        const products = await PM.getProducts();
    
        socket.emit('realTimeProducts', products);
    
        socket.on('nuevoProducto', async data => {
            try {
                const product = {
                    title: data.title,
                    description: data.description,
                    code: data.code,
                    price: data.price,
                    category: data.category,
                    image: [data.image]
                };
                await PM.addProduct(product);
                console.log("Se agregó un nuevo producto");
        
                const updatedProducts = await PM.getProducts();
                io.emit('realTimeProducts', updatedProducts);
            } catch (error) {
                console.error("Error al agregar producto:", error.message);
                socket.emit('errorAgregarProducto', error.message);
            }
        });
    
    socket.on('eliminarProducto', async data => {
        try {
            console.log("ID recibido en el servidor:", data);
            await PM.deleteProduct(data);
            console.log("Se eliminó un producto");

            const updatedProducts = await PM.getProducts();
            io.emit('realTimeProducts', updatedProducts);
        } catch (error) {
            console.error("Error al eliminar el producto:", error.message);
        }
    });
});


