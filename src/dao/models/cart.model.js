import mongoose from 'mongoose';
import config from '../../config.js';

const collection = config.CARTS_COLLECTION;

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: config.PRODUCTS_COLLECTION },
            quantity: { type: Number, required: true }
        }
    ]
});

const model = mongoose.model(collection, cartSchema);

export default model;
