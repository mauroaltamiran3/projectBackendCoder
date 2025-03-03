import { productsModel } from '../models/products.model.js';
import mongoose from 'mongoose';

class ProductManager {
    constructor() {
        this.products = [];
    }

    async getProducts() {
        return await productsModel.find().lean();
    }

    async getProductById(id) {
        let product = await productsModel.find({_id:id});

        return product ? product : { error: 'Producto no encontrado' };
    }

    async addProduct(product) {
        try {
            const existingProduct = await productsModel.findOne({ code: product.code });
            if (existingProduct) {
                throw new Error(`El código ${product.code} ya está en uso.`);
            }
    
            await productsModel.create({ ...product });
        } catch (error) {
            throw new Error(`Error al agregar el producto: ${error.message}`);
        }
    
    }

    async editProduct(id, product) {
        await productsModel.updateOne({_id: id}, {...product});
    }

    async deleteProduct(id) {
        try {
            console.log("ID recibido para eliminar:", id);
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(`El ID ${id} no es válido.`);
            }
    
            const result = await productsModel.deleteOne({ _id: id });
    
            if (result.deletedCount === 0) {
                throw new Error(`No se encontró ningún producto con el ID ${id}.`);
            }
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}

export default ProductManager;
