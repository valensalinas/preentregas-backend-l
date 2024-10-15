import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.json());


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/products', productsRouter);
app.use('/', viewsRouter);


async function guardarProductos(productos) {
    await fs.writeFile(path.resolve(__dirname, 'products.json'), JSON.stringify(productos, null, 2));
}


async function cargarProductos() {
    const data = await fs.readFile(path.resolve(__dirname, 'products.json'), 'utf-8');
    return JSON.parse(data);
}


io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');


    cargarProductos().then((productos) => {
        productos.forEach((producto) => {
            socket.emit('actualizarProductos', producto);
        });
    });


    socket.on('productoNuevo', async (producto) => {
        try {
            const productos = await cargarProductos();
            productos.push(producto);
            await guardarProductos(productos);
            io.emit('actualizarProductos', producto);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });


    socket.on('productoEliminado', async (productoId) => {
        try {
            let productos = await cargarProductos();
            productos = productos.filter((producto) => producto.id !== productoId);
            await guardarProductos(productos);
            io.emit('actualizarProductos', { id: productoId, eliminado: true });
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
