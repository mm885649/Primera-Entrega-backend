import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtén el directorio del archivo actual

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Ruta al archivo JSON

const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Funciones para manejar los datos de los carritos

const getCarts = () => {
const data = fs.readFileSync(cartsFilePath);
return JSON.parse(data);
};

const saveCarts = (carts) => {
fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

// Definición de las rutas

router.post('/', (req, res) => {
const carts = getCarts();
const newCart = {
id: (carts.length + 1).toString(),
products: []
};

carts.push(newCart);
saveCarts(carts);
res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
const carts = getCarts();
const cart = carts.find(c => c.id === req.params.cid);
if (cart) {
res.json(cart.products);
} else {
res.status(404).send('Cart not found');
}
});

router.post('/:cid/product/:pid', (req, res) => {
const carts = getCarts();
const cart = carts.find(c => c.id === req.params.cid);

if (cart) {
const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

if (productIndex !== -1) {
cart.products[productIndex].quantity += 1;
} else {
cart.products.push({ product: req.params.pid, quantity: 1 });
}

saveCarts(carts);
res.status(201).json(cart);
} else {
res.status(404).send('Cart not found');
}
});

export default router;