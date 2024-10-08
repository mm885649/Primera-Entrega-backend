import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 8080;

app.use(express.json()); // Permite recibir JSON en las peticiones
app.use(express.urlencoded({ extended: true })); // Permite enviar información desde la URL

// Configura las rutas

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicia el servidor

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = [];

// Rutas
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

app.post('/addproduct', (req, res) => {
    const product = req.body;
    products.push(product);
    io.emit('productAdded', product);
    res.redirect('/realtimeproducts');
  });

app.post('/deleteproduct', (req, res) => {
    const { id } = req.body;
    products = products.filter(product => product.id !== id);
    io.emit('productDeleted', id);
    res.redirect('/realtimeproducts');
  });

// Configuración de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.emit('products', products);
});



