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

const productsFilePath = path.join(__dirname, '../data/products.json');

// Funciones para manejar los datos de los productos

const getProducts = () => {
const data = fs.readFileSync(productsFilePath);
return JSON.parse(data);
};

const saveProducts = (products) => {
fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Definición de las rutas

router.get('/', (req, res) => {
const products = getProducts();
const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
const products = getProducts();
const product = products.find(p => p.id === req.params.pid);

if (product) {
res.json(product);
} else {
res.status(404).send('Product not found');
}
});

router.post('/', (req, res) => {
const products = getProducts();
const newProduct = {
id: (products.length + 1).toString(),
req.body,
status: req.body.status !== undefined ? req.body.status : true
};

products.push(newProduct);
saveProducts(products);
res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
const products = getProducts();
const index = products.findIndex(p => p.id === req.params.pid);
if (index !== -1) {
products[index] = { products[index], req.body, id: products[index].id };
saveProducts(products);
res.json(products[index]);
} else {
res.status(404).send('Product not found');
}
});

router.delete('/:pid', (req, res) => {
let products = getProducts();
products = products.filter(p => p.id !== req.params.pid);
saveProducts(products);
res.status(204).send();
});

export default router;