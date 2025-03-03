import { cartModel } from '../models/cart.model.js';

class CartManager {
    async getCarts() {
        return await cartModel.find().lean();
    }

    async createCart() {
        const newCart = await cartModel.create({ products: [] });
        return newCart;
    }

    async getCartById(cartId) {
        const cart = await cartModel.findById(cartId).populate('products.product').lean();
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
    
        await cart.save();
        return cart;
    }

    async removeFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = cart.products.filter(item => item.product.toString() !== productId);

        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = [];
        await cart.save();
        return cart;
    }
}

export default CartManager;