import { Router } from "express";
import CartManager from "../classes/CartManager";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.get('/', async (req, res) => {
    const carts = await CM.getCart();
    res.send(carts);
});

cartsRouter.post('/', async (req, res) => {
    await CM.createCart();
    res.send({status: 'success', message: 'Carrito creado correctamente'});
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCartById(cid);

    res.send(cart);
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.query.pid;
    await CM.addCartProduct(cid, pid);
    res.send({status: 'success', message: 'Producto agregado correctamente'});
});

export default cartsRouter;