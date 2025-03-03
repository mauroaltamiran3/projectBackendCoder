import { Router } from 'express';
import ProductManager from '../classes/ProductManager.js';
import CartManager from '../classes/CartManager.js';

const viewsRouter = Router();
const PM = new ProductManager();
const CM = new CartManager();

viewsRouter.get('/', async (req, res) => {
    let products = await PM.getProducts();

    res.render('home', { products:products });
});

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render("realtimeproducts");
});

viewsRouter.get('/products', (req, res) => {
    res.render("products");
});

viewsRouter.get('/cart/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await CM.getCartById(cartId);
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default viewsRouter;