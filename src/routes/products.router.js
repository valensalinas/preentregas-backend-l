import { Router } from 'express';
import ProductController from '../dao/product.controller.js';

const router = Router();
const controller = new ProductController();

router.get('/', async (req, res) => {
    const { page = 1, limit, sort, query } = req.query;
    try {

        const data = await controller.getPaginated(
            parseInt(page),
            limit ? parseInt(limit) : undefined,
            sort,
            query
        );

        res.status(200).render('products', {
            products: data.payload,
            pagination: {
                totalPages: data.totalPages,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                currentPage: data.page,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink: data.prevLink,
                nextLink: data.nextLink,
            },
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const product = await controller.add(productData);
        res.status(201).send({ status: 'success', data: product });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;
