import mongoose from 'mongoose';

const cartSchema = new Schema({
    products: Array
});

export const cartModel = mongoose.model('cart', cartSchema);