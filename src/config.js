import * as url from 'url';


const config = {
    PORT: 5050,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/uploads` },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/test',
    MONGODB_URI: 'mongodb+srv://valensalinascoder:valensalinascoder@cluster0.ded8d.mongodb.net/',
    USERS_COLLECTION: 'users',
    CARTS_COLLECTION: 'carts',
    PRODUCTS_COLLECTION: 'products',
    ORDERS_COLLECTION: 'orders',
    ITEMS_PER_PAGE: 10
};


export default config;
