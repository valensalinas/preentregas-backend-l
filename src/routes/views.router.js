import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get('/products', async (req, res) => {
    try {
        const data = await fs.readFile(path.resolve(__dirname, '../products.json'), 'utf-8');
        const productos = JSON.parse(data);
        res.render('index', { productos });
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        res.status(500).send('Error al cargar los productos');
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const data = await fs.readFile(path.resolve(__dirname, '../products.json'), 'utf-8');
        const productos = JSON.parse(data);
        res.render('realTimeProducts', { productos });
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        res.status(500).send('Error al cargar la vista de productos en tiempo real');
    }
});

export default router;
