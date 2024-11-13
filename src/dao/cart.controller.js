// cart.controller.js

import cartModel from './models/cart.model.js';
import productModel from './models/product.model.js';

class CartController {
    async getCart(cid) {
        return await cartModel.findById(cid).populate('products.product');
    }

    async addProductToCart(cid, pid, quantity = 1) {
        const cart = await cartModel.findById(cid);
        if (!cart) throw new Error('Cart not found');

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex > -1) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, añadirlo
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cid, pid) {
        return await cartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );
    }

    async updateCart(cid, products) {
        return await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await cartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );
    }

    async clearCart(cid) {
        return await cartModel.findByIdAndUpdate(cid, { products: [] }, { new: true });
    }
}

export default CartController;
