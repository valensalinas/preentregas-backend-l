import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import config from '../../config.js';

const collection = config.PRODUCTS_COLLECTION;

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    description: { type: String },
});

schema.plugin(mongoosePaginate);
const model = mongoose.model(collection, schema);

export default model;