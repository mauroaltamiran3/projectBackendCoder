import { Router } from 'express';
import ProductManager from '../classes/ProductManager.js';

const viewsRouter = Router();
const PM = new ProductManager();

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

export default viewsRouter;