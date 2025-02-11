import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import fs from 'fs';
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js';

const app = express();
const port = 8080;
const httpServer = app.listen(port, () => console.log(`Server running on port ${port}`));
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productosFile = `${__dirname}/productos.json`;
let productos = [];

if (fs.existsSync(productosFile)) {
    productos = JSON.parse(fs.readFileSync(productosFile, 'utf-8'));
}

app.use('/', viewsRouter(() => productos));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('realTimeProducts', productos);

    socket.on('nuevoProducto', (producto) => {
        const newProduct = { id: productos.length + 1, ...producto };
        productos.push(newProduct);
        fs.writeFileSync(productosFile, JSON.stringify(productos, null, 2));
        io.emit('realTimeProducts', productos);
    });

    socket.on('eliminarProducto', (id) => {
        productos = productos.filter(prod => prod.id !== parseInt(id));
        fs.writeFileSync(productosFile, JSON.stringify(productos, null, 2));
        io.emit('realTimeProducts', productos);
    });
});