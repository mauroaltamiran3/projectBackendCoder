import { Router } from 'express';
const router = Router();

export default (getProductos) => {
    router.get('/', (req, res) => res.render('home', { productos: getProductos() }));
    router.get('/realtimeproducts', (req, res) => res.render('realTimeProducts'));
    return router;
};