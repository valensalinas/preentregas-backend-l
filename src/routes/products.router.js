import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const productsFilePath = path.resolve('src', 'products.json');


router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
    const result = limit ? products.slice(0, limit) : products;
    res.json(result);
});


router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


const validateProduct = (product) => {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    const missingFields = requiredFields.filter(field => !product[field]);
    return missingFields.length ? missingFields : null;
};


router.post('/', async (req, res) => {
    const newProduct = req.body;
    const products = JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
    
    newProduct.id = Date.now().toString(); 

    const missingFields = validateProduct(newProduct);
    if (missingFields) {
        return res.status(400).json({ message: `Faltan los campos obligatorios: ${missingFields.join(', ')}` });
    }

    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    
    res.status(201).json(newProduct);
});


router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...req.body };

        const missingFields = validateProduct(updatedProduct);
        if (missingFields) {
            return res.status(400).json({ message: `Faltan los campos obligatorios: ${missingFields.join(', ')}` });
        }

        products[productIndex] = updatedProduct;
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});


router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = JSON.parse(await fs.readFile(productsFilePath, 'utf-8'));
    const newProducts = products.filter(p => p.id !== productId);
    
    if (newProducts.length < products.length) {
        await fs.writeFile(productsFilePath, JSON.stringify(newProducts, null, 2));
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

export default router;
