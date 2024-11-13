import productModel from './models/product.model.js';
import config from '../config.js';

class ProductController {
    constructor() {}

    getPaginated = async (page = 1, limit = config.ITEMS_PER_PAGE, sort = null, query = null) => {
        try {
            const filter = query ? { $or: [{ category: query }, { availability: query }] } : {};
            const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

            const result = await productModel.paginate(filter, {
                limit,
                page,
                sort: sortOption,
                lean: true
            });

            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
            };
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    add = async (data) => {
        try {
            return await productModel.create(data);
        } catch (err) {
            throw new Error(err.message);
        }
    };
}

export default ProductController;
