import cartModel from '../models/cart.model.js';

class CartManager {
    constructor() {
        this.cart = [];
    }

    async getCart() {
        return await cartModel.find().lean();
    }

    async addProduct(product) {
        await cartModel.create({...product});
    }

    async deleteProduct(id) {
        await cartModel.deleteOne({_id: id});
    }

    async createCart() {
        await cartModel.create({products: []});
    }

    async addCartProduct(cid, pid) {
        let cart = await cartModel.findOne({_id: cid}).lean();
        let product = cart.products.find(item => item.product == pid);

        if (product) {
            product.quantity++;
        } else {
            let product = {product: pid, quantity: 1};
            cart.products.push(product);
        }

        await cartModel.updateOne({_id: cid}, {products: cart.products});
    }

    async getCartById(id) {
        return await cartModel.find({_id: id}).lean();
    }
}

export default CartManager;