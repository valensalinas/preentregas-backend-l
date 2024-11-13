import { Router } from 'express';
import OrderController from '../dao/orders.controller.js';

const router = Router();
const controller = new OrderController();

router.get('/', async (req, res) => {
    const data = await controller.get();
    res.status(200).send({ error: null, data: data });
});


router.get('/paginated', async (req, res) => {
    const { page = 1, limit, sort, query } = req.query;

    const data = await controller.getPaginated(
        parseInt(page),   
        limit ? parseInt(limit) : undefined,
        sort,
        query
    );

    res.status(200).send(data);
});


router.get('/stats/:size?', async (req, res) => {
    const size = req.params.size || 'medium';
    const data = await controller.stats(size);
    res.status(200).send({ error: null, data: data });
});

export default router;
