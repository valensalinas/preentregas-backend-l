import express from 'express';

import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const app = express();
const port = 8080;


app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
});