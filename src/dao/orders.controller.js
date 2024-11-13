import orderModel from './models/order.model.js';
import config from '../config.js';

class OrderController {
    constructor() {}

    // Método para obtener todos los pedidos sin paginación (sin cambios)
    get = async () => {
        try {
            return await orderModel.find().lean();
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    // Método mejorado para obtener datos paginados con filtros, ordenamiento y límite
    getPaginated = async (page = 1, limit = config.ITEMS_PER_PAGE, sort = null, query = null) => {
        try {
            const filter = query ? { $or: [{ category: query }, { availability: query }] } : {}; // Ejemplo de filtro
            const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

            // Realizamos la paginación y el ordenamiento según los parámetros
            const result = await orderModel.paginate(filter, {
                limit,
                page,
                sort: sortOption,
                lean: true
            });

            // Formateamos el resultado en el formato solicitado
            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/paginated/${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `/paginated/${result.nextPage}` : null
            };
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    // Método para agregar un nuevo pedido (sin cambios)
    add = async (data) => {
        try {
            return await orderModel.create(data);
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    // Método para actualizar un pedido (sin cambios)
    update = async (filter, updated, options) => {
        try {
            return await orderModel.findOneAndUpdate(filter, updated, options);
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    // Método para eliminar un pedido (sin cambios)
    delete = async (filter, options) => {
        try {
            return await orderModel.findOneAndDelete(filter, options);
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };

    // Método para obtener estadísticas de pedidos (sin cambios)
    stats = async (size) => {
        try {
            return await orderModel.aggregate([
                { $match: { size: size } }, // stage 1
                { $group: { _id: '$name', totalQuantity: { $sum: '$quantity' } } }, // stage 2
                { $sort: { totalQuantity: -1 } } // stage 3, sort -> 1: asc, -1: desc
            ]);
        } catch (err) {
            return { status: 'error', message: err.message };
        }
    };
}

export default OrderController;
