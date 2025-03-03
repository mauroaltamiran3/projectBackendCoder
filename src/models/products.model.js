import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        required: true,
        trim: true
    },
    code: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    category: { 
        type: String, 
        required: true,
        trim: true
    },
    image: { 
        type: [String], 
        validate: {
            validator: function (array) {
                return array.every(url => typeof url === 'string' && url.trim() !== '');
            },
            message: 'Las URLs de las imágenes deben ser cadenas no vacías.'
        }
    }
});

export const productsModel = mongoose.model('products', productSchema);