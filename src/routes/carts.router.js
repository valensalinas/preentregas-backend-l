// carts.router.js

import { Router } from 'express';
import CartController from '../dao/cart.controller.js';

const router = Router();
const controller = new CartController();

router.get('/:cid', async (req, res) => {
    const data = await controller.getCart(req.params.cid);
    res.status(200).send(data);
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await controller.addProductToCart(cid, pid, quantity || 1);
        res.status(200).send({ status: 'success', data: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const data = await controller.removeProductFromCart(req.params.cid, req.params.pid);
    res.status(200).send(data);
});

router.put('/:cid', async (req, res) => {
    const data = await controller.updateCart(req.params.cid, req.body.products);
    res.status(200).send(data);
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { quantity } = req.body;
    const data = await controller.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    res.status(200).send(data);
});

router.delete('/:cid', async (req, res) => {
    const data = await controller.clearCart(req.params.cid);
    res.status(200).send(data);
});

export default router;
