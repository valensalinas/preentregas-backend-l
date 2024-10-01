import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const cartsFilePath = path.resolve('src', 'carts.json');


router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const carts = JSON.parse(await fs.readFile(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === cartId);
    
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});


router.post('/', async (req, res) => {
    const newCart = { id: Date.now().toString(), products: [] };
    const carts = JSON.parse(await fs.readFile(cartsFilePath, 'utf-8'));
    carts.push(newCart);
    
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});


router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    const carts = JSON.parse(await fs.readFile(cartsFilePath, 'utf-8'));
    const cart = carts.find(c => c.id === cartId);

    if (cart) {
        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

export default router;
